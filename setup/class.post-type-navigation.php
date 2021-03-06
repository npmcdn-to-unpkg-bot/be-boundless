<?php
// Custom post type Navigation for the Boundless front page
// - Allowed to be ordered
// - Hooks into other Backbone router

class Navigation
{

   // Set the constants for the post type labels
  const POST_TYPE  = 'navigation';
  const POST_TYPE_NAME   = 'Navigation';
  const POST_TYPE_PLURAL = 'Navigation';
  const META_BOX_TITLE  = 'Navigation Details';


  function  __construct()
  {
    add_action( 'init', array( $this, 'register_post_type' ) );
    add_action( 'save_post_' . self::POST_TYPE , array( $this, 'save') );
    add_action( 'manage_edit-navigation_columns', array( $this, 'add_new_navigation_column') );
    add_action( 'manage_navigation_posts_custom_column',array( $this, 'show_order_column') );
    add_filter('manage_edit-navigation_sortable_columns',array( $this, 'order_column_register_sortable'));

  }

  function order_column_register_sortable($columns){
    $columns['menu_order'] = 'menu_order';
    return $columns;
  }

  function add_new_navigation_column($navigation_columns) {
    $navigation_columns['menu_order'] = "Order";
    return $navigation_columns;
  }

  function show_order_column($name){
    global $post;

    switch ($name) {
      case 'menu_order':
        $order = $post->menu_order;
        echo $order;
        break;
     default:
        break;
     }
  }

  function register_post_type()
  {

    $labels = array(
      'name'          =>  self::POST_TYPE_PLURAL,
      'singular_name' =>  self::POST_TYPE_NAME,
      'add_new_item'  =>  'Add New '. self::POST_TYPE_NAME
    );

    register_post_type( self::POST_TYPE,
      array(
        'labels' => $labels,
        'public' => false,
        'show_ui' => true,
        'has_archive' => false,
        'menu_position' => 5,
        'show_in_nav_menus' => true,
        'register_meta_box_cb' => array( $this, 'add_meta_box' ),
        'supports' => array( 'title', 'thumbnail', 'excerpt', 'page-attributes', 'revisions' ),
      )
    );
  }

  // Add the metabox that holds the map editor
  function add_meta_box()
  {
     add_meta_box(self::POST_TYPE, self::META_BOX_TITLE, array( $this, 'meta_box_html' ), self::POST_TYPE );
  }

  // The HTML for the map editor.
  // The hidden latitude and longitude input fields are set by the map editor javascript
  function meta_box_html( $post )
  {

    $type  = get_post_meta( $post->ID , '_type', true );
    $route = get_post_meta( $post->ID , '_route', true );

    wp_nonce_field( self::POST_TYPE . '_meta_box', self::POST_TYPE . '_meta_box_nonce' );
    ?>
    <div id="navigation-editor-view">
    <p>
      <label  for="type">This navigation will display as a </label>
      <select name="type">
        <option value="gallery" <?php selected( $type, 'gallery' ) ?> >Gallery</option>
        <option value="map"  <?php selected( $type, 'map' ) ?>>Map</option>
        <option value="video"  <?php selected( $type, 'video' ) ?>>Video</option>
        <option value="page"  <?php selected( $type, 'page' ) ?>>Page</option>
      </select>
      </p>

      <p class="navigation-information">
        <label  for="route">When clicked this navigation goes to </label>
        <input type="text" id="route" name="route" value="<?php echo $route ?>" ></input>

        <span class="selection-video-options" <?php if ( $type != 'video' ) : ?> style="display:none" <?php endif; ?>>
         <br/><br/>
          Click a video to select it:<br/>
          <?php  foreach( get_posts('post_type=boundless_video') as $post ) : ?>
          <a href="#"><?php echo $post->post_name; ?></a><br/>
          <?php endforeach; ?>
        </span>

        <span class="selection-page-options" <?php if ( $type != 'page' ) : ?> style="display:none" <?php endif; ?>>
         <br/><br/>
          Click a page to select it:<br/>
          <?php  foreach( get_posts('post_type=page') as $post ) : ?>
          <a href="#"><?php echo $post->post_name; ?></a><br/>
          <?php endforeach; ?>
        </span>

      </p>

    </div>

    <script>
    (function($) {

       var prefix = '#!/'
       $('#navigation-editor-view').on('change', 'select', function(e ) {

       switch(this.value)
       {

        case 'map' :
        case 'gallery' :
          $('.selection-video-options').hide()
          $('.selection-page-options').hide()
          $('#route').val( prefix + this.value )
          return

        case 'video' :
          $('.selection-video-options').show()
          $('.selection-page-options').hide()
          $('#route').val('')
          return

        case 'page':
          $('.selection-video-options').hide()
          $('.selection-page-options').show()
          $('#route').val('')
          return

       }
      })

      $('.selection-video-options').on('click', 'a', function() {
          $('#route').val( prefix + 'video/' + $(this).html() ).show()
          return false;
      })

      $('.selection-page-options').on('click', 'a', function() {
          $('#route').val( prefix + 'page/' + $(this).html() ).show()
          return false;
      })


    })(jQuery)

    </script>
    <?php
  }

  function save( $post_id )
  {

    if ( isset( $_POST[self::POST_TYPE . '_meta_box_nonce' ]) && !wp_verify_nonce( $_POST[ self::POST_TYPE . '_meta_box_nonce'], self::POST_TYPE . '_meta_box') ) {
        return $post_id;
    }

    if ( defined('DOING_AUTOSAVE') && DOING_AUTOSAVE )
        return $post_id;

    if ( isset( $_POST['post_type'] ) && self::POST_TYPE == $_POST['post_type'] ) {
        if ( !current_user_can( 'edit_page', $post_id ) )
            return $post_id;

    } else {
            if ( !current_user_can( 'edit_post', $post_id ) )
                return $post_id;
    }

    if ( isset( $_POST['type'] ) )
        update_post_meta( $post_id, '_type', $_POST['type'] );

    if ( isset( $_POST['route'] ) )
        update_post_meta( $post_id, '_route', $_POST['route'] );
  }

  static public function get_navigation()
  {
    $navigations = get_posts( "numberposts=-1&orderby=menu_order&order=ASC&post_type=" . self::POST_TYPE );
    foreach ($navigations as $nav)
    {
      $type = get_post_meta( $nav->ID, '_type', true ) ;
      $route = get_post_meta( $nav->ID, '_route', true ) ;
      $route = explode( '/' , $route);
      $route = end( $route);
      echo "<li><a href=\"#$route\"></a></li>";
    }
  }

  static public function get_navigation_slides()
  {
    $navigations = get_posts( "numberposts=-1&orderby=menu_order&order=ASC&post_type=" . self::POST_TYPE );
    foreach ($navigations as $nav)
    {
      $type = get_post_meta( $nav->ID, '_type', true ) ;
      $route = get_post_meta( $nav->ID, '_route', true ) ;
      $textcolor = "";

      $route = explode( '/' , $route);
      $route = end( $route);
      if ( $route === 'map' ) {
        echo "<li id=\"$route\" class=\"slide\"><div class=\"map\"></div></li>";
      } else {
        if ($type == 'page') {
          $pageid = get_page_by_path($nav->post_title)->ID;
          $whitetext = get_post_meta( $pageid, 'textcolor', true ) ;
          if ( !empty($whitetext) ){
            $textcolor = "white-text";
          }
        }
        echo "<li id=\"$route\" class=\"slide $type $route $textcolor\"></li>";
      }
    }
  }

}

new Navigation;
