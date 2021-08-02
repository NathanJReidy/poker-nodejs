const readline = require("readline");
const fs = require("fs");

// const readInterface = readline.createInterface({
//   input: fs.createReadStream("./poker-hands.txt"),
//   output: process.stdout,
//   console: false,
// });

// readInterface.on("line", (line) => console.log(line));

let array = fs.readFileSync("./poker-hands.txt").toString().split("\n");
// for (let i in array) {
//   console.log(array[i]);
// }
console.log(array);

const uniqueCards = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];
const suits = ["D", "H", "S", "C"];
const allCards = [];

const comboRanks = [
  "highCard",
  "pair",
  "twoPairs",
  "threeOfAKind",
  "straight",
  "flush",
  "fullHouse",
  "fourOfAKind",
  "straightFlush",
  "royalFlush",
];

const playerRanks = [
  {
    playerOneComboRank: null,
    playerOneHighCardRanks: [],
  },
  {
    playerTwoComboRank: null,
    playerTwoHighCardRanks: [],
  },
];

const playerWins = [{ playerOneHandWins: 0 }, { playerTwoHandWins: 0 }];

// Creates data for all possible card combinations and stores it in allCards
const createAllCards = (uniqueCards, suits) => {
  uniqueCards.map((card) => {
    suits.map((suit) => {
      allCards.push(`${card}${suit}`);
    });
  });
};

const createHands = () => {
  return;
};

// Checks if the player has the same suits for each card (i.e. a flush)
const checkFlush = (playerCards, playerIndex) => {
  for (let i = 0; i < playerCards.length - 1; i++) {
    if (
      playerCards[i][playerCards[i].length - 1] !=
      playerCards[i + 1][playerCards[i + 1].length - 1]
    ) {
      //   console.log("Not a flush! Suits are different");
      return false;
    }
  }

  console.log("Flush! Suits are identical");

  return true;
};

// Updates the player's best rank based on their cards
const updatePlayerComboRank = (playerIndex, playerComboRank) => {
  if (playerIndex == 0) {
    playerRanks[0].playerOneComboRank = playerComboRank;
  } else if (playerIndex == 1) {
    playerRanks[1].playerTwoComboRank = playerComboRank;
  }
};

// Checks if the player has a royal flush
const checkRoyalFlush = (playerCards, playerIndex) => {
  if (checkFlush(playerCards)) {
    let royalCards = ["10", "J", "Q", "K", "A"];
    let uniqueCardsRoyalTest = [];
    playerCards.forEach((card, index) => {
      if (!card.includes("10")) {
        uniqueCardsRoyalTest.push(card[0]);
      } else {
        uniqueCardsRoyalTest.push(card.substr(0, 2));
      }
    });

    return royalCards.every((i) => uniqueCardsRoyalTest.includes(i));
  }

  //   console.log("No royal flush!");
  return false;
};

// Checks if the player has a straight
const checkStraight = (playerCards, playerIndex) => {
  // We want to find each card in our uniqueCards array and see if their indexes are consecutive
  const cardIndexInUniqueCards = [];
  playerCards.forEach((card, index) => {
    // Match the specific card to its index in unique cards
    if (!card.includes("10")) {
      cardIndexInUniqueCards.push(uniqueCards.indexOf(card[0]));
    } else {
      cardIndexInUniqueCards.push(uniqueCards.indexOf(card.substr(0, 2)));
    }
  });
  // Sort items in array in ascending order
  cardIndexInUniqueCards.sort((a, b) => a - b);

  // If the difference between the items in the array is 1, for every item,
  // then we have a straight
  for (let i = 0; i < cardIndexInUniqueCards.length - 1; i++) {
    if (
      parseInt(cardIndexInUniqueCards[i + 1]) -
        parseInt(cardIndexInUniqueCards[i]) !==
      1
    ) {
      //   console.log("Not a straight!");
      return false;
    }
  }

  console.log("We have a straight!");

  return true;
};

// Checks if player has a straight flush
const checkStraightFlush = (playerCards, playerIndex) => {
  if (checkStraight(playerCards) && checkFlush(playerCards)) {
    return true;
  } else {
    return false;
  }
};

