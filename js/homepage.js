UW=UW||{},UW.baseUrl=Backbone.history.location.protocol+"//www.washington.edu/home/",UW.sources={quicklinks:UW.baseUrl+"wp-admin/admin-ajax.php?action=quicklinks",search:UW.baseUrl+"wp-admin/admin-ajax.php"},UW.HomepageSlider=Backbone.View.extend({el:".uw-homepage-slider-container",slides:".uw-homepage-slider",headline:".next-headline",template:'<p class="next-headline slide-<%= slide %>" style="display:block;"><%= title %></p>',events:{"click .next-headline":"nextSlide"},initialize:function(){_.bindAll(this,"render","nextSlide","changeNextArticle"),this.count=this.$el.children(this.slides).length,this.showNextHeadline(),this.changeNextArticle()},nextSlide:function(){this.$el.children(this.slides).last().fadeOut(this.rotateSlides)},rotateSlides:function(){var a=$(this);a.insertBefore(a.siblings(this.slides).first()).show(),UW.homepageslider.changeNextArticle()},showNextHeadline:function(){this.$el.find(this.headline).show()},changeNextArticle:function(){this.$el.find(this.headline).replaceWith(this.render)},render:function(){var a=this.$el.children(this.slides).eq(this.count-2);return _.template(this.template,{title:a.find("h1").text(),slide:a.data().id})}}),UW.HomepageSlider.initialize=function(){$(".uw-homepage-slider").length>1&&(UW.homepageslider=new UW.HomepageSlider)},$(document).ready(UW.HomepageSlider.initialize),UW=UW||{},UW.Facts=Backbone.View.extend({ACTIVATE:"factive",el:".people",charts:".uw-charts",window:$(window),delay:40,initialize:function(){_.bindAll(this,"inview","render"),this.window.scroll(this.inview),this.charts=$(this.charts),this.chartposition=this.charts.position().top+this.charts.height()/4,this.height=this.window.height()},render:_.once(function(){UW.$body.addClass(this.ACTIVATE)}),inview:_.throttle(function(){this.window.scrollTop()+this.height>this.chartposition&&this.render()},200)}),UW.Facts.init=function(){UW.facts=new UW.Facts},$(document).ready(UW.Facts.init);