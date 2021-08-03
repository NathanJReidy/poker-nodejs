const fs = require("fs");

// Test file array
let array = fs.readFileSync("./poker-hands.txt").toString().split("\n");
// Stores the deck of cards (52 cards)
const allCards = [];
const uniqueCards = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "J",
  "Q",
  "K",
  "A",
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

const suits = ["D", "H", "S", "C"];
const playerWins = [{ playerOneHandWins: 0 }, { playerTwoHandWins: 0 }];

// Creates data for all possible card combinations (a standard deck of 52 cards) and stores it in allCards
const createAllCards = (uniqueCards, suits) => {
  uniqueCards.map((card) => {
    suits.map((suit) => {
      allCards.push(`${card}${suit}`);
    });
  });
};

// Checks if the player has the same suits for each card (i.e. a flush)
const checkFlush = (playerCards, playerIndex) => {
  for (let i = 0; i < playerCards.length - 1; i++) {
    if (
      playerCards[i][playerCards[i].length - 1] !=
      playerCards[i + 1][playerCards[i + 1].length - 1]
    ) {
      return false;
    }
  }

  // Sorts the card rankings from highest to lowest
  updateHighCardsRankDescending(playerCards, playerIndex);

  // If suits are identical (flush), return true
  return true;
};

// Updates the player's best combination rank based on their cards
// (a combination rank is the rank of your hand type, eg flush, straight, pair, etc)
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
    let royalCards = ["T", "J", "Q", "K", "A"];
    let uniqueCardsRoyalTest = [];
    playerCards.forEach((card, index) => {
      uniqueCardsRoyalTest.push(card[0]);
    });

    // Sorts the card rankings from highest to lowest
    updateHighCardsRankDescending(playerCards, playerIndex);

    return royalCards.every((i) => uniqueCardsRoyalTest.includes(i));
  }

  return false;
};

// Checks if the player has a straight
const checkStraight = (playerCards, playerIndex) => {
  // We want to find each of the player's cards in our uniqueCards array and see if their indexes are consecutive
  const cardsRankIndexArray = [];
  playerCards.forEach((card, index) => {
    // Match the specific card to its index in unique cards
    cardsRankIndexArray.push(uniqueCards.indexOf(card[0]));
  });
  // Sort items in array in ascending order
  cardsRankIndexArray.sort((a, b) => a - b);

  // If the difference between the items in the array is 1, for every item,
  // then we have a straight
  for (let i = 0; i < cardsRankIndexArray.length - 1; i++) {
    if (
      parseInt(cardsRankIndexArray[i + 1]) -
        parseInt(cardsRankIndexArray[i]) !==
      1
    ) {
      return false;
    }
  }

  // Sorts the card rankings from highest to lowest
  updateHighCardsRankDescending(playerCards, playerIndex);

  // If straight, return true
  return true;
};

// Checks if player has a straight flush
const checkStraightFlush = (playerCards, playerIndex) => {
  if (checkStraight(playerCards) && checkFlush(playerCards)) {
    // Sorts the card rankings from highest to lowest
    updateHighCardsRankDescending(playerCards, playerIndex);
    return true;
  } else {
    return false;
  }
};

// Any cards that appear more than once are stored as a singular object with
// properties 'card' (displays card type only, not suit) and 'count' (number of times that card appears in the player's hand),
// and these objects, if they exist, are stored and returned in an array
const checkCardFrequency = (playerCards, playerIndex) => {
  const cardsRankIndexArray = [];
  let cardsArrayForMultipleCounts = [];
  playerCards.forEach((card, index) => {
    // Match the player's specific card to its index in unique cards
    cardsRankIndexArray.push(uniqueCards.indexOf(card.substr(0, 1)));
  });
  // Sort items in array in ascending order
  cardsRankIndexArray.sort((a, b) => a - b);

  // If the difference between the items in the cardsRankIndexArray array is 0, for the item index compared to the next item index,
  // then we have a card that occurs more than once, and we will store this in cardsArrayForMultipleCounts
  for (let i = 0; i < cardsRankIndexArray.length - 1; i++) {
    let newArr = cardsArrayForMultipleCounts.filter(
      (obj) => obj.card == uniqueCards[cardsRankIndexArray[i]]
    );

    if (
      parseInt(cardsRankIndexArray[i + 1]) - parseInt(cardsRankIndexArray[i]) ==
        0 &&
      newArr.length == 0
    ) {
      cardsArrayForMultipleCounts.push({
        card: uniqueCards[cardsRankIndexArray[i]],
        count: 2,
      });
    }

    if (
      parseInt(cardsRankIndexArray[i + 1]) - parseInt(cardsRankIndexArray[i]) ==
        0 &&
      newArr.length !== 0
    ) {
      newArr[0].count += 1;

      cardsArrayForMultipleCounts = [...cardsArrayForMultipleCounts];
    }
  }
  return cardsArrayForMultipleCounts;
};

