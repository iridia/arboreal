//	arboreal.js
//	Evadne Wu at Iridia Productions, 2010.










	var arboreal = arboreal || {};
	
	arboreal.debugMode = true;
	arboreal.presets = arboreal.presets || {};
	
	arboreal.presets.pages = arboreal.presets.pages || {};
	
	arboreal.presets.pages.portal = {
		
		"calendarID": "0lgqdbsiischmeimnpu89bqudo",
		"twitterAccount": "okogreen"
		
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
				
				this.file(_("lib.jQuery.constants/lib.jQuery.constants.js"))
				.provides("jQuery.mnConstants")
				.requires("jQuery");
				
				this.file(_("lib.jQuery.imageLoaded/ahpi.imgload.js"))
				.provides("jQuery.event.special.load")
				.requires("jQuery");
				
			
			//	Mono-family frameworks
				
				this.file(_("lib.monoSnippets/lib.monoSnippets.js"))
				.provides("mono");
				
				this.file(_("lib.monoSnippets/lib.monoSnippets.notificationCenter.js"))
				.provides("mono.notificationCenter")
				.requires("mono");
				
				this.file(_("lib.monoSnippets/lib.monoSnippets.preferencesController.js"))
				.provides("mono.preferencesController")
				.requires("mono");
				
				
				this.file(_("lib.monoString/lib.mono.string.js"))
				.provides("mono.stringAdditions")
				.requires("mono");
				
				this.file(_("lib.monoDate/lib.mono.date.js"))
				.provides("mono.dateAdditions")
				.requires("mono.stringAdditions", "mono");
				
				this.file(_("lib.monoDate/lib.mono.date.localizedStrings.js"))
				.provides("mono.dateAdditionsLocalizedStrings")
				.requires("iridia.localizedString");
				
				this.file(_("lib.monoArray/lib.mono.array.js"))
				.provides("mono.arrayAdditions")
				.requires("mono");
				
				this.file(_("lib.tidyCJK.js/lib.tidyCJK.js"))
				.provides("mono.tidyCJK")
				.requires("XRegExp", "mono");
			
			
			//	Iridia-family Engines
			
				this.file(_("lib.irCalendarEngine/lib.irCalendarEngine.js"))
				.provides("iridia.calendarEngine")
				.requires("jQuery", "jQuery.jsonp", "JS.Class", "JS.Interface", "JS.Observable", "iridia.localizedString", "mono.dateAdditions", "mono.dateAdditionsLocalizedStrings", "mono");
				
				this.file(_("lib.irLocalizedString/lib.irLocalizedString.js"))
				.provides("iridia.localizedString")
				.requires("jQuery", "JS.Class", "mono.arrayAdditions", "mono");
				
				this.file(_("lib.irSlidesController/lib.irSlidesController.js"))
				.provides("iridia.slidesController")
				.requires("jQuery", "JS.Class", "JS.Interface", "mono");
			
			
			//	Flesler frameworks
			
				this.file(_("lib.flesler/jquery.scrollTo/jquery.scrollTo.js"))
				.provides("jQuery.scrollTo")
				.requires("jQuery");
				
			
			//	Page Controllers
			
				this.file(_c("archetype"))
				.provides("arboreal.controller.archetype", "arboreal.controller.protocol")
				.requires("jQuery.jStorage", "jQuery", "mono")
				.requires("JS.Singleton", "JS.Class", "JS.Interface");
				
				this.file(_c("portal"))
				.provides("arboreal.controller.portal")
				.requires("arboreal.controller.archetype")
				.requires("iridia.calendarEngine")
				.requires("iridia.slidesController")
				.requires("mono.dateAdditions", "mono.arrayAdditions", "mono.tidyCJK");
				
				this.file(_c("blog"))
				.provides("arboreal.controller.blog")
				.requires("arboreal.controller.archetype")
				.requires("mono.tidyCJK");
			
			});
			

			JS.require("arboreal.controller.archetype", function() {
			
				var plausiblePageClass = $("head meta[name='irArborealAssociatedControllerName']").attr("content");
				
				if (!plausiblePageClass) {
				
					return;
					
				}
				
				if (window.iridia === undefined)
				iridia = {};
				
				if (iridia.presets === undefined)
				iridia.presets = {};
					
				if (iridia.presets.localizedString === undefined)
				iridia.presets.localizedString = {};
				
				iridia.presets.localizedString.preferredLocales = ["zh-TW", "en-US"];

							
				JS.require("arboreal.controller." + plausiblePageClass, function() {
				
					var plausiblePageController = (arboreal.controller && arboreal.controller[plausiblePageClass] || undefined);
					
					try {
					
						JS.Interface.ensure(plausiblePageController, arboreal.controller.protocol);
					
					} catch (exception) {
					
						return mono.error("Page controller does not implement the required protocol.  Bailing.");
					
					}
									
					arboreal.currentPageController = plausiblePageController;
					
					arboreal.currentPageControllerClass = plausiblePageClass;
					
					
					if (arboreal.currentPageController.configure !== undefined) {

						arboreal.currentPageController.configure();
					
					}
					
					arboreal.currentPageController.initializePage();
				
				});
				
			});
		
		});
	
	})(window);









