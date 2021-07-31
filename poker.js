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

const checkResults = (playerOneCards, playerTwoCards) => {
  // playerOneCards and playerTwoCards are each an array of 5 randomly selected cards
  // check results of player one's cards
  // check results of player two's cards
  // check winner and add one to handWinCount for the winner
};

createAllCards(uniqueCards, suits);
console.log(checkRoyalFlush(["2E", "3E", "8E", "9E", "10E"]));
