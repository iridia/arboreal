//	arboreal.controller.portal.js
//	Evadne Wu at Iridia, 2010

	"use strict";





arboreal.controller = arboreal.controller || {};





arboreal.controller.portal = new JS.Singleton(arboreal.controller.archetype, {





//	!Configuration & Initializer

	configure: function() {
	
		this.bindings = {
	
			calendarDateTitle: $("aside .calendar h2:eq(0)"),
			calendarDateHolder: $("aside .calendar .dates"),
			calendarDetailsHolder: $("aside .calendar .details"),
			calendarSubscriptionAnchor: $("aside .calendar .actions a:eq(0)")
		
		};
		
		this.magicStrings = {
		
			calendarEventTitleOnClosedDay: "公休"
		
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
	
	
	
	

//	!Calendar Panel & irCalendarEngine

	initializeCalendarPanel: function () {
	
	//	Lay out today’s dates
		
		this.bindings.calendarDateHolder.empty();
		
		var dateToday = new Date();
		
		this.bindings.calendarDateTitle.text(dateToday.getMonthName() + " " + dateToday.getUTCFullYear());
		
		var daysInThisMonth = dateToday.lastDayInMonth().getDate();
		var dayInMonthOfToday = dateToday.getDate();
		var weekInYearOfToday = dateToday.getWeek();
		
		var templateDate = $("<time>");
		
		for (var theDayInMonth = 1; theDayInMonth <= daysInThisMonth; theDayInMonth ++) {
		
			var theDay = new Date();
			
			theDay.setDate(theDayInMonth);
			
			templateDate.clone().addClass(
			
				(theDayInMonth == dayInMonthOfToday) ? "today" : ""
				
			).addClass(
			
				(Math.abs(theDay.getWeek() - weekInYearOfToday) > 1) ? "secondaryDate" : ""
			
			).attr("datetime", 

				theDay.format("#{YEAR, 4}-#{MONTH, 2}-#{DAY, 2}")
			
			).data("irCalendarDate", 
			
				(new Date(theDay))
				
			).text(String(theDayInMonth)).appendTo(this.bindings.calendarDateHolder);
		
		}
		
	
	//	Find first date, indent properly
				
		var firstDayInCalendar = this.bindings.calendarDateHolder.children("time").eq(0);
		firstDayInCalendar.addClass("leading" + firstDayInCalendar.data("irCalendarDate").getDateName());
	
	
	//	Wire up “Subscribe”
	
		this.bindings.calendarSubscriptionAnchor.attr("href", iridia.calendarEngineGetSubscriptionURLWithIdentifier(this.calendarPredicate.mainCalendarStream.calendarID));
		
	},
	
	initializeCalendarEngine: function () {
	
		var thisObject = this;
		
		$("*[irCalendarEngine]").each(function (index, object) {
		
			var self = $(object);
			var calendarEnginePredicateKey = self.attr("irCalendarEngine");
			var calendarEnginePredicate = thisObject.calendarPredicate[calendarEnginePredicateKey];

			if (calendarEnginePredicate == undefined) {
			
				mono.info("Found Calendar Engine predicate key", calendarEnginePredicateKey, "in the DOM without respective predicate defined.");
				
				return true;
			
			}
			
			thisObject.calendarWorkers[calendarEnginePredicateKey] = new iridia.calendarEngine(calendarEnginePredicate, thisObject, calendarEnginePredicateKey);
			
		});
		
	},
	
	calendarPanelItemForDay: function (inDate) {
	
		var dateToFind = new Date(inDate).format("#{YEAR, 2}-#{MONTH, 2}-#{DAY, 2}");
		
		var foundElement = undefined;
	
		this.bindings.calendarDateHolder.children("time").each(function(index, dateElement) {
		
			var dateInElement = new Date($(dateElement).data("irCalendarDate")).format("#{YEAR, 2}-#{MONTH, 2}-#{DAY, 2}")
			
			if (dateInElement == dateToFind) {
			
				foundElement = $(dateElement);
				return false;
			
			}
			
		});
		
		return foundElement;
		
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
		var inCalendarContainer = this.bindings.calendarDetailsHolder;
		var inCalendarItemTemplate = this.bindings.calendarDetailsHolder.children("*[irCalendarEngineTemplate]").eq(0).attr("irCalendarEngineTemplate", "").detach();
		
		this.bindings.calendarDetailsHolder.empty().attr("irCalendarEngineBusy", "true");
		
		$.each(inEvents, function (index, eventObject) {
		
			if (eventObject.private) {
			
				return true;
				
			}
			
			if (eventObject.title.match(thisObject.magicStrings.calendarEventTitleOnClosedDay) != null) {
			
				thisObject.calendarPanelItemForDay(eventObject.startDate).addClass("closed");
				return true;
			
			}
			
		
		//	Event object deserves a place in the details list
							
			var eventItem = inCalendarItemTemplate.clone();
		
			var eventTimeString = eventObject.startDate.format("#{YEAR, 2}-#{MONTH, 2}-#{DAY, 2} #{HOURS, 2}:#{MINUTES, 2}");
						
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
			
			
		//	Create the DOM items and insert them into the calendar’s details holder.
		//	FIXME: relatize the time in event:time’s text.
			
			eventItem.addClass(
			
				(Number(eventObject.startDate) < Number(new Date())) ? "old" : ""
			
			);
			
			eventItem.children("*[irCalendarEngineTemplate='event:time']")
			.attr("datetime", eventTimeString)
			.text(eventTimeString);
			
			eventItem.children("*[irCalendarEngineTemplate='event:title']")
			.text(mono.tidyCJK(eventObject.title));
			
			eventItem.children("*[irCalendarEngineTemplate='event:link']")
			.attr("href", eventLink)
			.attr("target", "_blank");
			
			eventItem.appendTo(thisObject.bindings.calendarDetailsHolder);
			
			thisObject.bindings.calendarDateHolder.children("time").each(function(index, dateElement) {
			
				if (eventObject.startDate.getDate() != $(dateElement).data("irCalendarDate").getDate()) return true;
				
				$(dateElement).addClass("active");
				
			});
			
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
		
	},
	
	calendarEngineEndpointUnavailable: function (inCalendarEngine) {
	
		mono.log("Calendar engine", inCalendarEngine, "is unavailable.");
		
		this.bindings.calendarDetailsHolder.attr("irCalendarEngineBusy", "error");
		
	}

});




