$(function () {
	// Reference the auto-generated proxy for the hub.
	var rtc = $.connection.rTCDeckHub;

	// Create a function that the hub can call back to display messages.
	rtc.client.notifyCurrentSlide = function (int1, int2) {
		// Add the message to the page.
		$('#getCurrentSlidePart1').text(int1);
		$('#getCurrentSlidePart2').text(int2);
	};

	// Start the connection.
	$.connection.hub.start().done(function () {
		$('#setCurrentSlideButton').click(function () {
			// Call the Send method on the hub.
			rtc.server.setCurrentSlide($('#setCurrentSlidePart1').val(), $('#setCurrentSlidePart2').val());
			// Clear text box and reset focus for next comment.
			$('#setCurrentSlidePart1').val('').focus();
			$('#setCurrentSlidePart2').val('');
		});
		rtc.server.requestCurrentSlide();
	});
});
