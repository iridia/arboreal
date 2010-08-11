<?php

//	Template Name: Blog

	function arPresentPresets () {
	
		arLinkAssociatedController("blog");
		
		echo "<script type=\"text/javascript\">";
		
		echo <<< END
		
		var arboreal = arboreal || {};
		arboreal.presets = arboreal.presets || {};
		arboreal.presets.pages = arboreal.presets.pages || {};
		
END;
		
		echo "arboreal.presets.pages.currentPage = " . json_encode(array(
		
			
		
		));
				
		echo "</script>";
	
	}
	
	add_action('wp_head', 'arPresentPresets');
	
	
	
	
	
	get_header();
	
	thematic_abovecontainer();	
	thematic_abovecontent();
	
	the_post();
	
	thematic_abovepost();
	
?>










<section class="context"><article>

<?php 	while ( have_posts() ) {

		the_post();

?>
	
	<article>
	
		<header>
	
			<h2><?php the_title(); ?></h2>
			
			<ul class="actions">
			
				<li><a class="comments" href="<?php comments_link(); ?>"><span class="count"><?php comments_number("0", "1", "%"); ?></span> <span>Comments</span></a></li>
			
			</ul>
		
		</header>

		<?php the_content(); ?>
		
		<footer>
		
			<a class="more" href="mockup.blog.single.html">繼續閱讀</a>
			<a class="shareArticle">分享文章</a>
			
			<span class="author"><?php the_author(); ?></span>
			
			<time datetime="2010-04-25"><?php echo get_the_date("Y-m-d h:m") ?></time>
			
			<?php echo arListElements(get_the_category()); ?>		
			
			<?php the_tags("<ul class=\"tags\"><li>", "</li><li>", "</li></ul>"); ?>
		
		</footer>
	
	</article>
		
<?php	} 

?></article></section>





<?php
	        
		thematic_belowpost();	        
	        thematic_belowcontent();
		thematic_belowcontainer();	

		get_footer();

?>




