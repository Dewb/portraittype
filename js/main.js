$(document).ready(function() {

	var dirtyWord = undefined;
	var previousText = undefined;
	var updatesEnabled = true;

	var socket = io("http://universe.dewb.org", { 'path': '/socket.io' });

	function getCursorPosition() {
		var ta = $('#poetry');
		return ta.prop("selectionDirection") == "backward" ? ta.prop("selectionStart") : ta.prop("selectionEnd");
	}

	function draw(poem, cursorPosition) {
		if (poem == undefined) {
			return;
		}

		var contentChanged = previousText != poem;
      	
		var words = poem.match(/[ \t]+|\S+|\n/g);
		if (words == undefined) { 
			return;
      		}
		
		var numWords = words.length;
		var cursorInRealWord = false;

		$('#displayarea').empty();

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

	      	if (!drawWord || fadeWord) {
	      		wordSpan.fadeTo(0, 0);
			}

	      	$('#displayarea').append(wordSpan);
	      	
	      	if (fadeWord && drawWord) {
	      		updatesEnabled = false;
	      		wordSpan.fadeTo(800, 1.0, function () {
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
		var poem = $('#poetry').val();
	 	var cursorPosition = getCursorPosition();
                socket.emit('typing', { poem: poem, cursorPosition: cursorPosition });
		if (updatesEnabled) {
			draw(poem, cursorPosition);
		}
	});

        socket.on('typing', function (data) {
		if (updatesEnabled) {
			draw(data.poem, data.cursorPosition);
		}
	});

	$('#finish').bind('click', function() {
		$(".poem_word").fadeTo(1800, 1.0);
		socket.emit('finish');
	});

	socket.on('finish', function() {
		$(".poem_word").fadeTo(1800, 1.0);
	});

        $('#hideui').bind('click', function() {
		$(".div-right").css({ width: "100%", margin: "2em", float: "none", position: "static" });
                $(".div-left").hide();
        });

});
