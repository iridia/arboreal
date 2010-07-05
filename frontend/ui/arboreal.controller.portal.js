//	arboreal.controller.portal.js
//	Evadne Wu at Iridia, 2010





arboreal.controller = arboreal.controller || {};





arboreal.controller.portal = new JS.Singleton(arboreal.controller.archetype, {

	initializePage: function() {
	
		this.initializeCalendar();
		
	},
	
	
	
	

//	Calendar Box
	
	initializeCalendar: function() {
	
		var thisObject = this;
	
		$("*[irCalendarEngine]").each(function(index, object) {
		
			var self = $(object);
			var calendarEnginePredicateKey = self.attr("irCalendarEngine");
			var calendarEnginePredicate = thisObject.calendarPredicate[calendarEnginePredicateKey]
			if (!calendarEnginePredicate) return false;
			
			thisObject.calendarWorkers[calendarEnginePredicateKey] = new iridia.calendarEngine(calendarEnginePredicate, thisObject);
			
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
	
	calendarEngineDidLoad: function(inCalendarEngine) {
	
		mono.log("Calendar engine", inCalendarEngine.hash(), "did load.");
		
	},
	
	calendarEngineShouldSendRequest: function(inCalendarEngine, inRequest) {
	
		return true;
		
	},
	
	calendarEngineDidStartLoadingEvents: function(inCalendarEngine) {
	
		mono.log("Calendar engine", inCalendarEngine, "did start loading events.");
		
/*
		var inCalendarIdentifier = inPredicate['calendarID'];
		var inCalendarContainer = $(inPredicate['calendarContainerSelectorString']);
		var inCalendarItemTemplate = inCalendarContainer.children("*[irCalendarEngineTemplate]").eq(0).attr("irCalendarEngineTemplate", "");
		
		inCalendarContainer.empty().attr("irCalendarEngineBusy", "true");
*/
	
	},
	
	calendarEngineDidReceiveEvents: function(inCalendarEngine, inEvents) {
	
		mono.log("Calednar engine", inCalendarEngine, "did receive events", inEvents, ".");
		
		$.each(inEvents, function(index, eventObject) {
				
			mono.log("event object", eventObject);
			
		});
		
	},
	
	calendarEngineShouldRetry: function(inCalendarEngine) {
	
		return true;
		
	}

});




