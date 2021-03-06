<!DOCTYPE html>
<html class="no-js" lang="en">
<head>
  <meta charset="utf-8"> 
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="keywords" content="ScrollMagic, example, scrolling, attaching, scrollbar, horizontal, landscape" />
  <!-- <meta name="viewport" content="width=device-width"> -->
  <!-- <meta name="viewport" content="initial-scale=1 user-scalable=no width=device-width"> -->
  <meta name="viewport" content="initial-scale=1 width=device-width maximum-scale=1 user-scalable=no" />
  <title> <?php wp_title(' | ',TRUE,'right'); bloginfo('name'); ?> </title>

      
      
  <link rel='stylesheet' id='uw-master-css'  href='<?php echo bloginfo("template_directory") . '/style.css' ?>' type='text/css' media='all' />
  <link rel='stylesheet' id='google-font-open-css'  href='http://fonts.googleapis.com/css?family=Open+Sans%3A400italic%2C700italic%2C400%2C700&#038;' type='text/css' media='all' />
  <link rel='stylesheet' id='uw-style-css'  href='<?php echo get_stylesheet_directory_uri() . '/style.css' ?>' type='text/css' media='all' />
  <script type='text/javascript' src='http://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js'></script>
  <!-- <script type='text/javascript' src='https://code.jquery.com/ui/1.12.0-rc.2/jquery-ui.min.js'></script> -->

  
  

<?php ; ?>

</head>
<body id="immersive" <?php body_class(); ?>>

<header role="banner">
  <div id="campaign-header" class="active" role="navigation">

    <a class="home" href="http://www.uw.edu">Home</a>

    <div tabindex="-1" class="thin" aria-hidden="true">
      <a href="http://www.uw.edu">Support the campaign</a>

    </div>
    <div tabindex="-1" class="thick">
      <ul>
        <li><a href="campaign">Experience</a></li>
        <li><a href="leadership">About the Campaign</a></li>
        <li><a href="campaign">Find Your Passion</a></li>
        <li><a href="http://www.uw.edu/giving">Give now</a></li>
      </ul>        
    </div>
    <button id="campaign-expand">Toggle menu
      <div aria-hidden="true" id="ham">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </button>
  </div>

  <h1><?php the_title(); ?></h1>

</header>