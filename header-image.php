<?php if ( has_post_thumbnail() ) : ?>
  <div class="uw-hero-image boundless" <?php if ( has_post_thumbnail($post->ID) )  { $image = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), 'single-post-thumbnail' ); ?> style="background-image:url('<?php echo $image[0] ?>');"<?php } ?> ></div>
<?php endif; ?>
