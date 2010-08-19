<?php

//	Template Name: Portal

	function arPresentPresets () {
	
		arLinkAssociatedController("portal");
		
		echo "<script type=\"text/javascript\">";
		
		echo <<< END
		
		var arboreal = arboreal || {};
		arboreal.presets = arboreal.presets || {};
		arboreal.presets.pages = arboreal.presets.pages || {};
		
END;
		
		echo "arboreal.presets.pages.currentPage = " . json_encode(array(
		
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
				
					"calendarID" => "0lgqdbsiischmeimnpu89bqudo"
				
				)
			
			)
		
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










<ul irSlidesController="mainGallery" class="gallery loading">

	<li class="spotties" irSlidesControllerConfiguration="ignore"><ul irPageControl="mainGallery">
		
	</ul></li>

</ul>





<section class="context">
	
	<article>
	
		<section irTwitterEngine="mainTwitterStream" class="twitterStream"><div irTwitterEngineTemplate="true">
		
			<span irTwitterEngineTemplate="tweet:text">好片推薦：到生態綠部落格參加「親愛的醫生」電影特映會贈票活動第一波：<a href="http://www.okogreen.com.tw/blog/?p=355" target="_blank">http://www.okogreen.com.tw/blog/?p=355</a></span>
			
			<a title="more" irTwitterEngineTemplate="tweet:link" href="##"><span>Show Twit</span></a>
			
		</div></section>
		
		
		
		
		
		<ol class="blogPosts">

		<?php

			global $post;
			$recentPosts = get_posts('numberposts=2');

			foreach($recentPosts as $post) {
	
				setup_postdata($post);

		?>
			<li>
			
				<a href="<?php the_permalink(); ?>"><h2><time datetime="<?php echo get_the_date("Y-m-d") ?>"><?php echo get_the_date("m/d"); ?></time><?php the_title(); ?></h2></a>
				
				<p><?php 
				
					echo arGenerateExcerpt(
					
						apply_filters('the_content', get_the_content()), 150, "p"
						
					);
				
				?></p>
			
			</li>
			
			<li class="more"><a href="<?php the_permalink(); ?>" title="More…"><span>More</span></a></li>
			
			<?php } ?>
		
		</ol>
	
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
			
				<li><a target="_blank">Subscribe</a></li>
			
			</ul>
		
		</section>
		
		<section class="mediaOutlets tealBox">
		
			<header>
			
				<h2>情侶檔　推動公平貿易認證</h2>
				<time datetime="">2008.05.10 自由時報 A3 焦點新聞</time>
			
			</header>
			
			<p>記者謝文華／台北報導</p>
			<p>如果你選擇購買貼有「小黑人標籤」的咖啡豆，就可以讓拉丁美洲、南美洲等第三世界國家的小農，一天的薪資從一塊美金漲到兩塊美金！今天是「世界公平貿易日」，國際公平貿易協會特別選在每年五月的第二個星期六推廣公平貿易理念，支持全球小農⋯⋯</p>
		
		</section>
		
	</aside>
	
</section>





<?php
	        
		thematic_belowpost();	        
	        thematic_belowcontent();
		thematic_belowcontainer();	

		get_footer();

?>




