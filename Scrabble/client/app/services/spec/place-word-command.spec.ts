// import { NO_ERRORS_SCHEMA, } from "@angular/core";
// import { APP_BASE_HREF } from "@angular/common";
// import { RouterTestingModule, } from "@angular/router/testing";
// import { Router, ActivatedRoute } from "@angular/router";
// import { GameRoomModule } from '../../../modules/game-room.module';
// import { GameStartModule } from '../../../modules/game-start.module';
// import {
//     ComponentFixture,
//     TestBed,
//     async,
// } from '@angular/core/testing';

// import { expect, assert } from "chai";

// import { EaselComponent } from "../../../components/easel.component";
// import { ChatroomComponent } from "../../../components/chatroom.component";
// import { GameComponent } from "../../../components/game-room.component";
// import { GameInitiationComponent } from "../../../components/game-initiation.component";
// import { BoardComponent } from "../../../components/board.component";
// import { IScrabbleLetter } from "../../../models/letter/scrabble-letter";
// import { Alphabet } from "../../../models/letter/alphabet";
// import { CommandStatus } from "./../commons/command-status";
// import { CommandType } from "./../commons/command-type";
// import { ICommandRequest } from "./../commons/command-request";
// import { SocketEventType } from '../../../commons/socket-eventType';
// import { PlaceWordCommand } from "./place-word-command";

// import { SocketService } from "../../../services/socket-service";
// import { EaselManagerService } from "../../easel/easel-manager.service";

// import { Observable } from "rxjs/Observable";

// describe("PlaceWordCommand", function () {

//     let placeWordCommand: PlaceWordCommand;
//     let easelComponent: EaselComponent;
//     let boardComponent: BoardComponent;
//     let fixtureEasel: ComponentFixture<EaselComponent>;
//     let fixtureBoard: ComponentFixture<BoardComponent>;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             schemas: [NO_ERRORS_SCHEMA],
//             imports: [GameRoomModule, GameStartModule],
//             declarations: [],
//             providers: [
//                 { provide: APP_BASE_HREF, useValue: '/game-room/test' },
//                 SocketService,
//                 EaselManagerService,
//             ],

//         })
//             .compileComponents();
//     }));

//     beforeEach(() => {
//         fixtureEasel = TestBed.createComponent(EaselComponent);
//         easelComponent = fixtureEasel.componentInstance;
//         easelComponent.letters.push(new ScrabbleLetter(Alphabet.LETTER_A));
//         easelComponent.letters.push(new ScrabbleLetter(Alphabet.LETTER_B));
//         easelComponent.letters.push(new ScrabbleLetter(Alphabet.LETTER_C));
//         easelComponent.letters.push(new ScrabbleLetter(Alphabet.LETTER_D));
//         easelComponent.letters.push(new ScrabbleLetter(Alphabet.LETTER_E));
//         easelComponent.letters.push(new ScrabbleLetter(Alphabet.LETTER_F));
//         easelComponent.letters.push(new ScrabbleLetter(Alphabet.LETTER_BLANK));

//         fixtureBoard = TestBed.createComponent(BoardComponent);
//         boardComponent = fixtureBoard.componentInstance;
//     });


//     it("PlaceWordCommand should  throw a null argument error with a null EaselComponent", () => {
//         let commandConstructor = () => new PlaceWordCommand(null, boardComponent, "abef");
//         expect(commandConstructor).throw(Error, "Null argument error: the parameters cannot be null");
//     });

//     it("PlaceWordCommand should  throw a null argument error with a null BoardComponent", () => {
//         let commandConstructor = () => new PlaceWordCommand(easelComponent, null, "abef");
//         expect(commandConstructor).throw(Error, "Null argument error: the parameters cannot be null");
//     });

//     it("PlaceWordCommand should  throw a null argument error with a null parameters", () => {
//         let commandConstructor = () => new PlaceWordCommand(easelComponent, boardComponent, null);
//         expect(commandConstructor).throw(Error, "Null argument error: the parameters cannot be null");
//     });

