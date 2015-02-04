(function(){var a=this,b=function(a){return a instanceof b?a:!this instanceof b?new b(a):void(this._wrapped=a)};a.BOUNDLESS=b,b.VERSION="0.1",b.initialize=function(){b.router=new b.Router,Backbone.history.start()},jQuery(document).ready(b.initialize),b.UWTiles=Backbone.View.extend({name:"UW Campus",alt:"UW Map",tileSize:new google.maps.Size(256,256),maxZoom:19,minZoom:1,scrollwheel:!1,streetViewControl:!1,initialize:function(){},getTile:function(a,b,c){var d=c.createElement("DIV");if(!this.withinLoadingBounds(a,b))return d.style.width="256px",d.style.height="256px",d.style.background="#FFFFFF",d;var e=c.createElement("IMG");return e.src="http://www.washington.edu/wp-content/themes/maps/tiles/"+b+"_"+a.x+"_"+a.y+".png",e.onerror=function(){d.removeChild(e),d.style.width="256px",d.style.height="256px",d.style.background="#FFFFFF"},d.appendChild(e),d},withinLoadingBounds:function(a,b){return!(a.x>Math.floor(84049/Math.pow(2,19-b))||a.x<Math.floor(83996/Math.pow(2,19-b))||a.y<Math.floor(182980/Math.pow(2,19-b))||a.y>Math.floor(183017/Math.pow(2,19-b)))}}),b.Map=Backbone.View.extend({el:"#map",template:'<div id="map"></div>',settings:{name:"campusmap",allowedBounds:new google.maps.LatLngBounds(new google.maps.LatLng(47.647523,-122.325039),new google.maps.LatLng(47.664983,-122.290106)),allowedZoom:16,map:{zoom:17,center:new google.maps.LatLng(47.653851681095,-122.30780562698),minZoom:1,maxZoom:19,disableDoubleClickZoom:!1,mapTypeControl:!1},marker:{animation:google.maps.Animation.DROP}},initialize:function(){_.bindAll(this,"delegateGoogleMapEvents","handleCenterChanged","handleZoomChanged","getMapType","putMarkersOnMap","render","show","hide"),this.template=_.template(this.template),jQuery("body").html(this.template),this.points=new b.Map.Points,this.points.on("sync",this.render)},render:function(){this.map=new google.maps.Map(document.getElementById("map"),this.settings.map),this.map.mapTypes.set(this.settings.name,b.uwtiles),this.map.setMapTypeId(this.settings.name),this.bounds=new google.maps.LatLngBounds,this.points.each(this.putMarkersOnMap),this.delegateGoogleMapEvents()},delegateGoogleMapEvents:function(){new google.maps.event.addListener(this.map,"center_changed",this.handleCenterChanged),new google.maps.event.addListener(this.map,"zoom_changed",this.handleZoomChanged)},handleCenterChanged:function(){this.map.setMapTypeId(this.getMapType())},handleZoomChanged:function(){this.map.setMapTypeId(this.getMapType())},getMapType:function(){return!this.settings.allowedBounds.contains(this.map.getCenter())||this.map.getZoom()<this.settings.allowedZoom?google.maps.MapTypeId.ROADMAP:this.settings.name},putMarkersOnMap:function(a){var b=new google.maps.Marker(this.settings.marker),c=new google.maps.LatLng(a.get("coordinate").latitude,a.get("coordinate").longitude);this.bounds.extend(c),b.setPosition(c),b.setTitle(a.get("title")),b.setText(a.get("text")),b.setMap(this.map),this.map.fitBounds(this.bounds)},show:function(){},hide:function(){}}),b.Map.Point=Backbone.Model.extend({}),b.Map.Points=Backbone.Collection.extend({url:"?json=map_point.get_map_points",model:b.Map.Point,initialize:function(){this.on("error",this.error),this.fetch()},error:function(){console.log("There was an error retrieving the map points.")}}),b.Router=Backbone.Router.extend({routes:{"!/map":"initializeMap"},initialize:function(){_.bindAll(this,"initializeMap"),b.interaction=new b.Interactions},initializeMap:function(){b.uwtiles=new b.UWTiles,b.map=new b.Map}}),b.Interactions=Backbone.View.extend({initialize:function(){var a=jQuery,b=a(".navigation"),c=a("#message");b.find("li").each(function(){a(this).animate({marginRight:20,opacity:1},{duration:1500,easing:"easeOutElastic"})}),b.animate({left:0},{duration:500,easing:"easeInOutQuad"});var d={template:3},e=new Mprogress(d);b.on("click","li",function(){e.start(),e.set(.2)}),b.find("li").on({mouseenter:function(){c.addClass("blur"),a(this).show("scale",{percent:100},2e3)},mouseleave:function(){c.removeClass("blur")}})}})}).call(this);
//# sourceMappingURL=boundless.js.map