// Checks if the player has a four of a kind
const checkFourOfAKind = (playerCards, playerIndex) => {
  let fourArray = checkCardFrequency(playerCards).filter(
    (card) => card.count == "4"
  );

  if (fourArray.length == 1 && fourArray[0].count == "4") {
    // Update the player's high card index ranking:
    const cardsRankIndexArray = [];

    // Adds the rankings of the four of a kind to the new array, four times
    for (let i = 0; i < 4; i++) {
      cardsRankIndexArray.push(uniqueCards.indexOf(fourArray[0].card));
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
        leftOverArr.push(uniqueCards.indexOf(card.toString().substr(0, 1)));
      });

    // Sorts left over cards from highest to lowest order, and puts them after the four of a kind in terms of index ranking
    leftOverArr.sort((a, b) => b - a);

    cardsRankIndexArray.push(...leftOverArr);

    updateCardsRank(playerIndex, cardsRankIndexArray);

    // If four of a kind, return true
    return true;
  } else {
    return false;
  }
};

// Checks if the player has a three of a kind
const checkThreeOfAKind = (playerCards, playerIndex) => {
  let threeArray = checkCardFrequency(playerCards).filter(
    (card) => card.count == "3"
  );

  if (threeArray.length == 1 && threeArray[0].count == "3") {
    // Update the player's high card index ranking:
    const cardsRankIndexArray = [];

    // Adds the rankings of the three of a kind to the new array, three times
    for (let i = 0; i < 3; i++) {
      cardsRankIndexArray.push(uniqueCards.indexOf(threeArray[0].card));
    }

    // Checks for the left over cards that aren't part of the three of a kind
    // and puts them at the end of the ranking array in highest to lowest order
    let leftOverCards = playerCards.filter((card) => {
      return !card.includes(threeArray[0].card);
    });

    // Used to store left over cards' index rankings before sorting in descending order
    let leftOverArr = [];

    leftOverCards
      .sort((a, b) => b - a)
      .forEach((card) => {
        leftOverArr.push(uniqueCards.indexOf(card.toString().substr(0, 1)));
      });

    // Sorts left over cards from highest to lowest order, and puts them after the three of a kind in terms of index ranking
    leftOverArr.sort((a, b) => b - a);

    cardsRankIndexArray.push(...leftOverArr);

    updateCardsRank(playerIndex, cardsRankIndexArray);

    // If three of a kind, return true
    return true;
  } else {
    return false;
  }
};

// Checks if the player has a two of a kind (pair)
const checkTwoOfAKind = (playerCards, playerIndex) => {
  let twoArray = checkCardFrequency(playerCards).filter(
    (card) => card.count == "2"
  );
  if (twoArray.length == 1 && twoArray[0].count == "2") {
    // Update the player's high card index ranking:
    const cardsRankIndexArray = [];

    // Adds the rankings of the two of a kind (pair) to the new array, two times
    for (let i = 0; i < 2; i++) {
      cardsRankIndexArray.push(uniqueCards.indexOf(twoArray[0].card));
    }

    // Checks for the left over cards that aren't part of the pair
    // and puts them at the end of the ranking array in highest to lowest order
    let leftOverCards = playerCards.filter((card) => {
      return !card.includes(twoArray[0].card);
    });

    // Used to store left over cards' index rankings before sorting in descending order
    let leftOverArr = [];

    leftOverCards
      .sort((a, b) => b - a)
      .forEach((card) => {
        leftOverArr.push(uniqueCards.indexOf(card.toString().substr(0, 1)));
      });

    // Sorts left over cards from highest to lowest order, and puts them after the pair in terms of index ranking
    leftOverArr.sort((a, b) => b - a);

    cardsRankIndexArray.push(...leftOverArr);

    updateCardsRank(playerIndex, cardsRankIndexArray);

    // If two of a kind (pair), return true
    return true;
  } else {
    return false;
  }
};