//     it("PlaceWordCommand should initialize the command correctly", () => {
//         let placeAWordCommand = new PlaceWordCommand(easelComponent, boardComponent, "abcd");
//         expect(placeAWordCommand.commandRequest._commandStatus === CommandStatus.Unknown);
//         expect(placeAWordCommand.commandRequest._commandType === CommandType.PlaceCmd);
//         expect(placeAWordCommand.commandRequest._response).instanceOf(Array);
//         expect(placeAWordCommand.parameters === "abcd");
//     });

//     it("should not validate a wrong letter when writing a word request", () => {
//         let lettersInEasel = new Array<IScrabbleLetter>();
//         lettersInEasel.push(new ScrabbleLetter(Alphabet.LETTER_A));
//         lettersInEasel.push(new ScrabbleLetter(Alphabet.LETTER_B));
//         lettersInEasel.push(new ScrabbleLetter(Alphabet.LETTER_BLANK));
//         easelComponent.letters = lettersInEasel;

//         let request = "a4v .._@.";
//         let placeAWordCommand = new PlaceWordCommand(easelComponent, boardComponent, request);
//         let verification = placeAWordCommand.createPlaceWordRequest(lettersInEasel);
//         expect(verification._commandStatus).to.be.equal(CommandStatus.SynthaxeError);
//     });

//     it("should not validate a empty letter when writing a word request", () => {
//         let lettersInEasel = new Array<IScrabbleLetter>();
//         lettersInEasel.push(new ScrabbleLetter(Alphabet.LETTER_A));
//         lettersInEasel.push(new ScrabbleLetter(Alphabet.LETTER_B));
//         lettersInEasel.push(new ScrabbleLetter(Alphabet.LETTER_BLANK));
//         easelComponent.letters = lettersInEasel;

//         let request = "a4v   ";
//         let placeAWordCommand = new PlaceWordCommand(easelComponent, boardComponent, request);
//         let verification = placeAWordCommand.createPlaceWordRequest(lettersInEasel);
//         expect(verification._commandStatus).to.be.equal(CommandStatus.SynthaxeError);
//     });

//     it("should not validate a wrong position when writing a word request", () => {
//         let lettersInEasel = new Array<IScrabbleLetter>();
//         lettersInEasel.push(new ScrabbleLetter(Alphabet.LETTER_A));
//         lettersInEasel.push(new ScrabbleLetter(Alphabet.LETTER_B));
//         lettersInEasel.push(new ScrabbleLetter(Alphabet.LETTER_BLANK));
//         easelComponent.letters = lettersInEasel;

//         let request = "a34v ab";
//         let placeAWordCommand = new PlaceWordCommand(easelComponent, boardComponent, request);

//         let verification = placeAWordCommand.createPlaceWordRequest(lettersInEasel);
//         expect(verification._commandStatus).to.be.equal(CommandStatus.SynthaxeError);
//     });

//     it("should not validate a wrong position when writing a word request", () => {
//         let lettersInEasel = new Array<IScrabbleLetter>();
//         lettersInEasel.push(new ScrabbleLetter(Alphabet.LETTER_A));
//         lettersInEasel.push(new ScrabbleLetter(Alphabet.LETTER_B));
//         lettersInEasel.push(new ScrabbleLetter(Alphabet.LETTER_BLANK));
//         easelComponent.letters = lettersInEasel;

//         let request = "a0v ab";
//         let placeAWordCommand = new PlaceWordCommand(easelComponent, boardComponent, request);

//         let verification = placeAWordCommand.createPlaceWordRequest(lettersInEasel);
//         expect(verification._commandStatus).to.be.equal(CommandStatus.SynthaxeError);
//     });

//     it("should not validate a wrong position <0 when writing a word request", () => {
//         let lettersInEasel = new Array<IScrabbleLetter>();
//         lettersInEasel.push(new ScrabbleLetter(Alphabet.LETTER_A));
//         lettersInEasel.push(new ScrabbleLetter(Alphabet.LETTER_B));
//         lettersInEasel.push(new ScrabbleLetter(Alphabet.LETTER_BLANK));
//         easelComponent.letters = lettersInEasel;

//         let request = "a-3v ab";
//         let placeAWordCommand = new PlaceWordCommand(easelComponent, boardComponent, request);

//         let verification = placeAWordCommand.createPlaceWordRequest(lettersInEasel);
//         expect(verification._commandStatus).to.be.equal(CommandStatus.SynthaxeError);
//     });

