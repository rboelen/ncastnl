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

	var ncastPlayer = videojs('vid');

	videojs("vid").ready(function(){

		var ncastPlayer = this;

		//define click behaviours
		$("#play-button, #watch").click(function(){
			ncastPlayer.play();
			$("#play-button, .videocontrols h1, #watch").addClass("hidden");
		});

		$("#pause-button").click(function(){
			ncastPlayer.pause();
			$("#pause-button").addClass("hidden");
		});

		//define what to show when mouse is over video
		$(".videocontrols").hover(
			//mouse is in div
			function() {
				//begin
				if(ncastPlayer.currentTime()==0){
					console.log("begin-in", ncastPlayer.currentTime());
					$("#play-button").removeClass("hidden");
					$("#pause-button").addClass("hidden");
				
				//playing	
				} else if (!ncastPlayer.paused()) {
					console.log("playing-in", ncastPlayer.currentTime());
					$("#play-button").addClass("hidden");
					$("#pause-button").removeClass("hidden");
				
				//paused after some time playing
				} else if ( (ncastPlayer.paused()) && (ncastPlayer.currentTime()>0) ){
					console.log("paused-in");
					$("#play-button").removeClass("hidden");
					$("#pause-button").addClass("hidden");
				};
			},
			//mouse is out of div
			function() {
				
				//begin
				if(ncastPlayer.currentTime()==0){
					console.log("begin-out", ncastPlayer.currentTime());

				//paused after some time playing
				} else if ( (ncastPlayer.paused()) && (ncastPlayer.currentTime()>0) ){
					console.log("paused-out", ncastPlayer.currentTime());
					$("#pause-button").addClass("hidden");
					$("#play-button").removeClass("hidden");
				
				//playing
				} else if (!ncastPlayer.paused()) {
					console.log("playing-out", ncastPlayer.currentTime());
					$("#pause-button").addClass("hidden");
					$("#play-button").addClass("hidden");
				} else{
				}
			}
		);
	});
	//ended()
});