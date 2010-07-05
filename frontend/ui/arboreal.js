//	arboreal.js
//	Evadne Wu at Iridia Productions, 2010.










	var arboreal = {
	
		"debugMode": true,
		"presets": {
		
			"calendarID": "0lgqdbsiischmeimnpu89bqudo",
			"twitterAccount": "okogreen"
		
		}
		
	};










//	Dependencies.

	(function arboreal_initialize (global) {
		
		
		var _ = (function(isDebugging) {
			
			if (isDebugging) return function(thePath) {
				
				return "ui/" + thePath + "?t=" + String(Number((new Date())));
				
			};
			
			return function(thePath) {
				
				return "ui/" + thePath;
				
			};
				
		})(arboreal && arboreal['debugMode'] || false);
		
		
		var _c = function _c (controllerName) {
		
			return _("arboreal.controller." + controllerName + ".js");
			
		}
		
		
		
		
		
		JSCLASS_PATH = 'ui/lib.jsClass/build/min/';
		
		$LAB.script(
		
			_("lib.jsClass/build/min/loader.js")
		
		).wait().script(
			
			_("lib.xRegExp/lib.xRegExp.1.5.0.js")
		
		).wait().script(
			
			_("lib.xRegExp/lib.xRegExp.unicode.base.0.5.js"),
			_("lib.xRegExp/lib.xRegExp.unicode.blocks.1.0.js"),
			_("lib.xRegExp/lib.xRegExp.unicode.categories.1.0.js"),
			_("lib.xRegExp/lib.xRegExp.unicode.scripts.1.0.js")
		
		).wait(function() {
		
			JS.Packages(function() {
			
				this.file(_("lib.jquery/dist/jquery.js"))
				.provides("jQuery");
				
			});
			
			JS.Packages(function() {
			
				this.file(_("lib.jquery/dist/jquery.js"))
				.provides("jQuery");
				
				this.file(_("lib.jStorage/jstorage.min.js"))
				.provides("jQuery.jStorage")
				.requires("jQuery");
				
				this.file(_("lib.jquery-jsonp/core/jquery.jsonp.js"))
				.provides("jQuery.jsonp")
				.requires("jQuery");
				
				
				this.file(_("lib.monoSnippets/lib.monoSnippets.js"))
				.provides("mono");
				
				this.file(_("lib.monoSnippets/lib.monoSnippets.notificationCenter.js"))
				.provides("mono.notificationCenter")
				.requires("mono");
				
				this.file(_("lib.monoSnippets/lib.monoSnippets.preferencesController.js"))
				.provides("mono.preferencesController")
				.requires("mono");
				
				
				this.file(_("lib.monoDate/lib.mono.date.js"))
				.provides("Date.prototype.format");
			
			
				this.file(_("lib.irCalendarEngine/lib.iridia.calendarEngine.js"))
				.provides("iridia.calendarEngine")
				.requires("jQuery", "jQuery.jsonp", "JS.Class", "JS.Observable", "Date.prototype.format", "mono");
				
				this.file(_("lib.tidyCJK.js/lib.tidyCJK.js"))
				.provides("mono.tidyCJK")
				.requires("XRegExp");
			
			
			//	Page Controllers
			
				this.file(_c("archetype"))
				.provides("arboreal.controller.archetype", "arboreal.controller.protocol")
				.requires("JS.Singleton", "JS.Class", "JS.Interface", "jQuery", "mono");
				
				this.file(_c("portal"))
				.provides("arboreal.controller.portal")
				.requires("iridia.calendarEngine", "arboreal.controller.archetype");
			
			});
			

			JS.require("arboreal.controller.archetype", function() {
			
				var plausiblePageClass = $("head meta[name='irArborealAssociatedControllerName']").attr("content"); if (!plausiblePageClass) return;
							
				JS.require("arboreal.controller." + plausiblePageClass, function() {
				
					var plausiblePageController = eval("arboreal.controller." + plausiblePageClass);
					
					try {
					
						JS.Interface.ensure(plausiblePageController, arboreal.controller.protocol)
					
					} catch (exception) {
					
						return mono.error("Page controller does not implement the required protocol.  Bailing.");
					
					}
									
					arboreal.currentPageController = plausiblePageController;
					arboreal.currentPageController.initializePage();
				
				});
				
			});
		
		});
	
	})(window);




















var arborealOld = {

	init: function() {
		
	//	this.twitter.init();
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
					
			var todayRowPositionTop = $("aside .calendar").find("time.today").position().top;
			var elementsToHide = [];
			
			$("aside .calendar").find("time").each(function(index, dateElement) {
			
				mono.log("found a time tag, which is ", $(dateElement))
			
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
					
					var eventTitle = eventObject.txitle;
					
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









