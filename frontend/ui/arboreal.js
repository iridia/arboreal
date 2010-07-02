//	arboreal.js
//	Evadne Wu at Iridia Productions, 2010.










//	Framework Wrapper

	function _(thePath) {
	
		return "ui/" + thePath;
		
	}





//	Dependencies.  We load all the required framework here.

	function _arboreal_initialize() {

		$LAB.script(
		
			_("lib.jquery/dist/jquery.js"),
			_("lib.monoSnippets/lib.monoSnippets.js")
		
		).wait().script(
		
			_("lib.jsClass/build/min/loader.js")
			
		).wait().script(
		
			_("lib.monoDate/lib.mono.date.js"),
			
			_("lib.xRegExp/lib.xRegExp.1.5.0.js"),
			_("lib.xRegExp/lib.xRegExp.unicode.base.0.5.js"),
			_("lib.xRegExp/lib.xRegExp.unicode.blocks.1.0.js"),
			_("lib.xRegExp/lib.xRegExp.unicode.categories.1.0.js"),
			_("lib.xRegExp/lib.xRegExp.unicode.scripts.1.0.js"),
			
			_("lib.tidyCJK.js/lib.tidyCJK.js")
			
		).wait().script(
		
			_("lib.monoSnippets/lib.monoSnippets.notificationCenter.js"),
			_("lib.monoSnippets/lib.monoSnippets.preferencesController.js"),
			_("lib.monoTwitterEngine/lib.mono.twitterEngine.js")
		
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
			
				var tweetObject = $("*[irTwitterEngine]").eq(0).children("*[irTwitterEngineTemplate]");
				tweetObject.children("*[irTwitterEngineTemplate='tweet:text']").text(mono.tidyCJK(data[0].text));
				
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
		
			"mainCalendarStream": {
			
				"calendarID": "0lgqdbsiischmeimnpu89bqudo",
				"calendarContainerSelectorString": ".calendar .details"
				
			}
		
		},
		
		workers: {},
	
		init: function() {
		
			$("*[irCalendarEngine]").each(function(index, object) {
			
				var self = $(object);
				var calendarEnginePredicateKey = self.attr("irCalendarEngine");
				var calendarEnginePredicate = arboreal.calendar.predicates[calendarEnginePredicateKey]
				if (calendarEnginePredicate == undefined) return false;
				
				arboreal.calendar.workers[calendarEnginePredicateKey] = new  arboreal.calendar.engineWithPredicate(calendarEnginePredicate);
				
			});
			
			
			
			
			
			var todayRowPositionTop = $("aside .calendar").children("time.today").position().top;
			var elementsToHide = [];
			
			$("aside .calendar").children("time").each(function(index, dateElement) {
			
				if ($(dateElement).offset().top != todayRowPositionTop)
				elementsToHide.push($(dateElement));
				
			});
			
			$.each(elementsToHide, function(index, element) {
			
				element.addClass("secondaryDate");
				
			});
			
		},
	
		engineWithPredicate: function(inPredicate) {
		
			var inCalendarIdentifier = inPredicate['calendarID'];
			var inCalendarContainer = $(inPredicate['calendarContainerSelectorString']);
			var inCalendarItemTemplate = inCalendarContainer.children("*[irCalendarEngineTemplate]").eq(0).attr("irCalendarEngineTemplate", "");
			
			inCalendarContainer.empty().attr("irCalendarEngineBusy", "true");
			
			$.getJSON(arboreal.calendar.baseURLWithIdentifier(inCalendarIdentifier), {
			
				"start-min": (new Date()).format("#{YEAR, 4}-#{MONTH, 2}-01"),
				"start-max": (new Date()).nextMonth().previousDay().format("#{YEAR, 4}-#{MONTH, 2}-#{DAY, 2}")
			
			}, function(data) {
			
				inCalendarContainer.attr("irCalendarEngineBusy", "");
				
				if (data.feed.entry === undefined) return;
				
				var eventEntries = data.feed.entry;
				
				var _handleEvent = function(eventObject) {
				
					var eventItem = inCalendarItemTemplate.clone();
				
					var eventTime = eventObject.startDate;
					var eventTimeString = eventTime.format("#{YEAR, 2}-#{MONTH, 2}-#{DAY, 2} #{HOURS, 2}:#{MINUTES, 2}");
					
					var eventTitle = eventObject.title;
					
					var eventLink = (function() {
					
						var linkHref = "";
						
						$.each(eventObject.link, function(index, linkType) {
						
							if (linkType.type != "text/html") return true;

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
					.click(function(event) {
					
						event.stopPropagation();
						
					});
					
					eventItem.click(function(event) {
						
						eventItem.children("*[irCalendarEngineTemplate='event:link']").eq(0).click();
						
					});
					
					eventItem.appendTo(inCalendarContainer);
					
				}
				
				var regulatedEventObjects = $.map(eventEntries, function(eventObject) {
				
					var eventTime = eventObject['gd$when'] && eventObject['gd$when'][0] || {};
					var eventStartTime = eventTime && eventTime.startTime || "";
					var eventStartDate = Date.fromISO8601(eventStartTime);
				
					return {
					
						title: eventObject.title && eventObject.title['$t'] || "",
						content: eventObject.content && eventObject.content['$t'] || "",
						startDate: eventStartDate,
						link: eventObject.link
					
					};
					
				}).sort(function(firstObject, secondObject) {
				
				//	< 0: firstObject comes first
				//	0: ordered same
				//	> 0: secondObject comes first
				
					return (Number(firstObject && firstObject.startDate) - Number(secondObject && secondObject.startDate));
					
				});
				
				
				$.each(regulatedEventObjects, function(index, eventObject) {
				
					_handleEvent(eventObject);
					
				});
				
			});
			
			return this;
			
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




