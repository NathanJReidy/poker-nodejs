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
const handWinCount = [{ playerOne: null }, { playerTwo: null }];

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
const checkFlush = (playerCards) => {
  for (let i = 0; i < playerCards.length - 1; i++) {
    if (
      playerCards[i][playerCards[i].length - 1] !=
      playerCards[i + 1][playerCards[i + 1].length - 1]
    ) {
      console.log("Not a flush! Suits are different");
      return false;
    }
  }

  console.log("Flush! Suits are identical");
  return true;
};

// Checks if the player has a royal flush
const checkRoyalFlush = (playerCards) => {
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

  console.log("No royal flush!");
  return false;
};

// Checks if the player has a straight
const checkStraight = (playerCards) => {
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
      console.log("Not a straight!");
      return false;
    }
  }

  console.log("We have a straight!");
  return true;
};

// Checks if player has a straight flush
const checkStraightFlush = (playerCards) => {
  if (checkStraight(playerCards) && checkFlush(playerCards)) {
    return true;
  } else {
    return false;
  }
};

// Check for a pair by adding unique values to a new array called pairValues
const checkPair = (playerCards) => {
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
const checkFourOfAKind = (playerCards) => {
  if (checkPair(playerCards)[0].count == "4") {
    console.log("Four of a kind!");
    return true;
  } else {
    console.log("No four of a kind!");
    return false;
  }
};

// Checks if the player has a three of a kind
const checkThreeOfAKind = (playerCards) => {
  let threeArray = checkPair(playerCards).filter((card) => card.count == "3");
  console.log(`threeArray is ${JSON.stringify(threeArray)}`);

  if (threeArray.length == 1 && threeArray[0].count == "3") {
    console.log("Three of a kind!");
    return true;
  } else {
    console.log("Not a three of a kind!");
    return false;
  }
};

// Checks if the player has a two of a kind (pair)
const checkTwoOfAKind = (playerCards) => {
  let twoArray = checkPair(playerCards).filter((card) => card.count == "2");
  console.log(`twoArray is ${JSON.stringify(twoArray)}`);
  if (twoArray.length == 1 && twoArray[0].count == "2") {
    console.log("Pair: Two cards of same value");
    return true;
  } else {
    console.log("Not a pair!");
    return false;
  }
};

// Checks it the player has a full house: Three of a kind and a Pair
const checkFullHouse = (playerCards) => {
  if (checkThreeOfAKind(playerCards) && checkTwoOfAKind(playerCards)) {
    console.log("Full house: Three of a kind and a pair!");
    return true;
  } else {
    console.log("Not a full house!");
    return false;
  }
};

// Checks if the player has a two pair: Two different pairs
const checkTwoPair = (playerCards) => {
  if (
    checkPair(playerCards).length == 2 &&
    checkPair(playerCards)[0].count == "2" &&
    checkPair(playerCards)[1].count == "2"
  ) {
    console.log("Two pairs: Two different pairs!");
    return true;
  } else {
    console.log("Not a two pair!");
    return false;
  }
};

const checkResults = (playerOneCards, playerTwoCards) => {
  // playerOneCards and playerTwoCards are each an array of 5 randomly selected cards
  // check results of player one's cards
  // check results of player two's cards
  // check winner and add one to handWinCount for the winner
};

createAllCards(uniqueCards, suits);
// console.log(checkRoyalFlush(["2E", "3E", "8E", "9E", "10E"]));

// console.log(checkPair(["JS", "10D", "10D", "10H", "JC"]));
// console.log(checkRoyalFlush(["KS", "AS", "QS", "10S", "JD"]));
// console.log(checkStraightFlush(["9S", "10S", "7S", "JS", "8S"]));
// console.log(checkStraightFlush(["9S", "10S", "7S", "JS", "8S"]));
// console.log(checkFourOfAKind(["10S", "10S", "7S", "10S", "10S"]));
// console.log(checkThreeOfAKind(["10S", "10S", "5S", "10S", "9S"]));
// console.log(checkTwoOfAKind(["10S", "10S", "5S", "JS", "9S"]));
// console.log(checkFullHouse(["QS", "QS", "10S", "10S", "QS"]));
// console.log(checkFlush(["QS", "QS", "10S", "10S", "QS"]));
// console.log(checkStraight(["9S", "8D", "7D", "10H", "JC"]));
// console.log(checkTwoPair(["10S", "AD", "10D", "JH", "JC"]));
