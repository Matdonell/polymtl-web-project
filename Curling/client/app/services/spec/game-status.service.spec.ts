import { GameStatusService } from "./../game-status.service";
import { CurrentPlayer } from "./../../models/current-player";

import { expect } from "chai";

let _gameStatus: GameStatusService;

describe("GameStatusService should", () => {
    beforeEach(() => {
        _gameStatus = new GameStatusService();
    });

    it("initialize the game correctly", () => {
        expect(_gameStatus.currentSet).to.be.equal(GameStatusService.DEFAULT_SET);
        expect(_gameStatus.scorePlayer).to.be.equal(GameStatusService.DEFAULT_SCORE);
        expect(_gameStatus.scoreComputer).to.be.equal(GameStatusService.DEFAULT_SCORE);
        expect(_gameStatus.currentStonesPlayer.length).to.be.equal(GameStatusService.INITIAL_NUMBER_OF_STONES);
        expect(_gameStatus.currentStonesComputer.length).to.be.equal(GameStatusService.INITIAL_NUMBER_OF_STONES);
        expect(_gameStatus.isLaunched).to.be.equal(false);
    });

    it("decrement number of stones left for player when used", () => {
        _gameStatus.currentPlayer = CurrentPlayer.BLUE;
        _gameStatus.usedStone();
        expect(_gameStatus.currentStonesPlayer.length).to.be.equal(GameStatusService.INITIAL_NUMBER_OF_STONES - 1);
        expect(_gameStatus.currentStonesComputer.length).to.be.equal(GameStatusService.INITIAL_NUMBER_OF_STONES);
    });

    it("decrement number of stones left for computer when used", () => {
        _gameStatus.currentPlayer = CurrentPlayer.RED;
        _gameStatus.usedStone();
        expect(_gameStatus.currentStonesPlayer.length).to.be.equal(GameStatusService.INITIAL_NUMBER_OF_STONES);
        expect(_gameStatus.currentStonesComputer.length).to.be.equal(GameStatusService.INITIAL_NUMBER_OF_STONES - 1);
        _gameStatus.nextPlayer();
        //_gameStatus.isShooting = true;
        expect(_gameStatus.currentPlayer).to.be.equal(CurrentPlayer.BLUE);
        //expect(_gameStatus.isShooting).to.be.equal(true);
    });

    it("does not decrement number of stones left when used", () => {
        _gameStatus.currentPlayer = CurrentPlayer.INVALID;
        _gameStatus.usedStone();
        expect(_gameStatus.currentStonesPlayer.length).to.be.equal(GameStatusService.INITIAL_NUMBER_OF_STONES);
        expect(_gameStatus.currentStonesComputer.length).to.be.equal(GameStatusService.INITIAL_NUMBER_OF_STONES);
    });

    it("add score for the player when he wins a set", () => {
        _gameStatus.incrementScorePlayer(2);
        expect(_gameStatus.scorePlayer).to.be.equal(2);
    });

    it("add score for the _scoreComputer when he wins a set", () => {
        _gameStatus.incrementScoreComputer(2);
        expect(_gameStatus.scoreComputer).to.be.equal(2);
    });

    it("change the status of the game when it's lunched", () => {
        _gameStatus.launchGame();
        expect(_gameStatus.isLaunched).to.be.equal(true);
    });

    it("reset the number of stones when you finish a set", () => {
        _gameStatus.resetStones();
        expect(_gameStatus.currentStonesComputer.length).to.be.equal(GameStatusService.INITIAL_NUMBER_OF_STONES);
        expect(_gameStatus.currentStonesPlayer.length).to.be.equal(GameStatusService.INITIAL_NUMBER_OF_STONES);
    });

    it("reset all status", () => {
        _gameStatus.resetGameStatus();
        expect(_gameStatus.currentSet).to.be.equal(GameStatusService.DEFAULT_SET);
        expect(_gameStatus.scorePlayer).to.be.equal(GameStatusService.DEFAULT_SCORE);
        expect(_gameStatus.scoreComputer).to.be.equal(GameStatusService.DEFAULT_SCORE);
        expect(_gameStatus.currentStonesPlayer.length).to.be.equal(GameStatusService.INITIAL_NUMBER_OF_STONES);
        expect(_gameStatus.currentStonesComputer.length).to.be.equal(GameStatusService.INITIAL_NUMBER_OF_STONES);
        expect(_gameStatus.isLaunched).to.be.equal(true);
    });

    it("generate a random first player correctly", () => {
        for (let i = 0; i < 10; i++) {
            if (_gameStatus.randomFirstPlayer()) {
                expect(_gameStatus.currentPlayer).to.be.equal(CurrentPlayer.BLUE);
            } else {
                expect(_gameStatus.currentPlayer).to.be.equal(CurrentPlayer.RED);
            }
        }
    });

    it("change a BluePlayer to a RedPlayer correctly", () => {
        _gameStatus.currentPlayer = CurrentPlayer.BLUE;
        _gameStatus.nextPlayer();
        expect(_gameStatus.currentPlayer).to.be.equal(CurrentPlayer.RED);
    });

    it("change a RedPlayer to a BluePlayer correctly", () => {
        _gameStatus.currentPlayer = CurrentPlayer.RED;
        _gameStatus.nextPlayer();
        expect(_gameStatus.currentPlayer).to.be.equal(CurrentPlayer.BLUE);
    });
});
