 $(document).ready(function() {

 	$(".navbar a[href^='#']").on('click', function(e) {
	   // prevent default anchor click behavior
	   e.preventDefault();

	   // store hash
	   var hash = this.hash;

	   // animate
	   $('html, body').animate({
	       scrollTop: $(this.hash).offset().top - 89
	     }, 300, function(){

	       // when done, add hash to url
	       // (default click behaviour)
	       window.location.hash = hash;
	   });
	});

	$(".videowrapper").fitVids();

	var myPlayer = videojs('vid');
		videojs("vid").ready(function(){
			var myPlayer = this;
			var isPlaying = !myPlayer.paused();
			$("#play-button, #watch, .videocontrols").click(function(){
				if(isPlaying==false){
					myPlayer.play();
					//$("#play-button, .videocontrols h1, #watch").hide()
				} else{
					myPlayer.pause();
				};
			});
		});

		//ended()
});