// CHECKS THE FREQUENCY OF CARDS, FOR ANY CARDS THAT APPEAR 2 OR MORE TIMES, AND STORES THEM IN AN ARRAY OF OBJECT/S
const checkPair = (playerCards, playerIndex) => {
  // We want to find each card in our uniqueCards array and see if the differences between their indexes is 0
  const cardIndexInUniqueCards = [];
  let pairValues = [];
  playerCards.forEach((card, index) => {
    // Match the specific card to its index in unique cards
    if (!card.includes("10")) {
      cardIndexInUniqueCards.push(uniqueCards.indexOf(card[0]));
    } else {
      cardIndexInUniqueCards.push(uniqueCards.indexOf(card.substr(0, 2)));
    }
  });
  // Sort items in array in ascending order
  cardIndexInUniqueCards.sort((a, b) => a - b);

  // If the difference between the items in the array is 0, for every item,
  // then we have a duplicate
  for (let i = 0; i < cardIndexInUniqueCards.length - 1; i++) {
    let newArr = pairValues.filter(
      (obj) => obj.card == uniqueCards[cardIndexInUniqueCards[i]]
    );

    if (
      parseInt(cardIndexInUniqueCards[i + 1]) -
        parseInt(cardIndexInUniqueCards[i]) ==
        0 &&
      newArr.length == 0
    ) {
      pairValues.push({
        card: uniqueCards[cardIndexInUniqueCards[i]],
        count: 2,
      });
    }

    if (
      parseInt(cardIndexInUniqueCards[i + 1]) -
        parseInt(cardIndexInUniqueCards[i]) ==
        0 &&
      newArr.length !== 0
    ) {
      newArr[0].count += 1;

      pairValues = [...pairValues];
    }
  }
  return pairValues;
};

// Checks if the player has a four of a kind
const checkFourOfAKind = (playerCards, playerIndex) => {
  let fourArray = checkPair(playerCards).filter((card) => card.count == "4");

  if (fourArray.length == 1 && fourArray[0].count == "4") {
    console.log("Four of a kind!");

    // Update the player's high card index ranking:
    const cardIndexInUniqueCards = [];

    // Adds the rankings of the three of a kind to the new array, three times
    for (let i = 0; i < 4; i++) {
      cardIndexInUniqueCards.push(uniqueCards.indexOf(fourArray[0].card));
    }

    // Checks for the left over cards that aren't part of the four of a kind
    // and puts them at the end of the ranking array in highest to lowest order
    let leftOverCards = playerCards.filter((card) => {
      return !card.includes(fourArray[0].card);
    });

    // Used to store left over cards' index rankings before sorting in descending order
    let leftOverArr = [];

    leftOverCards
      .sort((a, b) => b - a)
      .forEach((card) => {
        if (!card.toString().includes("10")) {
          leftOverArr.push(uniqueCards.indexOf(card.toString().substr(0, 1)));
        } else {
          leftOverArr.push(uniqueCards.indexOf(card.toString().substr(0, 2)));
        }
      });

    // Sorts left over cards from highest to lowest order, and puts them after the pair in terms of index ranking
    leftOverArr.sort((a, b) => b - a);

    cardIndexInUniqueCards.push(...leftOverArr);
    console.log(cardIndexInUniqueCards);

    // Stores the index ranks of each card in an array of highest indexed cards to lowest indexed cards, for each player
    if (playerIndex == 0) {
      playerRanks[0].playerOneHighCardRanks = cardIndexInUniqueCards;
    } else if (playerIndex == 1) {
      playerRanks[1].playerTwoHighCardRanks = cardIndexInUniqueCards;
    }

    return true;
  } else {
    // console.log("No four of a kind!");
    return false;
  }
};

// Checks if the player has a three of a kind
const checkThreeOfAKind = (playerCards, playerIndex) => {
  let threeArray = checkPair(playerCards).filter((card) => card.count == "3");
  //   console.log(`threeArray is ${JSON.stringify(threeArray)}`);

  if (threeArray.length == 1 && threeArray[0].count == "3") {
    console.log("Three of a kind!");

    // Update the player's high card index ranking:
    const cardIndexInUniqueCards = [];

    // Adds the rankings of the three of a kind to the new array, three times
    for (let i = 0; i < 3; i++) {
      cardIndexInUniqueCards.push(uniqueCards.indexOf(threeArray[0].card));
    }

    // Checks for the left over cards that aren't part of the two pair
    // and puts them at the end of the ranking array in highest to lowest order
    let leftOverCards = playerCards.filter((card) => {
      return !card.includes(threeArray[0].card);
    });

    // Used to store left over cards' index rankings before sorting in descending order
    let leftOverArr = [];

    leftOverCards
      .sort((a, b) => b - a)
      .forEach((card) => {
        if (!card.toString().includes("10")) {
          leftOverArr.push(uniqueCards.indexOf(card.toString().substr(0, 1)));
        } else {
          leftOverArr.push(uniqueCards.indexOf(card.toString().substr(0, 2)));
        }
      });

    // Sorts left over cards from highest to lowest order, and puts them after the pair in terms of index ranking
    leftOverArr.sort((a, b) => b - a);

    cardIndexInUniqueCards.push(...leftOverArr);
    console.log(cardIndexInUniqueCards);

    // Stores the index ranks of each card in an array of highest indexed cards to lowest indexed cards, for each player
    if (playerIndex == 0) {
      playerRanks[0].playerOneHighCardRanks = cardIndexInUniqueCards;
    } else if (playerIndex == 1) {
      playerRanks[1].playerTwoHighCardRanks = cardIndexInUniqueCards;
    }

    return true;
  } else {
    // console.log("Not a three of a kind!");
    return false;
  }
};

