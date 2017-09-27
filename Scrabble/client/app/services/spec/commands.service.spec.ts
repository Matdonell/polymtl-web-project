import { expect } from "chai";

import { EaselComponent } from "../../components/easel.component";
import { ChatroomComponent } from "../../components/chatroom.component";
import { GameComponent } from "../../components/game-room.component";
import { BoardComponent } from "../../components/board.component";

import { CommandType } from "../commons/command-type";

import { CommandsService } from "../../services/commands.service";

describe("CommandService", function () {

    let commandsService: CommandsService;

    let easelComponent: EaselComponent;
    let chatroomComponent: ChatroomComponent;
    let gameComponent: GameComponent;
    let boardComponent: BoardComponent;

    beforeEach((done) => {
        commandsService = new CommandsService();
        done();
    });

    it("extractCommandParameters, should not be null", () => {
        expect(commandsService).to.not.be.undefined;
    });

    it("extractCommandParameters, throw an exception when an input command is empty", () => {
        let verification = () => commandsService.extractCommandParameters(null);
        expect(verification).to.throw(Error);
    });

    it("extractCommandParameters, reconize the input to a new message", () => {
        let verification = commandsService.extractCommandParameters("fake message");
        expect(verification.commandType).to.be.equal(CommandType.MessageCmd);
    });

    it("extractCommandParameters, reconize the input to add a new word", () => {
        let verification = commandsService.extractCommandParameters("!placer sfdg");
        expect(verification.commandType).to.be.equal(CommandType.PlaceCmd);
    });

    it("extractCommandParameters, reconize the input to exchange letters", () => {
        let verification = commandsService.extractCommandParameters("!changer fake");
        expect(verification.commandType).to.be.equal(CommandType.ExchangeCmd);
    });

    it("extractCommandParameters, reconize the input to let a player pass it's turn", () => {
        let verification = commandsService.extractCommandParameters("!passer");
        expect(verification.commandType).to.be.equal(CommandType.PassCmd);
    });

    it("extractCommandParameters, reconize the input to open help menu", () => {
        let verification = commandsService.extractCommandParameters("!aide");
        expect(verification.commandType).to.be.equal(CommandType.GuideCmd);
    });

    it("extractCommandParameters, reconize an invalid command", () => {
        let input = "!";
        let verification = commandsService.extractCommandParameters(input);
        expect(verification.commandType).to.be.equal(CommandType.InvalidCmd);
    });

    it("extractCommandParameters, reconize the input of a valid message when it's not empty", () => {
        let input = "Hello World";
        let verification = commandsService.extractCommandParameters(input);
        expect(verification.commandType).to.be.equal(CommandType.MessageCmd);
    });

    it("extractCommandParameters, reconize the input of a valid message when it's not empty", () => {
        let input = "Hello World";
        let verification = commandsService.extractCommandParameters(input);
        expect(verification.commandType).to.be.equal(CommandType.MessageCmd);
    });

    it("invokeAndExecuteMessageCommand, should throw a null argument error with a null chatroomComponent", () => {
        let wrapper = () => commandsService.invokeAndExecuteMessageCommand(null, "fake message");
        expect(wrapper).throw(Error, "Null argument error: the parameters cannot be null");
    });

    it("invokeAndExecuteMessageCommand, should throw a null argument error with a empty letters", () => {
        let wrapper = () => commandsService.invokeAndExecuteMessageCommand(chatroomComponent, "");
        expect(wrapper).throw(Error, "Null argument error: the parameters cannot be null");
    });

    it("invokeAndExecuteMessageCommand, should throw a null argument error with a null letters", () => {
        let wrapper = () => commandsService.invokeAndExecuteMessageCommand(chatroomComponent, null);
        expect(wrapper).throw(Error, "Null argument error: the parameters cannot be null");
    });

    // it("invokeAndExecuteMessageCommand, should invoke the ExchangeLettersCommand without error", () => {
    //     let wrapper = () => commandsService.invokeAndExecuteMessageCommand(chatroomComponent, "abcd");
    //     expect(wrapper()).to.not.throw;
    // });

    it("invokeAndExecuteExchangeCommand, should throw a null argument error with a null easelComponent", () => {
        let wrapper = () => commandsService.invokeAndExecuteExchangeCommand(null, "abcd");
        expect(wrapper).throw(Error, "Null argument error: the parameters cannot be null");
    });

    // it("invokeAndExecuteExchangeCommand, should invoke the ExchangeLettersCommand without error", () => {
    //     let wrapper = () => commandsService.invokeAndExecuteExchangeCommand(easelComponent, "abcd");
    //     expect(wrapper()).to.not.throw;
    // });

    it("invokeAndExecutePlaceCommand, should throw a null argument error with a null easelComponent", () => {
        let wrapper = () => commandsService.invokeAndExecutePlaceCommand(null, boardComponent, "abcd");
        expect(wrapper).throw(Error, "Null argument error: the parameters cannot be null");
    });

    it("invokeAndExecutePlaceCommand, should throw a null argument error with a null boardComponent", () => {
        let wrapper = () => commandsService.invokeAndExecutePlaceCommand(easelComponent, null, "abcd");
        expect(wrapper).throw(Error, "Null argument error: the parameters cannot be null");
    });

    // it("invokeAndExecutePlaceCommand, should invoke the ExchangeLettersCommand without error", () => {
    //     let wrapper = () => commandsService.invokeAndExecutePlaceCommand(easelComponent, boardComponent, "abcd");
    //     expect(wrapper()).to.not.throw;
    // });

    it("invokeAndExecutePassCommand, should throw a null argument error with a empty letters", () => {
        let wrapper = () => commandsService.invokeAndExecutePassCommand(gameComponent);
        expect(wrapper).not.to.throw;
    });

    it("invokeAndExecutePassCommand, should throw a null argument error with a null gameComponent", () => {
        let wrapper = () => commandsService.invokeAndExecutePassCommand(null);
        expect(wrapper).throw(Error, "Null argument error: the parameters cannot be null");
    });

    it("invokeAndExecutePassCommand, should throw a null argument error with a null letters", () => {
        let wrapper = () => commandsService.invokeAndExecutePassCommand(undefined);
        expect(wrapper).throw(Error, "Null argument error: the parameters cannot be null");
    });

});
