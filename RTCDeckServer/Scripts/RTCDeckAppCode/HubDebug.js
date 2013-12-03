$(function () {
	// Reference the auto-generated proxy for the hub.
	var rtc = $.connection.RTCDeckHub;

	// Create a function that the hub can call back to display messages.
	rtc.client.notifyCurrentSlide = function (int1, int2) {
		// Add the message to the page.
		$('#getCurrentSlidePart1').text(int1);
		$('#getCurrentSlidePart2').text(int2);
	};

	rtc.client.receivePresentationNavigationCommand = function (command) {
		$('#receivePresentationNavigationCommandCommand').text(command);
	}

	// Start the connection.
	$.connection.hub.start().done(function () {
		// set up button methods
		$('#setCurrentSlideButton').click(function () {
			// Call the Send method on the hub.
			rtc.server.setCurrentSlide($('#setCurrentSlidePart1').val(), $('#setCurrentSlidePart2').val());
			// Clear text box and reset focus for next comment.
			$('#setCurrentSlidePart1').val('').focus();
			$('#setCurrentSlidePart2').val('');
		});
		$('#sendNavigationCommand').click(function () {
			rtc.server.sendPresentationNavigationCommand($('#navigationCommand').val());
			$('#navigationCommand').val('');
		});

		// call for initial state: someone else might already be watching the presentation so don't assume 1,0
		rtc.server.requestCurrentSlide();
	});
});
