<?php

//	functions.php
//	Project Arboreal
//	Evadne Wu at Iridia, 2010










//	! 
//	!Helpers

function u8strlen ($string) { return strlen(utf8_decode($string)); }





function arCreateStylesheetWithRelativeURL ($theURL) {

	echo apply_filters(
	
		'thematic_create_stylesheet', 
		
		"\t <link rel=\"stylesheet\" type=\"text/css\" href=\""
		. get_bloginfo('stylesheet_directory') . '/' . $theURL
		. "\" />"
		. "\n\n"
	
	);

}





function arLinkAssociatedController ($named) {

	echo "<meta name=\"irArborealAssociatedControllerName\" content=\"" . $named . "\" />";

}





function arGenerateExcerpt ($incomingText = "", $maximumAllowedLength = 75, $wrapperElementTagName = "p") {

	$responseText = "";
	
	$contentInParagraphs = explode("</" . $wrapperElementTagName . ">", $incomingText);
	
	foreach ($contentInParagraphs as $paragraph) {
	
		$responseText .= strip_tags($paragraph, "<p>") . "</" . $wrapperElementTagName . ">";
				
		if ((u8strlen($responseText) + u8strlen($paragraph)) >= $maximumAllowedLength)
		break;
		
	}

	return strip_tags($responseText);

}










function arHeader () {

	echo preg_replace(
	
		array("/BLOG_URL/", "/BLOG_NAME/"),
		array(get_bloginfo('url'), get_bloginfo('name')),
		
		"<h1><a href=\"BLOG_URL\"><span>BLOG_NAME</span></a></h1>"
	
	);
	
	echo "<nav><ul>";
	
	echo preg_replace(
	
		array("/current_page_item/"),
		array("active"),
	
		wp_list_pages(array(
		
			"title_li" => "",
			"depth" => 1,		//	Depth = 1 means flat
			"echo" => 0
			
		))
	
	);
	
	echo "</ul></nav>";

}





function arInjectScriptBaseURI () {

	echo "<script type=\"text/javascript\">";
	
	echo "var arboreal = " . json_encode(
	
		array(
		
			"baseURI" => get_bloginfo('template_url') . "/../arboreal/"
		
		)
		
	);
	
	echo "</script>";

}





function arListElements ($categoriesOrNothing) {

	if (count($categoriesOrNothing) == 0) return "";
	
	$responseString = "";
	
	$responseString .= "<ul class=\"categories\">";
	
	foreach($categoriesOrNothing as $category) { 

		$responseString .= "<li><a href=\"" . get_category_link($category->cat_ID) . "\">" . $category->cat_name . "</a></li>";
			
	}	
	
	$responseString .= "</ul>";
	
	return $responseString;
		
}










//	! 
//	!Thematic Overrides

//	Thematic checks existance of childtheme_override_* and substitutes content in its function calls with calls to the overriding functions once found, but the hook is not registered if the functions are overriden.  Therefore, creating empty functions nullifies them; we simply wire a catch-all function to the hook that does everything.
	
	function childtheme_override_brandingopen () {}
	function childtheme_override_blogtitle () {}
	function childtheme_override_blogdescription () {}
	function childtheme_override_brandingclose () {}
	function childtheme_override_access () {}
	
	function childtheme_override_index_loop () {}
	function childtheme_override_single_post () {}
	
//	Override head scripts so superfish, supersubs, hoverintent and thematic-dropdowns do not get loaded; 
	function childtheme_override_head_scripts () {}
	
	if (!is_admin()) {
	
		add_action('wp_head', 'arInjectScriptBaseURI');
		add_action('thematic_header', 'arHeader', 1);

		wp_enqueue_script(
	
			"LABjs", 
			get_bloginfo('template_url') . "/../arboreal/ui/lib.LABjs/LAB.src.js"
			
		);
		
		wp_enqueue_script(
		
			"arboreal", 
			get_bloginfo('template_url') . "/../arboreal/ui/arboreal.js",
			array("LABjs")
			
		);
	
	}
	
	
	
	
	
?>