//     it("should not validate a wrong position >15 when writing a word request", () => {
//         let lettersInEasel = new Array<IScrabbleLetter>();
//         lettersInEasel.push(new ScrabbleLetter(Alphabet.LETTER_A));
//         lettersInEasel.push(new ScrabbleLetter(Alphabet.LETTER_B));
//         lettersInEasel.push(new ScrabbleLetter(Alphabet.LETTER_BLANK));
//         easelComponent.letters = lettersInEasel;

//         let request = "a20v ab";
//         let placeAWordCommand = new PlaceWordCommand(easelComponent, boardComponent, request);

//         let verification = placeAWordCommand.createPlaceWordRequest(lettersInEasel);
//         expect(verification._commandStatus).to.be.equal(CommandStatus.SynthaxeError);
//     });

//     it("should not validate a wrong position when writing a word request", () => {
//         let lettersInEasel = new Array<IScrabbleLetter>();
//         lettersInEasel.push(new ScrabbleLetter(Alphabet.LETTER_A));
//         lettersInEasel.push(new ScrabbleLetter(Alphabet.LETTER_B));
//         lettersInEasel.push(new ScrabbleLetter(Alphabet.LETTER_BLANK));
//         easelComponent.letters = lettersInEasel;

//         let request = "a.v ab";
//         let placeAWordCommand = new PlaceWordCommand(easelComponent, boardComponent, request);
//         let verification = placeAWordCommand.createPlaceWordRequest(lettersInEasel);
//         expect(verification._commandStatus).to.be.equal(CommandStatus.SynthaxeError);
//     });


//     it("should not find the entered word in the easel", () => {
//         let lettersInEasel = new Array<IScrabbleLetter>();
//         lettersInEasel.push(new ScrabbleLetter(Alphabet.LETTER_A));
//         lettersInEasel.push(new ScrabbleLetter(Alphabet.LETTER_B));
//         lettersInEasel.push(new ScrabbleLetter(Alphabet.LETTER_BLANK));
//         easelComponent.letters = lettersInEasel;

//         let request = "a4v axxxb";
//         let placeAWordCommand = new PlaceWordCommand(easelComponent, boardComponent, request);
//         let verification = placeAWordCommand.createPlaceWordRequest(lettersInEasel);

//         console.log(verification._commandStatus);
//         expect(verification._commandStatus).to.be.equal(CommandStatus.NotAllowed);
//     });

//     it("should create the request without error", () => {
//         let lettersInEasel = new Array<IScrabbleLetter>();
//         lettersInEasel.push(new ScrabbleLetter(Alphabet.LETTER_A));
//         lettersInEasel.push(new ScrabbleLetter(Alphabet.LETTER_B));
//         lettersInEasel.push(new ScrabbleLetter(Alphabet.LETTER_C));
//         lettersInEasel.push(new ScrabbleLetter(Alphabet.LETTER_D));
//         lettersInEasel.push(new ScrabbleLetter(Alphabet.LETTER_E));
//         lettersInEasel.push(new ScrabbleLetter(Alphabet.LETTER_BLANK));
//         easelComponent.letters = lettersInEasel;

//         let request = "a4v ab*d";
//         let placeAWordCommand = new PlaceWordCommand(easelComponent, boardComponent, request);
//         let verification = placeAWordCommand.createPlaceWordRequest(lettersInEasel);

//         console.log("---", verification);
//         expect(verification._commandStatus).to.be.equal(CommandStatus.Ok);
//         expect(verification._commandType).to.be.equal(CommandType.PlaceCmd);
//         // assert(verification._response.length === 4);
//     });

//     it("should execute the command without error", () => {
//         let lettersInEasel = new Array<IScrabbleLetter>();
//         lettersInEasel.push(new ScrabbleLetter(Alphabet.LETTER_A));
//         lettersInEasel.push(new ScrabbleLetter(Alphabet.LETTER_B));
//         lettersInEasel.push(new ScrabbleLetter(Alphabet.LETTER_C));
//         easelComponent.letters = lettersInEasel;

//         let request = "a4v ab";
//         let placeAWordCommand = new PlaceWordCommand(easelComponent, boardComponent, request);

//         expect(placeAWordCommand.execute()).to.not.throw;
//     });

// });
