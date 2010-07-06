//	arboreal.controller.portal.js
//	Evadne Wu at Iridia, 2010

	"use strict";





arboreal.controller = arboreal.controller || {};





arboreal.controller.portal = new JS.Singleton(arboreal.controller.archetype, {

	configure: function() {
	
		this.bindings = {
	
			calendarDateHolder: $("aside .calendar .dates"),
			calendarDetailsHolder: $("aside .calendar .details"),
			calendarSubscriptionAnchor: $("aside .calendar .actions a:eq(0)")
		
		};
		
		this.calendarPredicate = {
	
			mainCalendarStream: {
			
				"calendarID": arboreal.presets.calendarID,
				
				"methodImmediatelyExecutes": true,
				"methodName": "fetchEvents",
				"methodArguments": {
				
					"fromDate": (new Date()),
					"toDate": (new Date()).lastDayInMonth()
				
				},
				
				"calendarContainerSelectorString": this.bindings.calendarDetailsHolder.selector
				
			}
		
		};
		
	},

	initializePage: function () {
	
		this.initializeCalendarPanel();
		this.initializeCalendarEngine();
		
	},
	
	
	
	

//	Calendar Panel

	initializeCalendarPanel: function () {
	
	//	Lay out today’s dates
		
		this.bindings.calendarDateHolder.empty();
		
		var daysInThisMonth = (new Date()).lastDayInMonth().getDate();
		var dayInMonthToday = (new Date()).getDate();
		
		var templateDate = $("<time>");
		
		for (var theDayInMonth = 1; theDayInMonth <= daysInThisMonth; theDayInMonth ++) {
		
			var theDay = new Date();
			theDay.setDate(theDayInMonth);
			
			templateDate.clone()
			.addClass((theDayInMonth == dayInMonthToday) ? "today" : "")
			.attr("datetime", theDay.format("#{YEAR, 4}-#{MONTH, 2}-#{DAY, 2}"))
			.data("irCalendarDate", (new Date(theDay)))
			.text(String(theDayInMonth))
			.appendTo(this.bindings.calendarDateHolder);
		
		}
		
	
	//	Find first date, indent properly
				
		var firstDayInCalendar = this.bindings.calendarDateHolder.children("time").eq(0);
		firstDayInCalendar.addClass("leading" + firstDayInCalendar.data("irCalendarDate").getDateName());
		
		
	//	Dim known closing days
	
		$.each(this.bindings.calendarDateHolder.children("time"), function(index, dateElement) {
		
		//	0 = Sunday, 1 = Monday, etc — this array is hardcoded for now.
		
			if([0, 1].hasObject($(dateElement).data("irCalendarDate").getDay()))
			$(dateElement).addClass("closed");
			
		});
		
		
	//	Hide “secondary dates” — dates not in the current week
		
		var todayRowPositionTop = this.bindings.calendarDateHolder.find("time.today").position().top;
		var elementsToHide = [];
		
		this.bindings.calendarDateHolder.find("time").each(function (index, dateElement) {
		
			if ($(dateElement).offset().top !== todayRowPositionTop) {

				elementsToHide.push($(dateElement));
				
			}
			
		});
		
		$.each(elementsToHide, function (index, element) {
		
			element.addClass("secondaryDate");
			
		});
	
	
	//	Wire up “Subscribe”
	
		this.bindings.calendarSubscriptionAnchor.attr("href", iridia.calendarEngineGetSubscriptionURLWithIdentifier(this.calendarPredicate.mainCalendarStream.calendarID));
		
		
	},
	
	initializeCalendarEngine: function () {
	
		var thisObject = this;
		
		$("*[irCalendarEngine]").each(function (index, object) {
		
			var self = $(object);
			var calendarEnginePredicateKey = self.attr("irCalendarEngine");
			var calendarEnginePredicate = thisObject.calendarPredicate[calendarEnginePredicateKey];

			if (!calendarEnginePredicate) {
			
				return false;
				
			}
			
			thisObject.calendarWorkers[calendarEnginePredicateKey] = new iridia.calendarEngine(calendarEnginePredicate, thisObject, calendarEnginePredicateKey);
			
		});
		
	},
	
	calendarWorkers: {},
	
	calendarEngineDidLoad: function (inCalendarEngine) {
	
		mono.log("Calendar engine", inCalendarEngine.hash(), "did load.");
		
	},
	
	calendarEngineShouldSendRequest: function (inCalendarEngine, inRequest) {
	
		return true;
		
	},
	
	calendarEngineDidStartLoadingEvents: function (inCalendarEngine) {
	
		mono.log("Calendar engine", inCalendarEngine, "did start loading events.");

		var thePredicate = this.calendarPredicate[inCalendarEngine.options.context];
		var inCalendarContainer = $(thePredicate.calendarContainerSelectorString);
		
		inCalendarContainer.attr("irCalendarEngineBusy", "true");
		
	},
	
	calendarEngineDidReceiveEvents: function (inCalendarEngine, inEvents) {
	
		mono.log("Calendar engine", inCalendarEngine, "did receive events", inEvents, ".");
	
	
	//	Snapshot — we’ll have good use of thisObject down below when we highlight active days
		
		var thisObject = this;
	
	
		var thePredicate = this.calendarPredicate[inCalendarEngine.options.context];
	//	var inCalendarIdentifier = thePredicate.calendarID;
		var inCalendarContainer = this.bindings.calendarDetailsHolder;
		
		this.bindings.calendarDetailsHolder.attr("irCalendarEngineBusy", "false");
		
		var inCalendarItemTemplate = this.bindings.calendarDetailsHolder.children("*[irCalendarEngineTemplate]").eq(0).attr("irCalendarEngineTemplate", "").detach();
		
		this.bindings.calendarDetailsHolder.empty().attr("irCalendarEngineBusy", "true");
		
				
		var _handleEvent = function (eventObject) {
				
			var eventItem = inCalendarItemTemplate.clone();
		
			var eventTime = eventObject.startDate;
			var eventTimeString = eventTime.format("#{YEAR, 2}-#{MONTH, 2}-#{DAY, 2} #{HOURS, 2}:#{MINUTES, 2}");
			
			var eventTitle = eventObject.title;
			
			var eventLink = (function () {
			
				var linkHref = "";
				
				$.each(eventObject.link, function (index, linkType) {
				
					if (linkType.type !== "text/html") {
					
						return true;
						
					}

					linkHref = (linkType && linkType.href || "");
					return false; 
					
				});
				
				return linkHref;
			
			})();
			
			
		//	FIXME: relatize the time.
			
			eventItem.children("*[irCalendarEngineTemplate='event:time']")
			.attr("datetime", eventTimeString)
			.text(eventTimeString);
			
			eventItem.children("*[irCalendarEngineTemplate='event:title']")
			.text(mono.tidyCJK(eventTitle));
			
			eventItem.children("*[irCalendarEngineTemplate='event:link']")
			.attr("href", eventLink)
			.attr("target", "_blank")
			.click(function (event) {
			
				event.stopPropagation();
				
			});
			
			eventItem.click(function (event) {
				
				eventItem.children("*[irCalendarEngineTemplate='event:link']").eq(0).click();
				
			});
			
			eventItem.appendTo(thisObject.bindings.calendarDetailsHolder);
			
			thisObject.bindings.calendarDateHolder.children("time").each(function(index, dateElement) {
			
				if (eventTime.getDate() == $(dateElement).data("irCalendarDate").getDate()) {
				
					$(dateElement).addClass("active");
					return true;
				
				}
				
			});
			
		};
						
		$.each(inEvents, function (index, eventObject) {
		
			_handleEvent(eventObject);
			
		});
		
		this.bindings.calendarDetailsHolder.attr("irCalendarEngineBusy", "false");
				
	},
	
	calendarEngineShouldRetry: function (inCalendarEngine) {
	
		if (this.retryCount === undefined) {
		
			this.retryCount = 0;
		
		}
		
		this.retryCount++;
		
		if (this.retryCount > 3) {
		
			return false;
			
		}
	
		return true;
		
	}

});




