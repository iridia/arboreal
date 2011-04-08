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
				
					"calendarID" => "iridia.tw_4ricig5f23dl5ols3jji2b3nq0@group.calendar.google.com"
				
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










<section class="context">
	
	<article>
	
		<div class="genericWrapping" style="width:100%; padding:0px; margin-top:-1px; margin-bottom:-1px;">
		
			<iframe width="546" height="480" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" style="margin:3px;" src="http://maps.google.com.tw/maps?client=safari&amp;oe=UTF-8&amp;ie=UTF8&amp;q=%E7%94%9F%E6%85%8B%E7%B6%A0+%E5%9C%B0%E5%9D%80&amp;fb=1&amp;gl=tw&amp;hq=%E7%94%9F%E6%85%8B%E7%B6%A0&amp;hnear=Taipei+City&amp;cid=0,0,6673294263950695861&amp;brcurrent=3,0x3442a99bd1adbcc7:0xc5ab69bb7491162a,0,0x3442ac6b61dbbd9d:0xc0c243da98cba64b&amp;ll=25.0397,121.524219&amp;spn=0.006804,0.00912&amp;z=16&amp;iwloc=A&amp;output=embed&amp;iwloc=near"></iframe>
			
			
		</div>
		
		<p style="text-align:center; font-size:11px; color:rgb(64, 64, 64); margin-top: 18px; font-style:bold;"><a href="http://maps.google.com.tw/maps?client=safari&amp;oe=UTF-8&amp;ie=UTF8&amp;q=%E7%94%9F%E6%85%8B%E7%B6%A0+%E5%9C%B0%E5%9D%80&amp;fb=1&amp;gl=tw&amp;hq=%E7%94%9F%E6%85%8B%E7%B6%A0&amp;hnear=Taipei+City&amp;cid=0,0,6673294263950695861&amp;brcurrent=3,0x3442a99bd1adbcc7:0xc5ab69bb7491162a,0,0x3442ac6b61dbbd9d:0xc0c243da98cba64b&amp;ll=25.0397,121.524219&amp;spn=0.006804,0.00912&amp;z=16&amp;iwloc=A&amp;source=embed" style="text-decoration:underline;">檢視較大的地圖</a></p>
	
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
		
		<section class="arGenericSidebarInformationFlatBox" style="margin-top: 54px;">
		
			<h4>生態綠商業有限公司</h4>
		
			<p style="margin-top: 9px;">okogreen@gmail.com<br />台北市杭州南路一段 14 巷 16 號 1 樓<br /></p>
			<p style="margin-top: 9px;">TEL: 02-23222225<br />FAX: 02-23224551</p>
		
		</section>
		
	</aside>
	
</section>





<?php
	        
		thematic_belowpost();	        
	        thematic_belowcontent();
		thematic_belowcontainer();	

		get_footer();

?>




