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
const royalFlush = ["10"];

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

// Checks if the player has the same suits for each card
const checkSuitIdentical = (playerCards) => {
  for (let i = 0; i < playerCards.length - 1; i++) {
    if (
      playerCards[i][playerCards[i].length - 1] !=
      playerCards[i + 1][playerCards[i + 1].length - 1]
    ) {
      return "Suits are different";
    }
  }

  return "Suits are identical";
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
      return "Not a straight!";
    }
  }

  return "We have a straight!";
};

// Check for a pair by adding unique values to a new array called pairValues
const checkPair = (playerCards) => {
  // We want to find each card in our uniqueCards array and see if their indexes are consecutive
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

const checkResults = (playerOneCards, playerTwoCards) => {
  // playerOneCards and playerTwoCards are each an array of 5 randomly selected cards
  // check results of player one's cards
  // check results of player two's cards
  // check winner and add one to handWinCount for the winner
};

createAllCards(uniqueCards, suits);
// console.log(checkRoyalFlush(["2E", "3E", "8E", "9E", "10E"]));
// console.log(checkStraight(["9S", "8D", "QD", "10H", "JC"]));
console.log(checkPair(["8S", "7D", "7D", "10H", "10C"]));
