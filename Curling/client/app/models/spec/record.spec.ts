import { expect } from "chai";

import { Record } from '../record';
import { Difficulty } from '../difficulty';

let _record: Record;
let _username = "Michel";
let _difficulty = Difficulty.HARD;
let _scorePlayer = 9;
let _scoreComputer = 5;
let _date = new Date();

describe("Records should", () => {
    beforeEach(() => {
        _record = new Record(_username, _difficulty,
            _scorePlayer, _scoreComputer, _date);
    });
    it("construct a record object correctly", () => {
        expect(_record.username).to.be.equal(_username);
        expect(_record.difficulty).to.be.equal(_difficulty);
        expect(_record.scorePlayer).to.be.equal(_scorePlayer);
        expect(_record.scoreComputer).to.be.equal(_scoreComputer);
    });
    it("get the name correctly", () => {
        expect(_record.username).to.be.equal(_username);
    });
    it("set the name corectly", () => {
        _record.username = "Louis";
        _username = "Louis";
        expect(_record.username).to.be.equal(_username);
    });
    it("get the difficulty corectly", () => {
        expect(_record.difficulty).to.be.equal(_difficulty);
    });
    it("set the difficulty corectly", () => {
        _record.difficulty = Difficulty.NORMAL;
        _difficulty = Difficulty.NORMAL;
        expect(_record.difficulty).to.be.equal(_difficulty);
    });
    it("get the scorePlayer corectly", () => {
        expect(_record.scorePlayer).to.be.equal(_scorePlayer);
    });
    it("set the score of the player corectly", () => {
        _record.scorePlayer = 12;
        _scorePlayer = 12;
        expect(_record.scorePlayer).to.be.equal(_scorePlayer);
    });
    it("get the score of the computer corectly", () => {
        expect(_record.scoreComputer).to.be.equal(_scoreComputer);
    });
    it("set the score of the computer corectly", () => {
        _record.scoreComputer = 12;
        _scoreComputer = 12;
        expect(_record.scoreComputer).to.be.equal(_scoreComputer);
    });
});
