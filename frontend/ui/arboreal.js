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
			
			if (isDebugging) {
			
				return function (thePath) {
				
					if ((/\.js$/).exec(thePath)) {

						return "ui/" + thePath + "?t=" + String(Number((new Date())));
					
					}
					
					return "ui/" + thePath;
				
				};
			
			}
			
			return function (thePath) {
				
				return "ui/" + thePath;
				
			};
				
		})(arboreal && arboreal.debugMode || false);
		
		
		var _c = function _c (controllerName) {
		
			return _("arboreal.controller." + controllerName + ".js");
			
		};
		
		
		
		
		
		JSCLASS_PATH = _("lib.jsClass/build/min");
		
		$LAB.script(
		
			_("lib.jsClass/build/min/loader.js"),
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
				
				this.file(_("lib.monoArray/lib.mono.array.js"))
				.provides("Array.prototype.hasObject");
			
			
				this.file(_("lib.irCalendarEngine/lib.iridia.calendarEngine.js"))
				.provides("iridia.calendarEngine")
				.requires("jQuery", "jQuery.jsonp", "JS.Class", "JS.Observable", "Date.prototype.format", "mono");
				
				this.file(_("lib.tidyCJK.js/lib.tidyCJK.js"))
				.provides("mono.tidyCJK")
				.requires("XRegExp");
			
			
			//	Page Controllers
			
				this.file(_c("archetype"))
				.provides("arboreal.controller.archetype", "arboreal.controller.protocol")
				.requires("jQuery", "mono")
				.requires("JS.Singleton", "JS.Class", "JS.Interface");
				
				this.file(_c("portal"))
				.provides("arboreal.controller.portal")
				.requires("arboreal.controller.archetype")
				.requires("iridia.calendarEngine")
				.requires("Array.prototype.hasObject", "mono.tidyCJK");
			
			});
			

			JS.require("arboreal.controller.archetype", function() {
			
				var plausiblePageClass = $("head meta[name='irArborealAssociatedControllerName']").attr("content");
				
				if (!plausiblePageClass) {
				
					return;
					
				}
							
				JS.require("arboreal.controller." + plausiblePageClass, function() {
				
					var plausiblePageController = (arboreal.controller && arboreal.controller[plausiblePageClass] || undefined);
					
					try {
					
						JS.Interface.ensure(plausiblePageController, arboreal.controller.protocol);
					
					} catch (exception) {
					
						return mono.error("Page controller does not implement the required protocol.  Bailing.");
					
					}
									
					arboreal.currentPageController = plausiblePageController;
					
					if (arboreal.currentPageController.configure !== undefined)
					arboreal.currentPageController.configure();
					
					arboreal.currentPageController.initializePage();
				
				});
				
			});
		
		});
	
	})(window);




















var arborealOld = {

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
	
	}

};









