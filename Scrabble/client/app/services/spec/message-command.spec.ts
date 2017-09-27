import { expect } from "chai";

import { ChatroomComponent } from "../../components/chatroom.component";

import { CommandStatus } from "../commons/command-status";
import { CommandType } from "../commons/command-type";
import { MessageCommand } from "../message-command";

describe("MessageCommand", function () {

    let messageCommand: MessageCommand;
    let chatroomComponent: ChatroomComponent;
    let fakeMessage = "this is a fake message for test purpose";

    beforeEach(() => {
        messageCommand = new MessageCommand(chatroomComponent, fakeMessage);
    });

    it("MessageCommand should create an instance of a MessageCommand", () => {
        messageCommand = new MessageCommand(chatroomComponent, "a fake message for test purpose");
        expect(messageCommand).to.be.not.undefined;
    });

    it("MessageCommand should throw a null argument error with a null SocketService", () => {
        let commandConstructor = () => new MessageCommand(null, "a fake message for test purpose");
        expect(commandConstructor).throw(Error, "Null argument error: the parameters cannot be null");
    });

    it("MessageCommand should throw a null argument error with a null parameters", () => {
        let commandConstructor = () => new MessageCommand(chatroomComponent, null);
        expect(commandConstructor).throw(Error, "Null argument error: the parameters cannot be null");
    });

    it("MessageCommand should a null argument error with an empty parameters", () => {
        let commandConstructor = () => new MessageCommand(chatroomComponent, "");
        expect(commandConstructor).throw(Error, "Null argument error: the parameters cannot be empty");
    });

    it("MessageCommand should create an instance of a MessageCommand with default values", () => {
        expect(messageCommand).to.be.not.undefined;
        expect(messageCommand.parameters).to.be.equal(fakeMessage);
        expect(messageCommand.commandRequest._commandStatus).to.be.equal(CommandStatus.Ok);
        expect(messageCommand.commandRequest._commandType).to.be.equal(CommandType.MessageCmd);
    });

    // it("MessageCommand should not throw an error when executing the command", () => {
    //     expect(messageCommand.execute()).to.not.throw;
    // });

});