// Checks it the player has a full house: Three of a kind and a Pair
const checkFullHouse = (playerCards, playerIndex) => {
  if (checkThreeOfAKind(playerCards) && checkTwoOfAKind(playerCards)) {
    // Update the player's high card index ranking:
    const cardsRankIndexArray = [];

    // Stores the three of a kind in an array
    const threeArray = checkCardFrequency(playerCards).filter(
      (card) => card.count == "3"
    );

    // Stores the two of a kind in an array
    const twoArray = checkCardFrequency(playerCards).filter(
      (card) => card.count == "2"
    );

    // Adds the rankings of the three of a kind to the new array, three times
    for (let i = 0; i < 3; i++) {
      cardsRankIndexArray.push(uniqueCards.indexOf(threeArray[0].card));
    }
    // Adds the rankings of the two of a kind (pair) to the new array, two times
    for (let i = 0; i < 2; i++) {
      cardsRankIndexArray.push(uniqueCards.indexOf(twoArray[0].card));
    }

    updateCardsRank(playerIndex, cardsRankIndexArray);

    // If full house (three of a kind and a pair), return true
    return true;
  } else {
    return false;
  }
};

// Checks if the player has a two pair: Two different pairs
const checkTwoPair = (playerCards, playerIndex) => {
  if (
    checkCardFrequency(playerCards).length == 2 &&
    checkCardFrequency(playerCards)[0].count == "2" &&
    checkCardFrequency(playerCards)[1].count == "2"
  ) {
    // Update the player's high card index ranking:
    const cardsRankIndexArray = [];

    // We want the rankings to appear twice in our ranking array for each pair, so that we have 5 ranks total to compare
    for (let i = 0; i < 2; i++) {
      cardsRankIndexArray.push(
        uniqueCards.indexOf(checkCardFrequency(playerCards)[0].card)
      );

      cardsRankIndexArray.push(
        uniqueCards.indexOf(checkCardFrequency(playerCards)[1].card)
      );
    }

    // Checks for the left over card that isn't part of the two pairs,
    // and puts it at the end of the ranking array
    let leftOverCards = playerCards.filter((card) => {
      return (
        !card.includes(checkCardFrequency(playerCards)[0].card) &&
        !card.includes(checkCardFrequency(playerCards)[1].card)
      );
    });

    // Sort items in array in descending order
    cardsRankIndexArray.sort((a, b) => b - a);

    cardsRankIndexArray.push(
      uniqueCards.indexOf(leftOverCards.toString().substr(0, 1))
    );

    updateCardsRank(playerIndex, cardsRankIndexArray);

    // If two different pairs, return true
    return true;
  } else {
    return false;
  }
};

// Updates the ranking of the high cards by first sorting them in descending order.
const updateHighCardsRankDescending = (playerCards, playerIndex) => {
  const cardsRankIndexArray = [];

  playerCards.forEach((card, index) => {
    // Match the player's specific card to its index in unique cards
    cardsRankIndexArray.push(uniqueCards.indexOf(card[0]));
  });
  // Sort items in array in descending order
  cardsRankIndexArray.sort((a, b) => b - a);

  updateCardsRank(playerIndex, cardsRankIndexArray);
};

// Stores the index ranks of each player's cards in an array of
// highest indexed cards to lowest indexed cards, for each player
const updateCardsRank = (playerIndex, cardsRankIndexArray) => {
  if (playerIndex == 0) {
    playerRanks[0].playerOneHighCardRanks = cardsRankIndexArray;
  } else if (playerIndex == 1) {
    playerRanks[1].playerTwoHighCardRanks = cardsRankIndexArray;
  }
};

module.exports = {
  array,
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
};
