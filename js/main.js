$(document).ready(function() {

	var dirtyWord = undefined;

	function getCursorPosition() {
		var ta = $('#poetry');
		return ta.prop("selectionDirection") == "backward" ? ta.prop("selectionStart") : ta.prop("selectionEnd");
	}

	function draw(contentChanged) {
		var poem = $('#poetry').val();
	    var cursorPosition = getCursorPosition();
      	
      	$('#displayarea').empty();
      	var words = poem.match(/[ \t]+|\S+|\n/g);
      	if (words == undefined) { 
      		return;
      	}
      	var numWords = words.length;
      	dirty = false;
      	var cursorInRealWord = false;

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
      		if (cursorInWord) {
      			cursorInRealWord = true;
	      		if (contentChanged) {
	      			dirtyWord = i;
					drawWord = false;
	      		} else if (dirtyWord == i) {
	      			drawWord = false;
	      		}
			}

			word = word.replace(/\*/g, " ");
	      	wordSpan = $('<span />').addClass('poem_word').html(word + " ");
			
	      	if (drawWord && word.length > 5) {
	      		wordSpan.addClass('long_word');
	      	}
	      	$('#displayarea').append(wordSpan);
		}

		if (!cursorInRealWord) {
			dirtyWord = undefined;
		}
	}


	$('#poetry').bind('input propertychange', function() {
		draw(true);
	});

	$('#poetry').bind('keyup click', function() {		
		draw(false);
	})

});