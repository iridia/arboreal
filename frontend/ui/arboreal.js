//	arboreal.js
//	Evadne Wu at Iridia Productions, 2010.










//	Framework Wrapper

	function _(thePath) {
	
		return "ui/" + thePath.replace(/(\.js)$/ig, '') + ".js";
		
	}





//	Dependencies.  We load all the required framework here.

	function _arboreal_initialize() {

		$LAB.script(
		
			_("lib.jquery/dist/jquery.js"),
			_("lib.monoSnippets/lib.monoSnippets")
		
		).wait().script(
		
			_("lib.jsClass/build/min/loader.js")
		
		).wait().script(
		
			_("lib.monoSnippets/lib.monoSnippets.notificationCenter.js"),
			_("lib.monoSnippets/lib.monoSnippets.preferencesController.js"),
			_("lib.monoTwitterEngine/lib.mono.twitterEngine.js"),
			_("lib.monoDate/lib.mono.date.js")
		
		).wait(function() {
		
			arboreal.init();
		
		});

	
	}




















var arboreal = {

	init: function() {
		
		this.twitter.init();
		this.calendar.init();
		
	},
	
	twitter: {
	
		predicates: {
		
			mainTwitterStream: {
			
				account: 'okogreen'
			
			}
		
		},
		
		workers: {},
	
		init: function() {
			
			var thisObject = this;
			
			$.getJSON("http://api.twitter.com/1/statuses/user_timeline.json?callback=?", {
			
				"screen_name": "okogreen",
				"count": 1
				
			}, function (data) {
			
				mono.log(data);
				
			});
			
			$("*[class*='monoTwitterEngine']").each(function() {
			
				var plausibleClass = $(this).attr("class").match(/(monoTwitterEngine)([^\s])+/);
				if (plausibleClass === null) return;
				
				var predicateKey = plausibleClass[0].replace(/(monoTwitterEngine:)/, '');
				var predicate = thisObject.predicates[predicateKey];
				
				if (!predicate) return;
				
				mono.groupStart("Found object that needs a Twitter Engine instance with predicate key", predicateKey);
				
				if (!!thisObject.workers[predicateKey])
				return mono.error("Twitter Engine worker with key", predicateKey, "already exists").groupEnd();
								
				thisObject.workers[predicateKey] = new mono.twitterEngine(predicate);
				
				mono.groupEnd();
				
			});
			
		}
	
	},
		
	twitterEngineDidReceiveData: function(sender, userInfo, data) {
		
		mono.notificationCenter.dispatchNotificationWithKeyAndPredicate("arboreal.twitterStream.receivedData", {
		
			sender: sender,
			userInfo: userInfo,
			data: data
		
		});
	
	},
	
	calendar: {
	
		predicates: {
		
			"mainCalendarStream": "0lgqdbsiischmeimnpu89bqudo"
		
		},
	
		init: function() {
		
			$("*[irCalendarEngine]").each(function(index, object) {
			
				var self = $(object);
				var calendarEnginePredicateKey = self.attr("irCalendarEngine");
				var calendarEnginePredicate = arboreal.calendar.predicates[calendarEnginePredicateKey]
				if (calendarEnginePredicate == undefined) continue;
				
				arboreal.calendar.workers[calendarEnginePredicateKey] = new  arboreal.calendar.engineWithIdentifier(calendarEnginePredicate);
				
			});
			
		},
	
		engineWithIdentifier: function(inIdentifier) {
			
			$.getJSON(arboreal.calendar.baseURLWithIdentifier(inIdentifier), {
			
				"start-min": (new Date()).format("#{YEAR, 4}-#{MONTH, 2}-01"),
				"start-max": (new Date()).nextMonth().previousDay().format("#{YEAR, 4}-#{MONTH, 2}-#{DAY, 2}")
			
			}, function(data) {
				
				if (data.feed.entry === undefined) return;
				
				var eventEntries = data.feed.entry;
				
				var _handleEvent = function(eventObject) {
					
					mono.log("object incoming", 
						
						eventObject, 
						Date.fromISO8601(eventObject.when && eventObject.when.startTime)
						.format("#{YEAR, 2}-#{MONTH, 2}-#{DAY, 2} #{HOURS, 2}:#{MINUTES, 2}")
					
					);
					
				}
				
				$.each(eventEntries, function(index, eventObject) {
				
					mono.log("Raw event object?", eventObject);
				
					_handleEvent({
					
						title: eventObject.title && eventObject.title['$t'] || "",
						content: eventObject.content && eventObject.content['$t'] || "",
						when: eventObject['gd$when'] && eventObject['gd$when'][0] || {}
					
					});
					
				});
				
			});
			
		},
		
		baseURLWithIdentifier: function (inCalendarIdentifier) {
		
			return "http://www.google.com/calendar/feeds/" + String(inCalendarIdentifier) + "@group.calendar.google.com/public/full?alt=json-in-script&callback=?";
		
		}
	
	}

}










// !Section-Specific Code





	arboreal.view = {};
	
	
	
	
	
	arboreal.view.blog = {
	
		init: function() {
		
		//	= new self.articleSharingController () {} … ?
			
		},
		
		predicateController: {
		
		},
		
		shareController: function () {
		
		}
	
	};





















// !Initializer Invocation

_arboreal_initialize();




