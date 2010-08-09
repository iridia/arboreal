<?php

//	Template Name: Portal

	function arPresentPresets () {
	
		arLinkAssociatedController("portal");
		
		echo "<script type=\"text/javascript\">";
		
		echo <<< END
		
		window.console.log('defining arboreal presets for current page.', arboreal, arboreal.presets)
		
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
		
			<li>
			
				<h2><time datetime="2010-04-25">04/25</time>公平貿易影展第二波強檔：水資源大作戰 (Blue Gold) 週二開始放映</h2>
				
				<p>水資源大作戰改編自全球暢銷書，原作迄今已翻譯 16 種語言，於全球超過 47 個國家銷售，以節奏緊湊的 87 分鐘揭露水資源背後攸關人命的爭奪戰，震撼全球觀眾的心。全球每天有 5000 個人因為飲用不潔的水源而死亡，有五億的人口缺乏乾淨的水源可用，你能想像有一天，水將成為比黃金昂貴的東西嗎？</p>
			
			</li>
			
			<li class="more"><a href="##" title="More…"><span>More</span></a></li>
			
			<li>
			
				<h2><time datetime="2010-04-22">04/22</time>2010 世界公平貿易日，邀請台灣網友臉書集聲讚</h2>
				
				<p>「世界公平貿易日（World Fair Trade Day）」定於每年的母親節前一天，由國際公平貿易組織（World Fair Trade Organization）串聯 110 萬名第三世界國家的生產者共同發起，連繫起生產者、農民及消費者的一個紀念日，當天全球各地都會有各式各樣的活動，不管是兩三個好友一起喝一杯公平貿易咖啡，還是一起看咖非正義，活動無論大小都是為了正義與公平而發聲。</p>
			
			</li>
			
			<li class="more"><a href="##" title="More…"><span>More</span></a></li>
		
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




