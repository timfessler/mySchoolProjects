var deck = [
  "fa-diamond",
  "fa-diamond",
  "fa-paper-plane-o",
  "fa-paper-plane-o",
  "fa-anchor",
  "fa-anchor",
  "fa-bolt",
  "fa-bolt",
  "fa-cube",
  "fa-cube",
  "fa-leaf",
  "fa-leaf",
  "fa-bicycle",
  "fa-bicycle",
  "fa-bomb",
  "fa-bomb"
];

//Setting Global Variables
var open = [];
var matches = 0;
var numMoves = 0;
var numStars = 3;
var timer = {
  seconds: 0,
  minutes: 0,
  clearTime: -1
};

// Setting variables for performance ranking based on moves.
var twoStars = 16;
var oneStar = 24;

var popup = $("#winner-popup");

//Start time first card is clicked

//Start timer
var startTimer = function() {
  if (timer.seconds === 59) {
    timer.minutes++;
    timer.seconds = 0;
  } else {
    timer.seconds++;
  }

  // Formats timer
  var formattedSec = "0";
  if (timer.seconds < 10) {
    formattedSec += timer.seconds;
  } else {
    formattedSec = String(timer.seconds);
  }

  var time = String(timer.minutes) + ":" + formattedSec;
  $(".timer").text(time);
};

// Resets timer
function resetTimer() {
  clearInterval(timer.clearTime);
  timer.seconds = 0;
  timer.minutes = 0;
  $(".timer").text("0:00");

  timer.clearTime = setInterval(startTimer, 1000);
}

// Shuffles cards for game play
function updateCards() {
  deck = shuffle(deck);
  var index = 0;
  $.each($(".card i"), function() {
    $(this).attr("class", "fa " + deck[index]);
    index++;
  });
}

// Function that displays the winner popup
function showPopup() {
  popup.css("display", "block");
}

// Function that removes stars based on game play
function removeStar() {
  $(".fa-star")
    .last()
    .attr("class", "fa fa-star-o");
  numStars--;
  $(".num-stars").text(String(numStars));
}

// Function that resets stars to three when Play Again button is selected
function resetStars() {
  $(".fa-star-o").attr("class", "fa fa-star");
  numStars = 3;
  $(".num-stars").text(String(numStars));
}

// Updates number of moves and removes star based on moves
function updateNumMoves() {
  $(".moves").text(numMoves);

  if (numMoves === twoStars || numMoves === oneStar) {
    removeStar();
  }
}

// Checks if card is a valid move (if it not currently matched or open)
function isValid(card) {
  return !(card.hasClass("open") || card.hasClass("match"));
}

// validates match or not
function checkMatch() {
  if (open[0].children().attr("class") === open[1].children().attr("class")) {
    return true;
  } else {
    return false;
  }
}

// validates all matches found and returns true or false, which triggers winner message
function gameCompleted() {
  if (matches === 16) {
    return true;
  } else {
    return false;
  }
}

// Sets currently open cards to the match state, checks win condition. When win condition is true, triggers function showPopup
var setMatch = function() {
  open.forEach(function(card) {
    card.addClass("match");
  });
  open = [];
  matches += 2;

  if (gameCompleted()) {
    clearInterval(timer.clearTime);
    showPopup();
  }
};

// toggles open cards back to hidden
var resetOpen = function() {
  open.forEach(function(card) {
    card.toggleClass("open");
    card.toggleClass("show");
  });
  open = [];
};

// Adds open show class to selected card
function openCard(card) {
  if (!card.hasClass("open")) {
    card.addClass("open");
    card.addClass("show");
    open.push(card);
  }
}

// Resets all game variables
var resetGame = function() {
  open = [];
  matches = 0;
  numMoves = 0;
  resetTimer();
  updateNumMoves();
  $(".card").attr("class", "card");
  updateCards();
  resetStars();
};

// Handles primary game logic
var onClick = function() {
  if(timer.seconds == 0 && timer.minutes == 0){
    resetTimer();
  }
  if (isValid($(this))) {
    if (open.length === 0) {
      openCard($(this));
    } else if (open.length === 1) {
      openCard($(this));
      numMoves++;
      updateNumMoves();

      if (checkMatch()) {
        setTimeout(setMatch, 300);
      } else {
        setTimeout(resetOpen, 700);
      }
    }
  }
};

// Resets game state and toggles win modal display off
var playAgain = function() {
  resetGame();
  popup.css("display", "none");
};

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
// Event listeners

$(".card").click(onClick);
$(".restart").click(resetGame);
$(".play-again").click(playAgain);