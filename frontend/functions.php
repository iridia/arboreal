<?php

//	functions.php
//	Project Arboreal
//	Evadne Wu at Iridia, 2010





function irCustomFields ($inIdentifier = FALSE) {

	return $inIdentifier ? get_post_custom($inIdentifier) : get_post_custom();	

}

function irCustomField ($inFieldName = FALSE, $inIdentifier = FALSE) {

	if (!$inFieldName) return "";
	$customFields = irCustomFields($inIdentifier);
	
	if (!$customFields) return FALSE;
	
	if (array_key_exists($inFieldName, $customFields))
	return $customFields[$inFieldName];
	
	return FALSE;

}

function irCustomFieldValue ($inFieldName = FALSE, $inIdentifier = FALSE) {

	$fieldValues = irCustomField($inFieldName, $inIdentifier);
	if (!$fieldValues) return "";
	
	return $fieldValues[0]; 

}

function irPostExcerpt ($inPost = NULL, $inSynthesizedExcerptLength = 20, $inSynthesizedExcerptSuffix = "…") {

	if (mb_strlen($inPost->post_excerpt) > 0)
	return $inPost->post_excerpt;

//	http://www.hoge256.net/2007/10/79.html
//	mb_strimwidth関数では、半角を1文字全角を2文字として計算されるため、それなりにはきれいに揃います。ただ、これはあくまで「それなりに」きれいになるだけで、完全に桁を揃えることは出来ません。なぜなら、表示時の文字の幅はフォントに依存してしまうため、単純に半角1文字、全角2文字で計算しても、きちんと揃わない場合があるからです。
	
	return mb_strimwidth($inPost->post_content, 0, $inSynthesizedExcerptLength, $inSynthesizedExcerptSuffix, "UTF-8");

}





add_action('init', 'arRegisterPostTypes');

function arRegisterPostTypes () {

	foreach (array(
	
		array("report", "媒體報導"),
		
	) as $typeObject) {

		register_post_type($typeObject[0], array(
		
			"labels" => array(
			
				"name" => $typeObject[1],
				"add_new" => "新增" . $typeObject[1],
				"add_new_item" => "新增" . $typeObject[1],
				"edit_item" => "編輯" . $typeObject[1],
				"new_item" => "新" . $typeObject[1],
				"view_item" => "檢視" . $typeObject[1],
				"search_item" => "搜尋" . $typeObject[1]
			
			),
	
			'public' => true,
			'publicly_queryable' => true,
			'_builtin' => false,
			'show_ui' => true, 
			'capability_type' => 'post',
			'show_in_menu' => true, 
			'query_var' => true,
			'menu_position' => 5,
			'supports' => array('title','tags', 'editor','author','thumbnail','excerpt', 'categories'),
			'rewrite' => array( 'slug' => $typeObject[0], 'with_front' => true ),
			'taxonomies' => array("post_tag")
		
		));
	
	}

}




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





function arCreateTransformedStylesheetWithRelativeURL ($theURL) {

	echo apply_filters(
	
		'thematic_create_stylesheet', 
		
		"\t <link rel=\"stylesheet\" type=\"text/css\" href=\""
		. get_bloginfo('stylesheet_directory') . '/ui/arboreal.styles/hack.migrate.php?root=' . get_bloginfo('stylesheet_directory') . '&file=' . $theURL
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
	
//	function childtheme_override_commentmeta () {}
	
	
//	thematic_comments
	
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
	
	
	
	
	
	add_filter("avatar_size", "irCustomAvatarSize");
	
	function irCustomAvatarSize ($inAvatar) {
	
		return 32;
	
	}
	
//	function childtheme_override_commentauthor ()
	
	function childtheme_override_commentmeta ($print = TRUE) {
		
		$content = '<div class="comment-meta">' . sprintf( __('Posted %1$s at %2$s <span class="meta-sep">|</span> <a href="%3$s" title="Permalink to this comment">Permalink</a>', 'thematic' ), get_comment_date(), get_comment_time(), '#comment-' . get_comment_ID() );
							
		if ( get_edit_comment_link() )
		$content .=	sprintf(' <span class="meta-sep">|</span><span class="edit-link"> <a class="comment-edit-link" href="%1$s" title="%2$s">%3$s</a></span>',
						get_edit_comment_link(),
						__( 'Edit comment' ),
						__( 'Edit', 'thematic' ) );
		
		$content .= '</div>' . "\n";
			
		return $print ? print(apply_filters('thematic_commentmeta', $content)) : apply_filters('thematic_commentmeta', $content);

	}

	
	
	
	
?>