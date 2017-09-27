import { ICommandRequest } from "../commons/command-request.interface";
import { CommandStatus } from "../commons/command-status";
import { CommandType } from "../commons/command-type";
import { expect } from "chai";

let fakeMessage = "fake message";
let _fakeRequest: ICommandRequest<string> = {
    _commandType: CommandType.MessageCmd,
    _commandStatus: CommandStatus.Ok,
    _response: fakeMessage
};

describe("GameMessage Interface should", () => {
    it("be used return correct types for all attributes", () => {
        expect(_fakeRequest._commandType).to.be.equal(CommandType.MessageCmd);
        expect(_fakeRequest._commandStatus).to.be.equal(CommandType.MessageCmd);
        expect(_fakeRequest._response).to.be.equal(fakeMessage);

    });
});
