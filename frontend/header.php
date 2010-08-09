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
	
?>

	<link rel="shortcut icon" href="<?php bloginfo('template_url'); ?>/../arboreal/ui/arboreal.images/arboreal.favicon.png" />

	<script type="text/javascript">
	
		var arboreal = arboreal || {};
		arboreal.baseURI = "<?php bloginfo('template_url') ?>/../arboreal/";
	
	</script>
	
<?php

	arCreateStylesheetWithRelativeURL("ui/arboreal.styles/arboreal.style.css");

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
	
	
	
	
	