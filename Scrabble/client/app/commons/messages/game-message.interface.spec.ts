import { CommandType } from "../../services/commons/command-type";
import { IGameMessage } from "./game-message.interface";
import { expect } from "chai";

let _savedName = "Rami";
let _savedMessage = "!change abc";
let _savedDate = new Date();
let _savedCommandType = CommandType.ExchangeCmd;

let _fakeGameMessage: IGameMessage = {
    _username: _savedName,
    _message: _savedMessage,
    _date: _savedDate,
    _commandType: _savedCommandType
};

describe("GameMessage Interface should", () => {
    it("be used return correct types for all attributes", () => {
        expect(_fakeGameMessage._username).to.be.equal(_savedName);
        expect(_fakeGameMessage._message).to.be.equal(_savedMessage);
        expect(_fakeGameMessage._date).to.be.equal(_savedDate);
        expect(_fakeGameMessage._commandType).to.be.equal(_savedCommandType);
    });
});
