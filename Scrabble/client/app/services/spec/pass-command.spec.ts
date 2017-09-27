import { expect } from "chai";

import { GameComponent } from "../../components/game-room.component";
import { CommandStatus } from "../commons/command-status";
import { CommandType } from "../commons/command-type";
import { PassCommand } from "../pass-command";

describe("PassCommand", function () {

    let passCommand: PassCommand;
    let gameComponent: GameComponent;


    beforeEach(() => {
        passCommand = new PassCommand(gameComponent);
    });

    it("PassCommand should create an instance of a PassCommand", () => {
        expect(passCommand).to.be.not.undefined;
    });

    it("PassCommand should a null argument error with a null SocketService", () => {
        let commandConstructor = () => new PassCommand(null);
        expect(commandConstructor).throw(Error, "Null argument error: the parameters cannot be null");
    });

    it("PassCommand should create an instance of a PassCommand with default values", () => {
        expect(passCommand.commandRequest._response).to.be.equal("");
        expect(passCommand.commandRequest._commandStatus).to.be.equal(CommandStatus.Ok);
        expect(passCommand.commandRequest._commandType).to.be.equal(CommandType.PassCmd);
    });

    // it("PassCommand should execute the command without error", () => {
    //     expect(passCommand.execute()).to.not.throw;
    // });
});
