 $(document).ready(function() {

 	// User Agent Variables
	var isPhone = false;
	var isIpad = false;
	
	// Detect User Agent
	if(navigator.userAgent.match(/Android/i) ||
		navigator.userAgent.match(/webOS/i) ||
		navigator.userAgent.match(/iPhone/i) ||
		navigator.userAgent.match(/iPod/i)) {
		$('body').addClass('phone');
		isPhone = true;
	}
	if(navigator.userAgent.match(/iPad/i)){
		$('body').addClass('ipad');
		isIpad = true;
	}	

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
	   
	   // google analytics
		ga('send', 'pageview', location.pathname + hash);
				
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

		//update HTML5 video current play time
		this.on('timeupdate', function() {
		   var currentPos = ncastPlayer.currentTime(); //Get currenttime
		   var maxduration = ncastPlayer.duration(); //Get video duration
		   var percentage = 100 * currentPos / maxduration; //in %
		   $('.timebar').css('width', percentage+'%');
		});

		//click behaviour playbutton
		$(".videocontrols").click(function(){

			console.log(ncastPlayer.ended());

			if(ncastPlayer.paused()) {
				ncastPlayer.play();
				$("#playPause").addClass("playing");
				if(isIpad){
					$("#playPause").addClass("hidden");
				}
				
				$(".videocontrols h1, #watch").addClass("hidden");
				ncastPlayer.posterImage.hide();
			}
			else {
				ncastPlayer.pause();
				$("#playPause").removeClass("playing");
				if(isIpad){
					$("#playPause").removeClass("hidden");
				}
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