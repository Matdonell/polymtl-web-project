import { expect } from "chai";

import { Player } from "../../models/player";
import { Letter } from "../../models/letter";
import { Board } from "../../models/board/board";

import { BoardManager } from "../board/board-manager";

let uuid = require("node-uuid");

describe("BoardManager", () => {
    let boardManager: BoardManager;
    let board: Board;
    let fakePlayer: Player;

    let fakeSocketId = uuid.v1();
    fakePlayer = new Player("fakename", 1, fakeSocketId);

    beforeEach(() => {
        boardManager = new BoardManager();
        board = new Board();
        fakePlayer.easel.addLetters([new Letter("B", 1, 1), new Letter("A", 1, 1), new Letter("C", 3, 1)]);
    });

    it("should create a new MessageHandler", () => {
        boardManager = new BoardManager();
        expect(boardManager).not.to.be.undefined;
    });

    // it("should place a first word vertically in the center of the board", () => {
    //     let isPlaced = boardManager.placeWordInBoard(placeWordVerticallyResponse, board, fakePlayer);
    //     expect(isPlaced).to.be.true;
    // });

    // it("should place a first word in the center of the board", () => {
    //     let isPlaced = boardManager.placeWordInBoard(placeWordVerticallyResponse, board, fakePlayer);
    //     expect(isPlaced).to.be.true;
    // });

});
