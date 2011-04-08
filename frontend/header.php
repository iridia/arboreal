<?php
	
	thematic_create_doctype();
	echo " ";
	
	language_attributes();
	echo ">\n";
	
	thematic_head_profile();	
	thematic_doctitle();    
	thematic_create_contenttype();
	thematic_show_description();
	thematic_show_robots();
	thematic_canonical_url();

	if (strlen(strstr($_SERVER['HTTP_USER_AGENT'], "MSIE")) > 0) {	?>
	
		<script src="<?php bloginfo('template_url'); ?>/../arboreal/ui/lib.html5shiv/html5.js"></script>

<?php		arCreateTransformedStylesheetWithRelativeURL("arboreal.style.css");

	} else {

		arCreateStylesheetWithRelativeURL("ui/arboreal.styles/arboreal.style.css");
	
	} ?>

	<link rel="shortcut icon" href="<?php bloginfo('template_url'); ?>/../arboreal/ui/arboreal.images/arboreal.favicon.png" />

	<script type="text/javascript">
	
		var arboreal = arboreal || {};
		arboreal.baseURI = "<?php bloginfo('template_url') ?>/../arboreal/";
	
	</script>
	
<?php

	

	thematic_show_rss();
	thematic_show_commentsrss();
	thematic_show_pingback();
	thematic_show_commentreply();
	
	wp_head(); ?>
	
</head><body class="<?php thematic_body_class() ?>">
	
	<?php thematic_before(); ?>	
	
	
	
	
	
	<?php thematic_aboveheader(); ?>
	
	<header><?php thematic_header(); ?></header>	
	
	<?php thematic_belowheader(); ?>   
	
	
	
	
	