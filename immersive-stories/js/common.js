// Audio Player
$(".audio-ctrl").each(function(){

  var $this = $(this);

  // Set ARIA attribute to false
  $this.attr("aria-pressed","false");

  $this.click(function(e){
    e.preventDefault();

    // Pause all currently playing
    var mp3s = document.body.getElementsByTagName('audio');    
    for (var i = 0; i < mp3s.length; i++ ) {
      mp3s[i].pause()
    }


   //$('audio').each(function(e){
   //  console.log($(this))
   //})


    var $audio = $(e.target).closest('.audio'),
        audioEl = $audio.find('audio')[0]
        
    $audio.addClass('active-audio');
    $audio.find('button').attr("aria-pressed","false")
    $this.attr("aria-pressed","true");

    if($this.hasClass("audio-play")){
      $('audio')[0].pause();
      setTimeout(function(){
        audioEl.play();
      },1000);
    }
    if($this.hasClass("audio-pause")){
      audioEl.pause();              
    }
    if($this.hasClass("audio-read")){
      $audio.find(".audio-transcript").removeClass("visually-hidden").focus();
      $audio.toggleClass("trans");

      if($this.hasClass('active-transcript')){
        $audio.find(".audio-transcript").addClass("visually-hidden")
        $this.removeClass('active-transcript');
        $audio.toggleClass("trans");
      } else {                
        $this.addClass('active-transcript'); 
      }              
    } 
  });
});

// Read more link

$('.read-more').on('click', function(e){
  e.preventDefault();
  $('html, body').animate({
      scrollTop: (document.getElementsByTagName('main')[0].getBoundingClientRect().top - 80)
    }, {
      duration: 1000
  });
})


// Video pause
$( "#pause" ).click(function() {     
  var vid =  $( "#intro-vid video" )
  if ( vid.get(0).paused ) {
  	vid.get(0).play() } 
  else { 
  	vid.get(0).pause();
  }
  $('#intro-vid').toggleClass('paused');
});

