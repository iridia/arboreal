<?php

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
	
	<article>
	
		<header>
	
			<h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
			
			<ul class="actions">
			
				<li><a class="comments" href="<?php comments_link(); ?>"><span class="count"><?php comments_number("0", "1", "%"); ?></span> <span>Comments</span></a></li>
			
			</ul>
		
		</header>
		
		<?php the_content("繼續閱讀"); ?>
		
		<footer>
		
			<a class="more" href="<?php the_permalink(); ?>">永久連結</a>
			<!-- <a class="shareArticle">分享文章</a> -->
			
			<span class="author"><?php the_author(); ?></span>
			
			<time datetime="<?php echo get_the_date("Y-m-d") ?>"><?php echo get_the_date("Y-m-d h:m") ?></time>
			
			<?php echo arListElements(get_the_category()); ?>		
			
			<?php the_tags("<ul class=\"tags\"><li>", "</li><li>", "</li></ul>"); ?>
		
		</footer>
	
	</article>	
	
</article></section>





<?php
	        
		thematic_belowpost();	        
	        thematic_belowcontent();
		thematic_belowcontainer();	

		get_footer();

?>




