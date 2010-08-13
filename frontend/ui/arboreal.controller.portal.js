//	arboreal.controller.portal.js
//	Evadne Wu at Iridia, 2010

	"use strict";





arboreal.controller = arboreal.controller || {};





arboreal.controller.portal = new JS.Singleton(arboreal.controller.archetype, {





//	!Configuration & Initializer

	configure: function() {
	
		this.bindings = {
	
			twitterStreamHolder: $("article section.twitterStream").eq(0),
	
			calendarDateTitle: $("aside .calendar h2").eq(0),
			calendarDateHolder: $("aside .calendar .dates").eq(0),
			calendarDetailsHolder: $("aside .calendar .details").eq(0),
			calendarSubscriptionAnchor: $("aside .calendar .actions a").eq(0),
			
			calendarTooltip: $("aside .calendar .tooltip").eq(0),
			
			galleryHolder: $("ul[irSlidesController*=mainGallery]").eq(0),
			galleryPageControlHolder: $("ul[irPageControl*=mainGallery]").eq(0)
		
		};
		
		this.magicStrings = {
		
			calendarEventTitleOnClosedDay: "公休"
		
		};
		
		this.calendarPredicate = {
	
			mainCalendarStream: {
			
				"calendarID": arboreal.presets.pages.currentPage.irCalendarEngine.mainCalendarStream.calendarID,
				
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
		
		this.initializeTwitterPanel();
		
		this.initializePageControlController();
		this.initializeSlidesController();
		
	},
	
	
	
	

//	!Twitter Panel & irTwitterEngine

	initializeTwitterPanel: function() {
	
		var thisObject = this;
		
		$.getJSON("http://api.twitter.com/1/statuses/user_timeline.json?callback=?", {
			
			"screen_name": arboreal.presets.pages.currentPage.irTwitterEngine.mainTwitterStream.twitterAccount,
			"count": 1
			
		}, function (data) {
		
			var parseURL = function (inString) {
	
				return inString.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&\?\/.=]+/, function(url) {
	
					return url.link(url);
	
				});
	
			};
		
			thisObject.bindings.twitterStreamHolder.find("*[irTwitterEngineTemplate]")
			.children("*[irTwitterEngineTemplate='tweet:text']")
			.html(mono.tidyCJKInTextNodes(parseURL(data[0].text))).find("a").each(function() {
							
				$(this)
				.attr("target", "_blank")
				.text($(this).text().replace(/^http:\/\//, ""));
				
			});
			
		});
		
	},
	
	twitterEngineDidStartLoadingTweets: function (inTwitterEngine) {
	
		mono.log("Twitter engine", inTwitterEngine, "did start loading tweets.");

		var inTwitterStreamContainer = this.bindings.twitterStreamHolder;
		
		inTwitterStreamContainer.attr("irTwitterEngineBusy", "true");
		
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
		
		this.viewsWithClass("irCalendarEngine").each(function (index, object) {
		
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
		
			var dateInElement = (new Date($(dateElement).data("irCalendarDate"))).format("#{YEAR, 2}-#{MONTH, 2}-#{DAY, 2}")
			
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
		var inCalendarItemTemplate = this.bindings.calendarDetailsHolder.find("*[irCalendarEngineTemplate]").eq(0).attr("irCalendarEngineTemplate", "").detach();
		
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
		
			var eventTime = eventObject.startDate;
						
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
			
			eventItem.addClass(
			
				(Number(eventObject.startDate) < Number(new Date())) ? "old" : ""
			
			);
			
			eventItem.find("*[irCalendarEngineTemplate='event:time']")
			.attr("datetime", (function (theTime, isAllDayEvent) {
			
				if (isAllDayEvent) {
				
					return theTime.format("#{YEAR, 2}-#{MONTH, 2}-#{DAY, 2}");
					
				} else {
				
					return eventTime.toISO8601();
				
				}
			
			})(eventTime, eventObject.takesAllDay))
			.text(mono.tidyCJK((function (fromTime) {
			
				var quotedTime = function (inDateObject, withTime) {
				
					if (!(inDateObject instanceof Date)) return "";
				
					return inDateObject.format("(#{MONTH, 2}/#{DAY, 2}" + (withTime ? " #{HOURS, 2}:#{MINUTES, 2}" : "") + ")");
				
				}
				
				
				if (fromTime.isInVicinity(1, "weeks")) return [
				
					fromTime.relativeDateLocalized("days").capitalize(),
					quotedTime(fromTime, !eventObject.takesAllDay)
					
				].join("");
				
				
				if (fromTime.isInVicinity(2, "weeks")) return [
				
					fromTime.relativeDateLocalized("weekdays").capitalize(),
					quotedTime(fromTime, !eventObject.takesAllDay)
					
				].join("");
				
				
				return fromTime.format("#{YEAR, 2}-#{MONTH, 2}-#{DAY, 2} #{HOURS, 2}:#{MINUTES, 2}");
				
			})(eventObject.startDate)));
			
			eventItem.find("*[irCalendarEngineTemplate='event:title']")
			.text(mono.tidyCJK(eventObject.title));
			
			eventItem.find("*[irCalendarEngineTemplate='event:link']")
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
	
		if (this.retryCount === undefined)	
		this.retryCount = 0;
		
		this.retryCount++;
		
		if (this.retryCount > 3)
		return false;
	
		return true;
		
	},
	
	calendarEngineEndpointUnavailable: function (inCalendarEngine) {
	
		mono.log("Calendar engine", inCalendarEngine, "is unavailable.");
		
		this.bindings.calendarDetailsHolder.attr("irCalendarEngineBusy", "error");
		
	},
	
	
	
	
	
	
	
	
	
	
	//! 
	//!Page Control Controller 
	
	
	
	
	
	initializePageControlController: function () {
	
		this.pageControlController = new iridia.pageControlController({
		
			manifestObject: this.bindings.galleryPageControlHolder
		
		});
	
	},
	
	
	
	
	
	
	
	
	
	
	//! 
	//!Slides Controller 
	
	
	
	
	
	slidesControllerWorkers: {},
	
	initializeSlidesController: function () {
	
		var thisObject = this;
	
		this.viewsWithClass("irSlidesController").each(function (index, object) {
		
			var self = $(object);
			
			var slidesControllerPresetKey = self.attr("irSlidesController");
			
			var slidesControllerPreset = arboreal.presets.pages.currentPage.irSlidesController[slidesControllerPresetKey];

			if (slidesControllerPreset == undefined) {
			
				mono.info("Found Slides Controller preset key", slidesControllerPresetKey, "in the DOM without respective preset defined.");
				
				return true;
			
			}
			
			thisObject.slidesControllerWorkers[slidesControllerPresetKey] = new iridia.slidesController($.extend(true, {
			
				containerElement: self	
			
			}, slidesControllerPreset), thisObject, slidesControllerPresetKey);
			
			thisObject.slidesControllerWorkers[slidesControllerPresetKey].start();
			
		});
	
	},
	
	
	/* ([iridia.slidesControllerSlides partial, …]) */ slidesForController: function (slideController) {
	
		mono.log("SlidesController", slideController, "asks for slides under key name", slideController.contextInfo);
		
		var slidesArray = [];
		
		//	Visit the page preset and find out slides, then create objects and arrange them in an array to return as the feedback.
		
		var preset = arboreal.presets.pages.currentPage.irSlidesController[slideController.contextInfo];
		if (preset === undefined) return [];
		
		preset = preset && preset.images || undefined;
		if (preset === undefined) return [];
		
		var thisObject = this;
		
		window.setTimeout(function () {
		
			arboreal.currentPageController.pageControlController.setTotalPages(slideController.slides.length, {
			
				animate: true
			
			});
		
		}, 5);
		
		return preset.map(function (imageURL) {
		
			return {
			
				payloadType: "image",
				payloadResource: imageURL
			
			}
		
		});
			
	},
			
	/* (void) */ slideWillAppear: function (slideController, theSlide) {
	
		this.pageControlController.setTotalPages(slideController.slides.length);
	
		this.pageControlController.setCurrentPageIndex(
			
			slideController.slides.indexOfObject(theSlide)
		
		);
	
	},
	
	/* (void) */ slideDidAppear: function (slideController, theSlide) {
	
		this.pageControlController.setCurrentPageIndex(
			
			slideController.slides.indexOfObject(theSlide)
		
		);
	
	},
				
	/* (void) */ slideWillDisappear: function (slideController, theSlide) {
	
		this.pageControlController.setCurrentPageIndex(null);
	
	},
	
	/* (void) */ slideDidDisappear: function (slideController, theSlide) {
	
		this.pageControlController.setCurrentPageIndex(
		
			slideController.slides.indexOfObject(theSlide)
			
		)
	
	},
	
	/* (Boolean) */ slidesControllerShouldShowSlide: function (slideController, theSlide) {
	
	//	The slides controller would ask the portal controller every time the timer ticks and it is time to advance.  Because the user might have her mouse cursor hoverred over the page control, we need to know this instead of allowing the slides controller to advance undesirably.
	
		if (theSlide != slideController.currentSlide)
		if (this.pageControlController.hoverredPageIndex != slideController.slides.indexOfObject(theSlide))
		return true;

		return false;
	
	},
	
	/* ([(Number) width, (Number) height]) */ defaultSlideSize: function (slideController) {
	
		var theContainer = this.viewsWithClass("irSlidesController").filter("[irSlidesController*=" + slideController.contextInfo +"]").eq(0);
		
		if (theContainer == undefined) return [0, 0];
	
		return [theContainer.width(), theContainer.height()];
	
	},
	
	
	
	
	
	//! Page Control Event Handlers & Helpers
	
	/* (Boolean) */ pageControlShouldChangePage: function () {
	
		//	At this time ask the slides controller to advance to that page
		
		//	page control should have a “interested in this page” variable that gets set to true once the user hovers over a particular page and to false whenever the mouse exits the page dot.  this variable would get queried every time the slides controller is going to advance, and if the mouse is still within the dot the variable would be false, and if the variable is false, it clearly means that the user’s intent to view the corresponding slide has not ceased.
		
		//	Therefore, usually this method call — page control should change page — is going to be a firm YES.
		
		return true;
	
	},
	
	/* (void) */ pageControlDidChangePage: function () {
	
		//	Does nothing
	
	}

});