// Checks if the player has a two of a kind (pair)
const checkTwoOfAKind = (playerCards, playerIndex) => {
  let twoArray = checkPair(playerCards).filter((card) => card.count == "2");
  //   console.log(`twoArray is ${JSON.stringify(twoArray)}`);
  if (twoArray.length == 1 && twoArray[0].count == "2") {
    console.log("Pair: Two cards of same value");

    // Update the player's high card index ranking:
    const cardIndexInUniqueCards = [];

    // Adds the rankings of the two of a kind (pair) to the new array, two times
    for (let i = 0; i < 2; i++) {
      cardIndexInUniqueCards.push(uniqueCards.indexOf(twoArray[0].card));
    }

    // Checks for the left over cards that aren't part of the two pair
    // and puts them at the end of the ranking array in highest to lowest order
    let leftOverCards = playerCards.filter((card) => {
      return !card.includes(twoArray[0].card);
    });

    // Used to store left over cards' index rankings before sorting in descending order
    let leftOverArr = [];

    leftOverCards
      .sort((a, b) => b - a)
      .forEach((card) => {
        if (!card.toString().includes("10")) {
          leftOverArr.push(uniqueCards.indexOf(card.toString().substr(0, 1)));
        } else {
          leftOverArr.push(uniqueCards.indexOf(card.toString().substr(0, 2)));
        }
      });

    // Sorts left over cards from highest to lowest order, and puts them after the pair in terms of index ranking
    leftOverArr.sort((a, b) => b - a);

    cardIndexInUniqueCards.push(...leftOverArr);
    console.log(cardIndexInUniqueCards);

    // Stores the index ranks of each card in an array of highest indexed cards to lowest indexed cards, for each player
    if (playerIndex == 0) {
      playerRanks[0].playerOneHighCardRanks = cardIndexInUniqueCards;
    } else if (playerIndex == 1) {
      playerRanks[1].playerTwoHighCardRanks = cardIndexInUniqueCards;
    }

    return true;
  } else {
    // console.log("Not a pair!");
    return false;
  }
};

// Checks it the player has a full house: Three of a kind and a Pair
const checkFullHouse = (playerCards, playerIndex) => {
  if (checkThreeOfAKind(playerCards) && checkTwoOfAKind(playerCards)) {
    console.log("Full house: Three of a kind and a pair!");

    // Update the player's high card index ranking:
    const cardIndexInUniqueCards = [];

    // Stores the three of a kind in an array
    const threeArray = checkPair(playerCards).filter(
      (card) => card.count == "3"
    );

    // Stores the two of a kind in an array
    const twoArray = checkPair(playerCards).filter((card) => card.count == "2");

    // Adds the rankings of the three of a kind to the new array, three times
    for (let i = 0; i < 3; i++) {
      cardIndexInUniqueCards.push(uniqueCards.indexOf(threeArray[0].card));
    }
    // Adds the rankings of the two of a kind (pair) to the new array, two times
    for (let i = 0; i < 2; i++) {
      cardIndexInUniqueCards.push(uniqueCards.indexOf(twoArray[0].card));
    }

    // console.log(`leftOverCards is ${leftOverCards}`);
    // console.log(checkPair(playerCards)[0].card);
    // console.log(checkPair(playerCards)[1].card);

    console.log(cardIndexInUniqueCards);

    // Stores the index ranks of each card in an array of highest indexed cards to lowest indexed cards, for each player
    if (playerIndex == 0) {
      playerRanks[0].playerOneHighCardRanks = cardIndexInUniqueCards;
    } else if (playerIndex == 1) {
      playerRanks[1].playerTwoHighCardRanks = cardIndexInUniqueCards;
    }

    return true;
  } else {
    // console.log("Not a full house!");
    return false;
  }
};

