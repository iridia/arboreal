<?php

//	Template Name: Dealers

//	add_action('wp_head', 'arPresentPresets');
	
	
	
	
	
	get_header();
	
	thematic_abovecontainer();	
	thematic_abovecontent();
	
	the_post();
	
	thematic_abovepost();
	
	
	
	
	
	function arVendorInfo ($aPost) { ?>
						
		<tr><td style="clear: both;" class="arborealVendorEntry">
		
		<div class="image" style="float:left;">&nbsp;<?php echo get_the_post_thumbnail($aPost->ID, array(100, 50)); ?>&nbsp;</div>
		<h2><?php echo $aPost->post_title; ?></h2>
		
		<p class="annotations">
	
		<?php
		
			$custom = get_post_custom($aPost->ID); 
			
			$vendorAddress = $custom['vendor-address'][0];
			
			if ($vendorAddress) {
			
				?><address><?php echo $vendorAddress; ?></address><?php
			
			}
		
		?>
		
		</p>
		
		</td></tr>
		
	<?php
	
	}
						
?>










<section class="context">
	
	<article>
	
		<table class="arborealSingleEtched arborealVendorList">
		
			<?php
						
					$queryAllDealers = new WP_Query(array(
						
						"post_type" => "vendor"
					
					));
					
					foreach ($queryAllDealers->posts as $vendorPost)
					arVendorInfo($vendorPost);
			
			?>
		
		</table>
	
	</article>

</section>





<?php
	        
		thematic_belowpost();	        
	        thematic_belowcontent();
		thematic_belowcontainer();	

		get_footer();

?>




