$(document).ready(function() {

	var previousPoem = "";

	$('#poetry').bind('input propertychange', function() {

		var poem = $('#poetry').val();
		//var differences = diff_main(previousPoem, poem);
      	
      	$('#displayarea').empty();
      	var words = poem.match(/\S+|\n/g);
      	var numWords = words.length;

      	// Don't show last word if there's not a space or newline after it
      	if (poem.slice(-1) != " ") {
      		numWords--;
      	}

      	for (var i = 0; i < numWords; i++) {
      		var word = words[i];
      		if (word == "\n") {
	      		$('#displayarea').append($('<br />'));	
	      		continue;
      		}
	      	wordSpan = $('<span />').addClass('poem_word').html(word + " ");
	      	if (word.length > 5) {
	      		wordSpan.addClass('long_word');
	      	}
	      	$('#displayarea').append(wordSpan);
		}
	});

});