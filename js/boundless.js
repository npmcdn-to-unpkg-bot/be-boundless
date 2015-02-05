(function(){var a=this,b=function(a){return a instanceof b?a:!this instanceof b?new b(a):void(this._wrapped=a)};a.BOUNDLESS=b,b.VERSION="0.1",b.initialize=function(){b.videos=new b.Videos,b.router=new b.Router,Backbone.history.start()},jQuery(document).ready(b.initialize),b.UWTiles=Backbone.View.extend({name:"UW Campus",alt:"UW Map",tileSize:new google.maps.Size(256,256),maxZoom:19,minZoom:1,scrollwheel:!1,streetViewControl:!1,initialize:function(){},getTile:function(a,b,c){var d=c.createElement("DIV");if(!this.withinLoadingBounds(a,b))return d.style.width="256px",d.style.height="256px",d.style.background="#FFFFFF",d;var e=c.createElement("IMG");return e.src="http://www.washington.edu/wp-content/themes/maps/tiles/"+b+"_"+a.x+"_"+a.y+".png",e.onerror=function(){d.removeChild(e),d.style.width="256px",d.style.height="256px",d.style.background="#FFFFFF"},d.appendChild(e),d},withinLoadingBounds:function(a,b){return!(a.x>Math.floor(84049/Math.pow(2,19-b))||a.x<Math.floor(83996/Math.pow(2,19-b))||a.y<Math.floor(182980/Math.pow(2,19-b))||a.y>Math.floor(183017/Math.pow(2,19-b)))}}),b.youtube_api_ready=!1,b.YouTubeAPIReady=new Event("youtube_api_ready"),window.onYouTubeIframeAPIReady=function(){b.youtube_api_ready=!0,this.dispatchEvent(b.YouTubeAPIReady)},b.YouTube=Backbone.Model.extend({defaults:{modest:!0,resolution:"HD1080"},initialize:function(a){_(this).bindAll("parse"),this.$el=a.$el,this.set("youtube_id",a.youtube_id),this.url="https://www.googleapis.com/youtube/v3/videos?part=snippet&id="+this.youtube_id+"&key=AIzaSyApmhFr5oa8bmKPcpN7bm-h0mekjkUVypU",this.set("modest",a.modest),this.set("resolution",a.resolution),this.make_view(),this.fetch({success:this.view.onDataReady})},parse:function(a){var b=a.items[0];return b.snippet.resourceId={videoId:this.youtube_id},b.snippet},make_view:function(){this.view=new b.YouTube.View({model:this})}}),b.YouTube.View=Backbone.View.extend({template:"<div class='boundless-video-player' role='region' aria-label='video' tabindex=-1><div class='tube-wrapper'></div></div>",initialize:function(){_(this).bindAll("onReady","onDataReady","onStateChange","resized","youtube_iframe"),this.player_ready=!1,this.data_ready=!1,this.wrap(),b.youtube_api_ready?this.youtube_iframe():window.addEventListener("youtube_api_ready",this.youtube_iframe)},resized:function(){var a=this.$vidSmall.find(".viewport").width();a!=this.$viewport_width&&(this.$viewport_width=a)},wrap:function(){this.model.$el.wrap(jQuery(this.template)),this.$el=this.model.$el.parents(".boundless-video-player"),this.$el.attr("aria-label","video: "+this.model.get("title")),this.el=this.$el[0]},onReady:function(){this.player_ready=!0,this.check_all_ready()},youtube_iframe:function(){var a={};this.model.get("modest")&&(a={rel:0,controls:0,modestbranding:1}),this.uwplayer=new YT.Player("video"+this.model.get("youtube_id"),{videoId:this.model.get("youtube_id"),playerVars:a,events:{onReady:this.onReady,onStateChange:this.onStateChange}})},onDataReady:function(){this.data_ready=!0,this.check_all_ready()},check_all_ready:function(){this.data_ready&&this.player_ready&&this.play(this.model.get("resourceId").videoId)},onStateChange:function(){},play:function(a,b){b=b||!1,b?(this.uwplayer.loadVideoById(a),this.$el.focus()):this.uwplayer.cueVideoById(a)}}),b.Video=Backbone.Model.extend({}),b.Videos=Backbone.Collection.extend({model:b.Video,is_ready:!1,view_to_render:void 0,initialize:function(){_.bindAll(this,"fetch_success"),this.url="?json=boundless_video.get_videos",this.fetch({success:this.fetch_success})},fetch_success:function(){this.is_ready=!0,void 0!==this.view_to_render&&this.view_to_render.data_prep()}}),b.Video.View=Backbone.View.extend({template:'<div class="fullscreen" style="background-image:url(<%= image %>)"><h2 class="video-title"><%= title %></h2><button class="play"></button><div class="behind boundless-youtube" id="video<%= video %>"></div><div class="blurb"><%= text %></div></div>',el:"#message",initialize:function(a){_.bindAll(this,"render","data_prep"),this.collection=b.videos,this.videoNum=parseInt(a.videoNum),this.slug=a.slug,this.collection.is_ready?this.data_prep(a):this.collection.view_to_render=this},data_prep:function(){this.model=this.collection.models[this.videoNum],this.render(),this.youtube=new b.YouTube({youtube_id:this.model.get("video"),$el:this.$el.find("#video"+this.model.get("video")),modest:!0})},render:function(){var a=this.model.toJSON(),b=_.template(this.template,a);this.$el.html(b)}}),b.Map=Backbone.View.extend({el:"#map",template:'<div id="map"></div>',settings:{name:"campusmap",allowedBounds:new google.maps.LatLngBounds(new google.maps.LatLng(47.647523,-122.325039),new google.maps.LatLng(47.664983,-122.290106)),allowedZoom:16,map:{zoom:17,center:new google.maps.LatLng(47.653851681095,-122.30780562698),minZoom:1,maxZoom:19,disableDoubleClickZoom:!1,mapTypeControl:!1},marker:{animation:google.maps.Animation.DROP}},initialize:function(){_.bindAll(this,"delegateGoogleMapEvents","handleCenterChanged","handleZoomChanged","getMapType","putMarkersOnMap","render","show","hide"),this.template=_.template(this.template),jQuery("body").html(this.template),this.points=new b.Map.Points,this.points.on("sync",this.render)},render:function(){this.map=new google.maps.Map(document.getElementById("map"),this.settings.map),this.map.mapTypes.set(this.settings.name,b.uwtiles),this.map.setMapTypeId(this.settings.name),this.bounds=new google.maps.LatLngBounds,this.points.each(this.putMarkersOnMap),this.delegateGoogleMapEvents()},delegateGoogleMapEvents:function(){new google.maps.event.addListener(this.map,"center_changed",this.handleCenterChanged),new google.maps.event.addListener(this.map,"zoom_changed",this.handleZoomChanged)},handleCenterChanged:function(){this.map.setMapTypeId(this.getMapType())},handleZoomChanged:function(){this.map.setMapTypeId(this.getMapType())},getMapType:function(){return!this.settings.allowedBounds.contains(this.map.getCenter())||this.map.getZoom()<this.settings.allowedZoom?google.maps.MapTypeId.ROADMAP:this.settings.name},putMarkersOnMap:function(a){var b=new google.maps.Marker(this.settings.marker),c=new google.maps.LatLng(a.get("coordinate").latitude,a.get("coordinate").longitude);this.bounds.extend(c),b.setPosition(c),b.setTitle(a.get("title")),b.setText(a.get("text")),b.setMap(this.map),this.map.fitBounds(this.bounds)},show:function(){},hide:function(){}}),b.Map.Point=Backbone.Model.extend({}),b.Map.Points=Backbone.Collection.extend({url:"?json=map_point.get_map_points",model:b.Map.Point,initialize:function(){this.on("error",this.error),this.fetch()},error:function(){console.log("There was an error retrieving the map points.")}}),b.Router=Backbone.Router.extend({routes:{"!/map":"initializeMap","!/video-:video":"initializeVideo"},initialize:function(){_.bindAll(this,"initializeMap")},initializeVideo:function(a){b.videoView=new b.Video.View({videoNum:a})},initializeMap:function(){b.uwtiles=new b.UWTiles,b.map=new b.Map}})}).call(this);
//# sourceMappingURL=boundless.js.map