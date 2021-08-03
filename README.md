# Instructions to Run

1. Install node.js if you don't already have it: docs.npmjs.com/downloading-and-installing-node-js-and-npm
2. `git clone git@github.com:NathanJReidy/poker-nodejs.git`
3. Navigate into the cloned directory from your command line
4. To verify that the test file runs correctly (which it does), run `node js/runTestFile.js`
5. To generate a random number of games (with a random stream of hands for each), run `node js/runRandomGame.js`.
   The default number of games that runs with this command is 100, but this can easily be changed by changing the numberOfGames argument
   in the playGame function within the runRandomGame.js file. An alternative method would have been to randomly generate a number of games and pass that random number
   into the playGame function, but I made a deliberate choice to allow the user to choose.
