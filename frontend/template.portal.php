<?php

//	Template Name: Portal

	function arPresentPresets () {
	
		arLinkAssociatedController("portal");
		
	?>
	
			<script type="text/javascript">
		
				var arboreal = arboreal || {};
				arboreal.presets = arboreal.presets || {};
				arboreal.presets.pages = arboreal.presets.pages || {};
				arboreal.presets.pages.currentPage = <?php echo json_encode(array(
			
				"irSlidesController" => array(
				
					"mainGallery" => array(
					
						"interval" => 5,
						
						"images" => array(
						
							get_bloginfo('template_url') . "/../arboreal/placebo/placebo.portal.roulette.01.png",
							get_bloginfo('template_url') . "/../arboreal/placebo/placebo.portal.roulette.02.png"
							
						)
					
					)
				
				),
				
				"irTwitterEngine" => array(
				
					"mainTwitterStream" => array(
					
						"twitterAccount" => "okogreen"
					
					)
				
				),
				
				"irCalendarEngine" => array(
				
					"mainCalendarStream" => array(
					
						"calendarID" => "iridia.tw_4ricig5f23dl5ols3jji2b3nq0@group.calendar.google.com"
					
					)
				
				)
			
			)); ?>
			
			</script>
	
	<?php
	
	}
	
	add_action('wp_head', 'arPresentPresets');
	
	
	
	
	
	get_header();
	
	thematic_abovecontainer();	
	thematic_abovecontent();
	
	the_post();
	
	thematic_abovepost();
	
?>










<ul irSlidesController="mainGallery" class="gallery loading">

	<li class="spotties" irSlidesControllerConfiguration="ignore"><ul irPageControl="mainGallery">
		
	</ul></li>

</ul>





<section class="context">
	
	<article>
	
		<section style="float:right; width: 128px;" irTwitterEngine="mainTwitterStream" class="twitterStream"><div irTwitterEngineTemplate="true">
		
			<span irTwitterEngineTemplate="tweet:text"></span>
			
			<a title="more" irTwitterEngineTemplate="tweet:link" href="##"><span>&nbsp;</span></a>
			
		</div></section>
		
		<section style="float:left; width: 268px; margin-top: -9px;">
		
		<?php

			global $post;
			$recentPosts = get_posts('numberposts=2');

			foreach($recentPosts as $post) {
	
				setup_postdata($post);

		?>

			<article class="blogPosts" style="margin-top:0px; margin-bottom:0px; padding-bottom:0px;">

		
				<h2><a href="<?php the_permalink(); ?>" style="display:block;"><time datetime="<?php echo get_the_date("Y-m-d") ?>"><?php echo get_the_date("m/d"); ?></time><?php the_title(); ?></a></h2>
				
				<p style="margin-bottom:0px;"><?php 
				
					echo arGenerateExcerpt(apply_filters('the_content', get_the_content()), 150, "p");
				
				?> <a href="<?php the_permalink(); ?>" class="noop" style="text-decoration:underline;" title="More…"><span>More &raquo; </span></a></p>
			
			</article>		
				
		<?php } ?>

		</section>
	
	</article>
	
	
	
	
	
	<aside>
	
		<section class="calendar">
		
			<h2>&nbsp;</h2>
			
			<section class="dates"></section>
			
			<br />
			
			<ul class="details" irCalendarEngine="mainCalendarStream" irCalendarEngineBusy="true">
			
				<li irCalendarEngineTemplate="true">
				
					<a rel="contents" irCalendarEngineTemplate="event:link" href="##">
				
						<time irCalendarEngineTemplate="event:time" datetime="2010-05-30">後天 (05/20) 3:00 - 5:00 p.m.</time>
						<span irCalendarEngineTemplate="event:title">公平貿易占卜</span>
					
					</a>
				
				</li>
				
			</ul>
			
			<ul class="actions">
			
				<li><a target="_blank">訂閱行事曆</a></li>
			
			</ul>
		
		</section>
		
<?php

			
		$latestReport = get_posts(array(

			"post_status" => "publish",
			"post_type" => "report",		
			"numberposts" => 1
		
		));
		
	//	$latestReport

		if (count($latestReport) > 0) {
		
			$inPost = $latestReport[0];

?>
		
		<section class="mediaOutlets tealBox">
		
			<header><a style="display:block" href="<?php echo get_permalink($inPost->ID); ?>">
			
				<h2><?php echo $inPost->post_title; ?></h2>
				
				<?php 
				
					$inReportDate = irCustomFieldValue("arCustomField-reportDate", $inPost->ID);
					$inReportMediaOutlet = irCustomFieldValue("arCustomField-mediaOutlet", $inPost->ID);
					
					if (!empty($inReportDate)) {
				
					?><time datetime="<?php echo $inReportDate; ?>"><?php echo str_replace("-", "/", $inReportDate) . " $inReportMediaOutlet"; ?></time><?php
				
					}
				
				?>
			
			</a></header>

			<p><?php echo irPostExcerpt($inPost, 120); ?></p>
		
		</section>
		
<?php

		}

?>
		
	</aside>
	
</section>





<?php
	        
		thematic_belowpost();	        
	        thematic_belowcontent();
		thematic_belowcontainer();	

		get_footer();

?>




