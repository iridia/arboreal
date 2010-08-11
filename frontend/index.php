<?php

	get_header();

	thematic_abovecontainer();
	thematic_abovecontent();

	thematic_navigation_above();
	
	get_sidebar('index-top');
	
	thematic_above_indexloop();
	thematic_indexloop();
	thematic_below_indexloop();

	get_sidebar('index-bottom');
	thematic_navigation_below();

	thematic_belowcontent();
	thematic_belowcontainer();

	thematic_sidebar();

	get_footer();

?>




