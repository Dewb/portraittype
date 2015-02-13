$(document).ready(function() {

	var dirtyWord = undefined;
	var previousText = undefined;
	var updatesEnabled = true;

	function getCursorPosition() {
		var ta = $('#poetry');
		return ta.prop("selectionDirection") == "backward" ? ta.prop("selectionStart") : ta.prop("selectionEnd");
	}

	function draw() {
		var poem = $('#poetry').val();
	    var cursorPosition = getCursorPosition();
	    var contentChanged = previousText != poem;
      	
      	$('#displayarea').empty();
      	var words = poem.match(/[ \t]+|\S+|\n/g);
      	if (words == undefined) { 
      		return;
      	}
      	var numWords = words.length;
      	var cursorInRealWord = false;

		var lastDirtyWord = dirtyWord;
      	var currentPosition = 0;
      	for (var i = 0; i < numWords; i++) {
      		var word = words[i];
      		var cursorInWord = currentPosition <= cursorPosition && currentPosition + word.length >= cursorPosition;
      		currentPosition += word.length;

      		if (word == "\n") {
	      		$('#displayarea').append($('<br />'));	
	      		continue;
      		}
      		if (/^\s+$/.test(word)) {
      			continue;
      		}

      		var drawWord = true;
      		var fadeWord = false;
      		if (cursorInWord) {
      			cursorInRealWord = true;
	      		if (contentChanged) {
	      			dirtyWord = i;
					drawWord = false;
	      		} else if (dirtyWord == i) {
	      			drawWord = false;
	      		}
			} else if (lastDirtyWord == i) {
				fadeWord = true;
			}

			word = word.replace(/\*/g, " ");
	      	wordSpan = $('<span />').addClass('poem_word').html(word + " ");
			
	      	if (word.length < 6) {
	      		drawWord = false;
	      		fadeWord = false;
	      	}

	      	if (drawWord && fadeWord) {
	      		wordSpan.hide();
			} else if (!drawWord) {
				wordSpan.css('opacity', 0);
			}

	      	$('#displayarea').append(wordSpan);
	      	
	      	if (fadeWord && drawWord) {
	      		updatesEnabled = false;
	      		wordSpan.fadeIn(800, function () {
	      			updatesEnabled = true;
	      			lastDirtyWord = undefined;
	      			draw();
	      		});
	      	}
		}

		if (!cursorInRealWord) {
			dirtyWord = undefined;
		}
		previousText = poem;
	}

	$('#poetry').bind('keyup click', function() {	
		if (updatesEnabled) {
			draw();
		}
	});

});