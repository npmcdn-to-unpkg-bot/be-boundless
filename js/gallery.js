// Gallery View
BOUNDLESS.Gallery = Backbone.View.extend({

  el : '.gallery',

  events : {
    'scroll'   : 'close',
    'click li' : 'open'
  },

  settings : {
    itemSelector: 'li',
    transitionDuration : 0
  },

  template :
  '<div class="container">' +
    '<ul id="grid" class="masonry">' +
    '<% _.each( images, function( image ) { %> ' +
     '<li class="segue" ><img width="100%" src="<%= image.src.url %>" />' +
    ' <% }) %>' +
    '</ul>' +
  '</div>',

  templateInstagram :
  '<div class="container">' +
  '<h3> UW on <a href="https://instagram.com/uofwa/?hl=en" title="Instagram">Instagram</a></h3>' +
    '<ul id="grid" class="masonry">' +
    '<% _.each( images, function( image ) { %> ' +
     '<li class="segue" ><a href="<%= image.link %>" target="_blank" title="A UW instagram image"><img src="<%= image.images.standard_resolution.url %>" height="<%= image.images.standard_resolution.height %>" width="<%= image.images.standard_resolution.width %>" /></a>' +
    ' <% }) %>' +
    '</ul>' +
  '</div>',

  templateOverlay : '',

  // This is executed by the router and only when the route is in place
  initialize : function( options )
  {
    _.bindAll( this,
      // 'animateImageIn',
      'render',
      'open',
      'close',
      'removeInactive',
      'setMasonry',
      'setDimensions',
      'getImagePosition'
    )
    // this.images = new BOUNDLESS.Gallery.Images()
    // this.images.on( 'sync', this.render )
    this.instagram = new BOUNDLESS.Gallery.Instagram()
    this.instagram.on( 'sync', this.render )
  },

  render : function()
  {
    console.log(this.$el)
    this.$el.prepend( _.template( this.templateInstagram, {images : this.instagram.toJSON() }) )
    BOUNDLESS.app.set( 'instagram', true )
    this.$el.attr('data-height', 10000)

    // this.$el.imagesLoaded( this.el, this.setMasonry )
    // this.$el.find('li').on('inview', this.animateImageIn )
  },

  setMasonry : function( images )
  {
    this.trigger('slideloaded')
    this.$grid = this.$el.find('#grid');

    this.masonry = new Masonry( this.$grid.get(0), this.settings )

    this.images.each( this.setDimensions )
  },

  // animateImageIn : function(e, isInView, visiblePartX, visiblePartY)
  // {
  //   // TODO: reset the images that move off the bottom on scroll up
  //   if ( isInView )
  //     $(e.currentTarget).removeClass('segue');
  // },

  setDimensions : function( model, index )
  {
    var $element = this.$el.find('li').eq( index )

    $element.attr({ id: model.cid })

    var original = {
      width : $element.width(),
      left : $element.position().left,
      top : $element.position().top
    } ,

    dimensions = _.extend( {
      translateZ: "0px",
      width : $element.width(),
      left : 0,
    }, this.getImagePosition( $element ) )

    model.set( {'dimensions' : dimensions, 'original' : original } )

  },

  open : function(e){

    var $this = $( e.currentTarget )
    , model = this.images.get( $this.attr('id'))
    , open = this.images.findWhere({ open : true } )

    // todo : shouldn't need the open variable here
    if ( open ) {
      this.close()
      return false
    }

    model.set( 'open', true )
    $this
      .addClass('active')
      .velocity( _.extend( model.get('dimensions'),  { top :  this.$el.scrollTop() } ), 500 )
      .siblings().addClass('inactive')


    return false
  },

  close : function()
  {
    var open = this.images.findWhere({ open : true } )

    if ( open )
    {
      open.set( 'open', false )
      return this.$grid.find('#'+open.cid).velocity( 'reverse', this.removeInactive )
    }

  },

  removeInactive : function()
  {
    this.$('li').removeClass('active inactive')
  },

  getImagePosition : function( element )
  {
    var adjust = ( this.$grid.width() / element.width() ) * element.height() > $(window).outerHeight() * 0.8
    , width       =  adjust ? ( element.width() / element.height() ) * $(window).outerHeight() * 0.8 : this.$grid.width()
    , left           = adjust ? ( this.$grid.width() - width  - 30 ) / 2 : 0
    return  { width : width, left : left }
  },

})

// Gallery Image Model
BOUNDLESS.Gallery.Image = Backbone.Model.extend({

  defaults  : {
    open : false,
    original : {},
    dimensions : {}
  }

})

// Gallery Images Collection
BOUNDLESS.Gallery.Images = Backbone.Collection.extend({

  url : '?json=gallery.get_gallery',

  model : BOUNDLESS.Gallery.Image,

  initialize : function()
  {
    this.on( 'error', this.error )
    this.fetch()
  },

  parse : function( data )
  {
    if ( data.status == 'error' )
      return this.error( data.error )

    return data[0].images
  },

  error: function( error )
  {
    console.error('There was an error retrieving the gallery: ' + error);
  }



})

BOUNDLESS.Gallery.Instagram = Backbone.Collection.extend({

    defaults : {
        access_token : "201177297.467ede5.d8b1026bbfa741fc8c8d2b391de72fb4",
        client_id : "d9d55d56f8814f8e83b6492803e9b773",
        user_id : 201177297,
        count: 6
    },

    url: function () {
      return "https://api.instagram.com/v1/users/" + this.defaults.user_id + "/media/recent";
    },

    initialize: function() {
      this.fetch({ data: this.defaults, dataType: 'jsonp', crossDomain: true } );
    },

    parse : function( response ) {
      return response.data
    }

})
