
$(function () {
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
		$('#getCurrentSlide').text(JSON.stringify(CurrentSlide, null, 4));
		// Update input boxes too for debug
		$('#setCurrentSlide_indexh').val(currentSlide.indexh);
		$('#setCurrentSlide_indexv').val(currentSlide.indexv);
		$('#setCurrentSlide_indexf').val(currentSlide.indexf);
		$('#setCurrentSlide_speakerNotes').val(currentSlide.speakerNotes.replace(/\<br \/\>/gi, '\n'));
		$('#setCurrentSlide_supplementaryContent').val(currentSlide.supplementaryContent.replace(/\<br \/\>/gi, '\n'));
	};

	// Function that the hub can call back to display a new navigation command
	// PROBABLY DOOMED so Mel can replace with a version that actually does something 
	rtc.client.receivePresentationNavigationCommand = function (command) {
		$('#receivePresentationNavigationCommandCommand').text(command);
	}

	// gets a set of raw poll data for debug purposes
	rtc.client.debug_RawPollAnswers = function (pollAnswers) {
		$('#pollAnswers_rawdata').empty();
		for (answer in pollAnswers) {
			li = '<li><strong>' + pollAnswers[answer].PollIdentifier + '</strong> <em>' + pollAnswers[answer].AnswerID + '</em> '
				+ pollAnswers[answer].SelectedOptions[0].OptionText + '</li>';
			$('#pollAnswers_rawdata').append(li);
		}
	}

	rtc.client.updatePollAnswers = function (poll_with_answers) {
		content = '<ul>';
		for (optionindex in poll_with_answers.Options) {
			option = poll_with_answers.Options[optionindex];
			content += '<li><strong>' + option.OptionText + '</strong>: ' + option.Count + '</li>';
		}
		content += '</ul>';
		$('#PollName').text(poll_with_answers.Question);
		$('#PollAnswersInner').empty();
		$('#PollAnswersInner').append(content);
	}

	// Start the connection.
	$.connection.hub.start().done(function () {

		// Set up button methods
		// send a "set current slide" request
		$('#setCurrentSlideButton').click(function () {
			currentSlide = {
				indexh: $('#setCurrentSlide_indexh').val(),
				indexv: $('#setCurrentSlide_indexv').val(),
				indexf: $('#setCurrentSlide_indexf').val(),
				speakerNotes: $('#setCurrentSlide_speakerNotes').val().replace(/\n/gi, '<br />'),
				supplementaryContent: $('#setCurrentSlide_supplementaryContent').val().replace(/\n/gi, '<br />'),
				polls: [
					{
						Identifier: "PollForSlide1",
						Question: "Is this slide helpful?",
						Style: "ThumbsUpThumbsDown",
						Options: [{ OptionID: 1, OptionText: "Yes" }, { OptionID: 2, OptionText: "No" }]
					},
					{
						Identifier: "AnotherPollForSlide1",
						Question: "Do you like bananas?",
						Style: "ThumbsUpThumbsDown",
						Options: [{ OptionID: 1, OptionText: "Yes" }, { OptionID: 2, OptionText: "No" }]
					}
				]
			}
			if (!$('#setCurrentSlide_simplepoll').is(':checked')) {
				currentSlide.polls = null;
			}
			// Call the Send method on the hub.
			rtc.server.setCurrentSlide(currentSlide);
			// internal notify for debug UI purposes because we don't get this back from the server anymore
			rtc.client.notifyCurrentSlide(currentSlide);
		});
		// send a "navigation command" request
		$('#sendNavigationCommand').click(function () {
			rtc.server.sendPresentationNavigationCommand($('#navigationCommand').val());
			$('#navigationCommand').val('');
		});
		// send a poll answer
		$('#pollAnswer_send').click(function () {
			if ($('#pollAnswer_yesno').is(':checked')) {
				pollAnswer = {
					PollIdentifier: $('#pollAnswer_pollIdentifier').val(),
					SelectedOptions: [{ OptionID: 1, OptionText: "Yes" }]
				}
			}
			else {
				pollAnswer = {
					PollIdentifier: $('#pollAnswer_pollIdentifier').val(),
					SelectedOptions: [{ OptionID: 2, OptionText: "No" }]
				}
			}
			rtc.server.addPollAnswer(pollAnswer).fail(function (e) {
				if (e.source === 'HubException') {
					console.log(e.message);
				}
			});
		})

		// call for initial state: someone else might already be watching/driving the presentation so don't assume 1,0
		rtc.server.requestCurrentSlide();
	});
});
