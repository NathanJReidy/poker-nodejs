const {
  array,
  checkTieBreaker,
  checkHands,
  checkWinner,
  playGame,
} = require("./checkGameResults.js");

// Runs a stream of 100 random poker games.
// Change 100 to however many games you want to run.
playGame(100, (runTest = false));
