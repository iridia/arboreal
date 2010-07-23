//	arboreal.controller.archetype.js
//	Evadne Wu at Iridia, 2010





arboreal.controller = arboreal.controller || {};





arboreal.controller.protocol = new JS.Interface([

	'initializePage'

]);





arboreal.controller.archetype = new JS.Class({

	initializePage: function() {
	
		mono.error("ERROR: initializePage() is not implemented!");
		
	},
	
	viewsWithClass: function (theClass) {
	
		return $("*[" + theClass + "]")
	
	}

});





$(document).ready(function() {

	$("img").each(function() {

		if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
		
			mono.log("this is broken", this);
			
			$(this).fadeOut();
	
		}

	});

});




