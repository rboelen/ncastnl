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



	videojs("vid").ready(function(){


		//click behaviour playbutton
		$("#playPause, #watch, .videocontrols").click(function(){
			if($("#vid").hasClass("vjs-paused")) {
				ncastPlayer.play();
				$("#playPause").addClass("playing");
				$(".videocontrols h1, #watch").addClass("hidden");
			}
			else {
				ncastPlayer.pause();
				$("#playPause").removeClass("playing");
			}
		});

		$(".videowrapper").hover(
			function() {
				$(".videocontrols").removeClass("hidden");
			},
			function() {
				if ($("#vid").hasClass("vjs-has-started")) {
					$(".videocontrols").addClass("hidden");
				} else{

				};
			}
		);


		// //define what to show when mouse is over video
		// $(".videocontrols").hover(
		// 	//mouse is in div
		// 	function() {
		// 		//begin
		// 		if(ncastPlayer.currentTime()==0){
		// 			console.log("begin-in", ncastPlayer.currentTime());
		// 			$("#playPause").removeClass("hidden");
		// 			$("#pause-button").addClass("hidden");
				
		// 		//playing	
		// 		} else if (!ncastPlayer.paused()) {
		// 			console.log("playing-in", ncastPlayer.currentTime());
		// 			$("#playPause").addClass("hidden");
		// 			$("#pause-button").removeClass("hidden");
				
		// 		//paused after some time playing
		// 		} else if ( (ncastPlayer.paused()) && (ncastPlayer.currentTime()>0) ){
		// 			console.log("paused-in");
		// 			$("#playPause").removeClass("hidden");
		// 			$("#pause-button").addClass("hidden");
		// 		};
		// 	},
		// 	//mouse is out of div
		// 	function() {
				
		// 		//begin
		// 		if(ncastPlayer.currentTime()==0){
		// 			console.log("begin-out", ncastPlayer.currentTime());

		// 		//paused after some time playing
		// 		} else if ( (ncastPlayer.paused()) && (ncastPlayer.currentTime()>0) ){
		// 			console.log("paused-out", ncastPlayer.currentTime());
		// 			$("#pause-button").addClass("hidden");
		// 			$("#playPause").removeClass("hidden");
				
		// 		//playing
		// 		} else if (!ncastPlayer.paused()) {
		// 			console.log("playing-out", ncastPlayer.currentTime());
		// 			$("#pause-button").addClass("hidden");
		// 			$("#playPause").addClass("hidden");
		// 		} else{
		// 		}
		// 	}
		// );
	});
	//ended()
});