// Checks if the player has a two pair: Two different pairs
const checkTwoPair = (playerCards, playerIndex) => {
  if (
    checkPair(playerCards).length == 2 &&
    checkPair(playerCards)[0].count == "2" &&
    checkPair(playerCards)[1].count == "2"
  ) {
    console.log("Two pairs: Two different pairs!");

    // Update the player's high card index ranking:
    const cardIndexInUniqueCards = [];

    // We want the rankings to appear twice in our ranking array for each pair, so that we have 5 ranks total to compare
    for (let i = 0; i < 2; i++) {
      cardIndexInUniqueCards.push(
        uniqueCards.indexOf(checkPair(playerCards)[0].card)
      );

      cardIndexInUniqueCards.push(
        uniqueCards.indexOf(checkPair(playerCards)[1].card)
      );
    }

    // Checks for the left over card that isn't part of the two pairs,
    // and puts it at the end of the ranking array
    let leftOverCards = playerCards.filter((card) => {
      return (
        !card.includes(checkPair(playerCards)[0].card) &&
        !card.includes(checkPair(playerCards)[1].card)
      );
    });

    // Sort items in array in descending order
    cardIndexInUniqueCards.sort((a, b) => b - a);

    console.log(`leftOverCards is ${leftOverCards.toString().substr(0, 1)}`);

    if (!leftOverCards.toString().includes("10")) {
      cardIndexInUniqueCards.push(
        uniqueCards.indexOf(leftOverCards.toString().substr(0, 1))
      );
    } else {
      cardIndexInUniqueCards.push(
        uniqueCards.indexOf(leftOverCards.toString().substr(0, 2))
      );
    }

    // console.log(`leftOverCards is ${leftOverCards}`);
    // console.log(checkPair(playerCards)[0].card);
    // console.log(checkPair(playerCards)[1].card);

    console.log(cardIndexInUniqueCards);

    // Stores the index ranks of each card in an array of highest indexed cards to lowest indexed cards, for each player
    if (playerIndex == 0) {
      playerRanks[0].playerOneHighCardRanks = cardIndexInUniqueCards;
    } else if (playerIndex == 1) {
      playerRanks[1].playerTwoHighCardRanks = cardIndexInUniqueCards;
    }

    return true;
  } else {
    // console.log("Not a two pair!");
    return false;
  }
};

const checkHighCard = (playerCards, playerIndex) => {
  const cardIndexInUniqueCards = [];

  playerCards.forEach((card, index) => {
    // Match the specific card to its index in unique cards
    if (!card.includes("10")) {
      cardIndexInUniqueCards.push(uniqueCards.indexOf(card[0]));
    } else {
      cardIndexInUniqueCards.push(uniqueCards.indexOf(card.substr(0, 2)));
    }
  });
  // Sort items in array in descending order
  cardIndexInUniqueCards.sort((a, b) => b - a);
  let maxIndex = Math.max(...cardIndexInUniqueCards);
  //   console.log(`maxIndex is ${maxIndex}`);
  let highCard = uniqueCards[maxIndex];
  //   console.log(`High card is ${highCard}`);

  // Stores the index ranks of each card in an array of highest indexed cards to lowest indexed cards, for each player
  if (playerIndex == 0) {
    playerRanks[0].playerOneHighCardRanks = cardIndexInUniqueCards;
  } else if (playerIndex == 1) {
    playerRanks[1].playerTwoHighCardRanks = cardIndexInUniqueCards;
  }
};

// Checks to see which player has the highest card, in the event of a tie break.
// It loops through an index of each player's cards ranked from highest to lowest order
// until it finds who has the highest ranked card
const checkTieBreaker = (playerOneCards, playerTwoCards) => {
  // const allPlayers = [playerOneCards, playerTwoCards];

  // allPlayers.forEach((playerCards, index) => {
  //   let playerIndex = index;
  //   checkHighCard(playerCards, playerIndex);
  // });

  // Determine which player has the highest card

  for (let i = 0; i < 5; i++) {
    if (
      playerRanks[0].playerOneHighCardRanks[i] >
      playerRanks[1].playerTwoHighCardRanks[i]
    ) {
      console.log("Player 1 wins in a tie break with the highest card! ");
      playerWins[0].playerOneHandWins += 1;
      break;
    } else if (
      playerRanks[0].playerOneHighCardRanks[i] <
      playerRanks[1].playerTwoHighCardRanks[i]
    ) {
      console.log("Player 2 wins in a tie break with the highest card! ");
      playerWins[1].playerTwoHandWins += 1;
      break;
    }
  }
};

