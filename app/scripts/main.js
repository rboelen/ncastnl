 $(document).ready(function() {
 	// navbar link fix, nodig ivm hoogte fixed navbar
 	var offset = 90;

	$('.navbar li a').click(function(event) {
	    event.preventDefault();
	    $($(this).attr('href'))[0].scrollIntoView();
	    scrollBy(0, -offset);
	});
});