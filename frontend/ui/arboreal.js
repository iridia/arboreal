//	arboreal.js
//	Evadne Wu at Iridia Productions.





//	Framework Wrapper

	function _(thePath) { return "ui/" + thePath.replace(/(\.js)$/ig, '') + ".js" };





//	!Dependencies

	function _arboreal_initialize() {

		$LAB.script(
		
			_("lib.jquery/dist/jquery.js"),
			_("lib.monoSnippets/lib.monoSnippets")
		
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
		
	},
	
	twitter: {
	
		predicates: {
		
			mainTwitterStream: {
			
				account: 'okogreen',
				delegate: this.twitter
			
			}
		
		},
		
		workers: {},
	
		init: function() {
			
			var thisObject = this;
			
			$("*[class*='monoTwitterEngine']").each(function() {
			
				var plausibleClass = $(this).attr("class").match(/(monoTwitterEngine)([^\s])+/);
				if (plausibleClass == null) return;
				
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