const checkResults = (playerOneCards, playerTwoCards) => {
  // playerOneCards and playerTwoCards are each an array of 5 randomly selected cards
  // check results of player one's cards
  const allPlayers = [playerOneCards, playerTwoCards];

  // NEED TO PASS IN INDEX
  allPlayers.forEach((playerCards, index) => {
    let playerIndex = index;

    // console.log(allPlayers[index]);

    if (checkRoyalFlush(playerCards, playerIndex)) {
      updatePlayerComboRank(playerIndex, 10);
      // updatePlayerHighCardRanks(playerCards, playerIndex, comboType);
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
    } else if (checkHighCard(playerCards, playerIndex)) {
      updatePlayerComboRank(playerIndex, 1);
    }
  });

  console.log(`the player ranks are: ${JSON.stringify(playerRanks)}`);

  // check winner and add one to handWinCount for the winner
};

const checkWinner = (playerOneCards, playerTwoCards) => {
  if (playerRanks[0].playerOneComboRank > playerRanks[1].playerTwoComboRank) {
    playerWins[0].playerOneHandWins += 1;
    console.log(playerWins);
  } else if (
    playerRanks[1].playerTwoComboRank > playerRanks[0].playerOneComboRank
  ) {
    playerWins[1].playerTwoHandWins += 1;
    console.log(playerWins);
  } else if (
    playerRanks[0].playerOneComboRank == playerRanks[1].playerTwoComboRank
  ) {
    console.log("Tie! Let's start the checkTieBreaker function!");
    checkTieBreaker(playerOneCards, playerTwoCards);
    console.log(playerWins);
  }
};

// console.log(checkPair(["JS", "10D", "10D", "10H", "JC"]));

// console.log(checkRoyalFlush(["KS", "AS", "QS", "10S", "JD"]));
// console.log(checkStraightFlush(["9S", "10S", "7S", "JS", "8S"]));
// console.log(checkFourOfAKind(["10S", "10S", "7S", "10S", "10S"]));
// console.log(checkFullHouse(["QS", "QS", "10S", "10S", "QS"]));
// console.log(checkFlush(["QS", "QS", "10S", "10S", "QS"]));
// console.log(checkStraight(["9S", "8D", "7D", "10H", "JC"]));
// console.log(checkThreeOfAKind(["10S", "10S", "5S", "10S", "9S"]));
// console.log(checkTwoPair(["10S", "AD", "10D", "JH", "JC"]));
// console.log(checkTwoOfAKind(["10S", "10S", "5S", "JS", "9S"]));
// console.log(checkHighCard(["10S", "2D", "10D", "JH", "JC"]));

const playGame = (numberOfGames) => {
  createAllCards(uniqueCards, suits);

  for (let i = 0; i < numberOfGames; i++) {
    let playerOneCardsArray = [];
    let playerTwoCardsArray = [];

    // Randomly allocates 5 cards to each player
    // for (let i = 0; i < 5; i++) {
    //   playerOneCardsArray.push(
    //     allCards[Math.floor(Math.random() * allCards.length)]
    //   );
    //   playerTwoCardsArray.push(
    //     allCards[Math.floor(Math.random() * allCards.length)]
    //   );
    // }

    // Test file:
    const newArr = array[i].split(" ");
    // console.log(newArr);
    playerOneCardsArray = newArr.slice(0, 5);
    playerTwoCardsArray = newArr.slice(5, 10);
    // console.log(playerOneCardsArray);
    // console.log(playerTwoCardsArray);

    checkResults(playerOneCardsArray, playerTwoCardsArray);
    checkWinner(playerOneCardsArray, playerTwoCardsArray);
  }
};

// Play game 100 times
// playGame(100);

// Test file
// playGame(array.length);

createAllCards(uniqueCards, suits);
// console.log(checkTwoPair(["10S", "AD", "AS", "KH", "KC"]));
// console.log(checkFullHouse(["QS", "QS", "2S", "2S", "2S"]));
// console.log(checkTwoOfAKind(["KS", "10S", "5S", "KS", "9S"]));
// console.log(checkThreeOfAKind(["AS", "AS", "2S", "AS", "10S"]));
// console.log(checkFourOfAKind(["AS", "AS", "2S", "AS", "AS"]));
