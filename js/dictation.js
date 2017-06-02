(function() {
	var playerNode = $("#movie_player");
	var player = $('video')[0];
	var currentCaption = null;
	var currentCaptionStartTime = 0;
	var currentPauseTime = 0;
	var started = false;
	var timeOffset = 0.5;

	//when caption div is removed
	playerNode.on('DOMNodeRemoved', function(e) {
		if(started) {
			var newNode = $(e.target);
			if(newNode.hasClass('caption-window')) {
		    	if (player.currentTime >= currentPauseTime-timeOffset) {
		    		if (player.currentTime > 1) {
			    		pause();
					}
					currentCaption = newNode.text().replace(/[^0-9a-zA-Z]/gi, '').toLowerCase();
				}
			}
		}
	});

	var playerholder = $('#placeholder-player div');
	var dictholder = $('<div class="yt-card yt-card-has-padding player-api player-width player-height" style="background:#fff; height:auto"></div>');
	var startButton = $('<button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default  yt-uix-menu-trigger" type="button" onclick=";return false;" aria-haspopup="true" role="button" aria-pressed="false"><span class="yt-uix-button-content">Start Dictation</span></button>');
	var textBox = $('<div class="comment-simplebox-frame" style="margin-left:0px"><div class="comment-simplebox-prompt"></div><div class="comment-simplebox-text" role="textbox" aria-multiline="true" contenteditable="plaintext-only" data-placeholder="Enter the sentence..."></div></div>');
	var textArea = textBox.find('.comment-simplebox-text');
	var nextButton = $('<button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default  yt-uix-menu-trigger" type="button" onclick=";return false;" aria-haspopup="true" role="button" aria-pressed="false" style="width:50%"><span class="yt-uix-button-content">Next(Enter)</span></button>');
	var replayButton = $('<button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default  yt-uix-menu-trigger" type="button" onclick=";return false;" aria-haspopup="true" role="button" aria-pressed="false" style="width:50%"><span class="yt-uix-button-content">Replay(Ctrl+Enter)</span></button>');
	var scoreLabel = $('<h2 class="comment-section-header-renderer" style="padding:0 0 5px"><b>Score: </b><span>0</span>%</h2>');
	var scoreText = scoreLabel.find('span');

	textArea.keyup(function(e) {
		if (e.keyCode == 13) {
			if (!e.ctrlKey) {
				nextCaption();
			} else {
				replayCaption();
			}
		} else {
			var input = textArea.text().replace(/[^0-9a-zA-Z]/gi, '').toLowerCase();
			scoreText.text(calculateScore(input, currentCaption));
		}
	});

	startButton.click(function() {
		start();
	});

	nextButton.click(function() {
		nextCaption();
	});

	replayButton.click(function() {
		replayCaption();
	});

	scoreLabel.hide();
	textBox.hide();
	nextButton.hide();
	replayButton.hide();
	dictholder.append(scoreLabel);
	dictholder.append(textBox);
	dictholder.append(replayButton);
	dictholder.append(nextButton);
	dictholder.append(startButton);
	dictholder.insertAfter(playerholder);

	function start() {
		started = true;
		player.currentTime = 0;
		scoreLabel.show();
		textBox.show();
		textArea.focus();
		nextButton.show();
		replayButton.show();
		startButton.hide();
	}

	function pause() {
		player.pause();
		currentPauseTime = player.currentTime;
		textArea.focus();
	}

	function nextCaption() {
		scoreText.text('0');
		textArea.text('');
		textArea.focus();
		player.currentTime = currentPauseTime;
		currentCaptionStartTime = currentPauseTime;
		player.play();
	}

	function replayCaption() {
		textArea.focus();
		player.currentTime = currentCaptionStartTime;
		player.play();
	}

	function calculateScore(input, answer) {
		return Math.round((1 - (levensteinDistance(input, answer)/answer.length)) * 100);
	}

	function levensteinDistance(s1, s2) {
	    var a = s1 + "", b = s2 + "", m = [], i, j, min = Math.min;

	    if (!(a && b)) return (b || a).length;

	    for (i = 0; i <= b.length; m[i] = [i++]);
	    for (j = 0; j <= a.length; m[0][j] = j++);

	    for (i = 1; i <= b.length; i++) {
	        for (j = 1; j <= a.length; j++) {
	            m[i][j] = b.charAt(i - 1) == a.charAt(j - 1)
	                ? m[i - 1][j - 1]
	                : m[i][j] = min(
	                    m[i - 1][j - 1] + 1, 
	                    min(m[i][j - 1] + 1, m[i - 1 ][j] + 1))
	        }
	    }

	    return m[b.length][a.length];
	}
	
})();
