function debounce(a,b){var c;return function(){function d(){a(),c=null}c&&clearTimeout(c),c=setTimeout(d,b||100)}}$(window).load(function(){function a(a){var b=a;b.find(".front").css("background-image","url("+b.data("img")+")")}function b(a){var b=(f-a.height())/2;$mobile=768>g?50:b,i.one("arrangeComplete",function(){$("html, body").animate({scrollTop:a.offset().top-$mobile},900)})}var c,d=$("#searcher_wrap"),e=$("#searcher"),f=$(window).height(),g=$(window).width(),h=$("#filter"),i=$(".grid").isotope({itemSelector:".grid-item",percentPosition:!0,masonry:{columnWidth:".grid-sizer"},filter:":not(.title-card)"});i.one("arrangeComplete",function(){$("#overlay").fadeOut(300,function(){$(this).remove()})}),i.isotope();var j=$(".quicksearch").keyup(debounce(function(){c=new RegExp(j.val(),"gi"),i.isotope({filter:function(){var a=$(this),b=c?a.text().match(c):!0;return b&&a.is(":not(.title-card)")}})},200));if($(".featured").each(function(b,c){var d=$(c);a(d)}),i.on("click",".grid-item",function(){var c=$(this),d=c.data("name"),e=d&&"#name="+d;c.hasClass("open")||c.hasClass("special")?c.removeClass("open"):($(".grid-item").removeClass("open"),c.addClass("open"),a(c),b(c),window.location.hash=e),i.isotope()}),h.on("click","button",function(){var a=$(this).attr("data-filter");i.isotope({filter:a})}),$("#clear").on("click",function(a){a.preventDefault(),$("select").prop("selectedIndex",0),$(".grid-item").removeClass("open"),h.removeClass("select_active"),window.location.hash="",i.isotope({filter:":not(.title-card)"})}),h.on("change","select",function(){var a=this.value;h.addClass("select_active"),a=a,i.isotope({filter:a})}),h.each(function(a,b){var c=$(b);c.on("click","button",function(){c.find(".is-checked").removeClass("is-checked"),$(this).addClass("is-checked")})}),$("#searcher").on("click",function(a){a.preventDefault(),d.find("input").focus(),d.toggleClass("active_search"),e.hasClass("is-checked")&&(d.find("input").val(""),$(".quicksearch").keyup()),e.toggleClass("is-checked")}),$(document).on("keyup",function(a){27==a.keyCode&&$("#searcher").hasClass("is-checked")&&(d.toggleClass("active_search"),e.toggleClass("is-checked"),d.find("input").val(""))}),$(document).keypress(function(a){13==a.which&&$(a.target).trigger("click")}),location.hash.match(/^#name/)){var k=location.hash.substring(6),l=$('*[data-name="'+k+'"]');l.toggleClass("open"),i.isotope(),a(l),b(l)}$(".tags").on("click","a",function(a){var b=$(this),c=a;$text=b.text(),c.preventDefault(),c.stopPropagation(),h.addClass("select_active"),i.isotope({filter:function(){return $text?$(this).find(".tags").text().match($text):!0}})})}),"onpropertychange"in document&&window.matchMedia&&$("html").addClass("ie10");