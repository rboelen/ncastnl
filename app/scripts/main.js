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

	var ncastPlayer = videojs("vid");

	ncastPlayer.ready(function(){

		this.on("ended", function(){
			this.currentTime(0);
			this.posterImage.show();
			$("#playPause, .videocontrols h1, #watch").removeClass("hidden");
			$("#playPause").removeClass("playing");
		});

		//click behaviour playbutton
		$(".videocontrols").click(function(){

			console.log(ncastPlayer.ended());

			if(ncastPlayer.paused()) {
				ncastPlayer.play();
				$("#playPause").addClass("playing");
				$(".videocontrols h1, #watch").addClass("hidden");
				ncastPlayer.posterImage.hide();
			}
			else {
				ncastPlayer.pause();
				$("#playPause").removeClass("playing");
			}
		});

		$(".videowrapper").hover(
			function() {
				$("#playPause").removeClass("hidden");
			},
			function() {
				if (ncastPlayer.currentTime() > 0) {
					$("#playPause").addClass("hidden");
				} else {

				};
			}
		);
	});
});