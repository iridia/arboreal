//	arboreal.controller.portal.js
//	Evadne Wu at Iridia, 2010

	"use strict";





arboreal.controller = arboreal.controller || {};





arboreal.controller.portal = new JS.Singleton(arboreal.controller.archetype, {

	initializePage: function () {
	
		this.initializeCalendarPanel();
		this.initializeCalendarEngine();
		
	},
	
	
	
	

//	Calendar Panel

	initializeCalendarPanel: function () {
		
		var todayRowPositionTop = $("aside .calendar").find("time.today").position().top;
		var elementsToHide = [];
		
		$("aside .calendar").find("time").each(function (index, dateElement) {
		
			if ($(dateElement).offset().top !== todayRowPositionTop) {

				elementsToHide.push($(dateElement));
				
			}
			
		});
		
		$.each(elementsToHide, function (index, element) {
		
			element.addClass("secondaryDate");
			
		});
		
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
	
	calendarPredicate: {
	
		mainCalendarStream: {
		
			"calendarID": arboreal.presets.calendarID,
			
			"methodImmediatelyExecutes": true,
			"methodName": "fetchEvents",
			"methodArguments": {
			
				"fromDate": (new Date()),
				"toDate": (new Date()).lastDayInMonth()
			
			},
			
			"calendarContainerSelectorString": ".calendar .details"
			
		}
	
	},
	
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
	
		var thePredicate = this.calendarPredicate[inCalendarEngine.options.context];
	//	var inCalendarIdentifier = thePredicate.calendarID;
		var inCalendarContainer = $(thePredicate.calendarContainerSelectorString);
		
		inCalendarContainer.attr("irCalendarEngineBusy", "false");
		
		var inCalendarItemTemplate = inCalendarContainer.children("*[irCalendarEngineTemplate]").eq(0).attr("irCalendarEngineTemplate", "").detach();
		
		inCalendarContainer.empty().attr("irCalendarEngineBusy", "true");
		
				
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
			.text(eventTitle);
			
			eventItem.children("*[irCalendarEngineTemplate='event:link']")
			.attr("href", eventLink)
			.attr("target", "_blank")
			.click(function (event) {
			
				event.stopPropagation();
				
			});
			
			eventItem.click(function (event) {
				
				eventItem.children("*[irCalendarEngineTemplate='event:link']").eq(0).click();
				
			});
			
			eventItem.clone().appendTo(inCalendarContainer);
			
		};
		
								
		$.each(inEvents, function (index, eventObject) {
		
			_handleEvent(eventObject);
			
		});
		
		inCalendarContainer.attr("irCalendarEngineBusy", "false");
				
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




