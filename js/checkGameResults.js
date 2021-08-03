const fs = require("fs");
const {
  testFileArray,
  checkRoyalFlush,
  checkStraightFlush,
  checkFourOfAKind,
  checkFullHouse,
  checkFlush,
  checkStraight,
  checkThreeOfAKind,
  checkTwoPair,
  checkTwoOfAKind,
  updateHighCardsRankDescending,
  updatePlayerComboRank,
  uniqueCards,
  createAllCards,
  allCards,
  playerRanks,
  suits,
  playerWins,
} = require("./checkHandResults.js");

// Check what type of hand each player has and update their combination rank (their best type of hand)
// playerOneCards and playerTwoCards are each an array of five randomly selected cards
const checkHands = (playerOneCards, playerTwoCards) => {
  const allPlayers = [playerOneCards, playerTwoCards];

  allPlayers.forEach((playerCards, index) => {
    let playerIndex = index;

    if (checkRoyalFlush(playerCards, playerIndex)) {
      updatePlayerComboRank(playerIndex, 10);
    } else if (checkStraightFlush(playerCards, playerIndex)) {
      updatePlayerComboRank(playerIndex, 9);
    } else if (checkFourOfAKind(playerCards, playerIndex)) {
      updatePlayerComboRank(playerIndex, 8);
    } else if (checkFullHouse(playerCards, playerIndex)) {
      updatePlayerComboRank(playerIndex, 7);
    } else if (checkFlush(playerCards, playerIndex)) {
      updatePlayerComboRank(playerIndex, 6);
    } else if (checkStraight(playerCards, playerIndex)) {
      updatePlayerComboRank(playerIndex, 5);
    } else if (checkThreeOfAKind(playerCards, playerIndex)) {
      updatePlayerComboRank(playerIndex, 4);
    } else if (checkTwoPair(playerCards, playerIndex)) {
      updatePlayerComboRank(playerIndex, 3);
    } else if (checkTwoOfAKind(playerCards, playerIndex)) {
      updatePlayerComboRank(playerIndex, 2);
    } else {
      updateHighCardsRankDescending(playerCards, playerIndex);
      updatePlayerComboRank(playerIndex, 1);
    }
  });
};

// If the players have the exact same type of combination rank (e.g. both have a pair of 5's, both have flushes, etc),
// then check to see who has the highest ranking card
const checkTieBreaker = (playerOneCards, playerTwoCards) => {
  for (let i = 0; i < 5; i++) {
    if (
      playerRanks[0].playerOneHighCardRanks[i] >
      playerRanks[1].playerTwoHighCardRanks[i]
    ) {
      // Player 1 wins in a tie break, with the highest ranking card
      playerWins[0].playerOneHandWins += 1;
      break;
    } else if (
      playerRanks[0].playerOneHighCardRanks[i] <
      playerRanks[1].playerTwoHighCardRanks[i]
    ) {
      // Player 2 wins in a tie break, with the highest ranking card
      playerWins[1].playerTwoHandWins += 1;
      break;
    }
  }
};

// Check who the winner of the game is, first based on combination rank,
// but if there is a combination rank tie, then checkTieBreaker is called,
// which assesses which player has the better hand based on highest to lowest card rank
const checkWinner = (playerOneCards, playerTwoCards) => {
  if (playerRanks[0].playerOneComboRank > playerRanks[1].playerTwoComboRank) {
    // PLayer 1 wins, based on combination rank alone
    playerWins[0].playerOneHandWins += 1;
  } else if (
    playerRanks[1].playerTwoComboRank > playerRanks[0].playerOneComboRank
  ) {
    // Player 2 wins, based on combination rank alone
    playerWins[1].playerTwoHandWins += 1;
  } else if (
    playerRanks[0].playerOneComboRank == playerRanks[1].playerTwoComboRank
  ) {
    // If both players have the same combination rank, check for tie based on high card ranking
    checkTieBreaker(playerOneCards, playerTwoCards);
  }
};

// Run the game and see who wins
const playGame = (numberOfGames, runTest = false) => {
  // Create the card deck (52 cards)
  createAllCards(uniqueCards, suits);

  // Run the game numberOfGames times
  for (let i = 0; i < numberOfGames; i++) {
    let playerOneCardsArray = [];
    let playerTwoCardsArray = [];

    if (runTest === false) {
      // Randomly allocates 5 cards to each player
      for (let i = 0; i < 5; i++) {
        playerOneCardsArray.push(
          allCards[Math.floor(Math.random() * allCards.length)]
        );
        playerTwoCardsArray.push(
          allCards[Math.floor(Math.random() * allCards.length)]
        );
      }

      // Creates a stream file of .txt data containing the numberOfGames specified, with both players hands randomly chosen,
      // in the format which the test required (first five cards belong to player one, second five cards belong to player 2, etc)
      // The file created is overwritten as the start of a new game, to avoid multiple files being created.
      fs.writeFileSync(
        "./writeFileGame.txt",
        `${playerOneCardsArray.join(" ")} ${playerTwoCardsArray.join(" ")}\n`,
        {
          flag: i === 0 ? null : "a",
        }
      );
    } else if (runTest === true) {
      // Test file data
      const newArr = testFileArray[i].split(" ");
      playerOneCardsArray = newArr.slice(0, 5);
      playerTwoCardsArray = newArr.slice(5, 10);
    }

    checkHands(playerOneCardsArray, playerTwoCardsArray);
    checkWinner(playerOneCardsArray, playerTwoCardsArray);

    // Return the winner and the number of games each player won
    if (i === numberOfGames - 1) {
      console.log(
        `Player 1: ${playerWins[0].playerOneHandWins}, Player 2: ${playerWins[1].playerTwoHandWins}`
      );
    }
  }
};

module.exports = {
  testFileArray,
  checkTieBreaker,
  checkHands,
  checkWinner,
  playGame,
};
