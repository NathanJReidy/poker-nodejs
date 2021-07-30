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

// Creates data for all possible card combinations
const createAllCards = (uniqueCards, suits) => {
  uniqueCards.map((card) => {
    suits.map((suit) => {
      allCards.push(`${card}${suit}`);
    });
  });
};

createAllCards(uniqueCards, suits);
console.log(allCards);

const createHands = () => {
  return;
};

const checkResults = (playerOneCards, playerTwoCards) => {
  // playerOneCards and playerTwoCards are arrays of 5 randomly selected cards each
  // check results of player one's cards
  // check results of player two's cards
  // check winner and add one to handWinCount for the winner
};
