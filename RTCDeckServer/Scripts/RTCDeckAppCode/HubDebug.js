
﻿$(function () {
	// Reference the auto-generated proxy for the hub.
	var rtc = $.connection.RTCDeckHub;

	// current slide: for hub debug purposes only
	// this wants to become a JS Class I think
	var currentSlide;

	// Function that the hub can call back to display messages.
	// PROBABLY DOOMED so Mel will want to write the proper notify method elsewhere
	rtc.client.notifyCurrentSlide = function (CurrentSlide) {
		// Add the message to the page.
		currentSlide = CurrentSlide;
		$('#getCurrentSlide').text(JSON.stringify(CurrentSlide,null,4));
		// Update input boxes too for debug
		$('#setCurrentSlide_indexh').val(currentSlide.indexh);
		$('#setCurrentSlide_indexv').val(currentSlide.indexv);
		$('#setCurrentSlide_indexf').val(currentSlide.indexf);
		$('#setCurrentSlide_speakerNotes').val(currentSlide.speakerNotes);
		$('#setCurrentSlide_supplementaryContent').val(currentSlide.supplementaryContent);
	};

	// Function that the hub can call back to display a new navigation command
	// PROBABLY DOOMED so Mel can replace with a version that actually does something 
	rtc.client.receivePresentationNavigationCommand = function (command) {
		$('#receivePresentationNavigationCommandCommand').text(command);
	}

	// Start the connection.
	$.connection.hub.start().done(function () {

		// Set up button methods
		// send a "set current slide" request
		$('#setCurrentSlideButton').click(function () {
			currentSlide.indexh = $('#setCurrentSlide_indexh').val();
			currentSlide.indexv = $('#setCurrentSlide_indexv').val();
			currentSlide.indexf = $('#setCurrentSlide_indexf').val();
			currentSlide.speakerNotes = $('#setCurrentSlide_speakerNotes').val();
			currentSlide.supplementaryContent = $('#setCurrentSlide_supplementaryContent').val();
			// Call the Send method on the hub.
			rtc.server.setCurrentSlide(currentSlide);
		});
		// send a "navigation command" request
		$('#sendNavigationCommand').click(function () {
			rtc.server.sendPresentationNavigationCommand($('#navigationCommand').val());
			$('#navigationCommand').val('');
		});

		// call for initial state: someone else might already be watching/driving the presentation so don't assume 1,0
		rtc.server.requestCurrentSlide();
	});
});
