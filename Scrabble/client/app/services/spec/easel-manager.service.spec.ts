import { IScrabbleLetter } from "../../models/scrabble-letter";
import { Alphabet } from "../../models/commons/alphabet";
import { LetterHelper } from "../../commons/letter-helper";
import { EaselManagerService } from "../easel-manager.service";

import { expect } from "chai";

const MIN_POSITION_INDEX = 0;
const MAX_POSITION_INDEX = 6;

describe("EaselManagerService", () => {
    let service: EaselManagerService;

    beforeEach(() => {
        service = new EaselManagerService();
    });

    it("initialize the service correctly", () => {
        expect(service).to.not.be.undefined;
    });

    it("reconize if the tab key has been pressed", () => {
        let verification = service.isTabKey(LetterHelper.TAB_KEY_CODE);
        expect(verification).to.be.true;
    });

    it("prevent a null keyCode to pretend to be a tab key", () => {
        let verification = () => service.isTabKey(null);
        expect(verification).to.throw(Error);
    });

    it("reconize when the tab key has not been pressed", () => {
        let verification = service.isTabKey(LetterHelper.LEFT_ARROW_KEY_CODE);
        expect(verification).to.be.false;
    });

    it("reconize if the leftArrowKey has been pressed as a direction key", () => {
        let verification = service.isDirection(LetterHelper.LEFT_ARROW_KEY_CODE);
        expect(verification).to.be.true;
    });

    it("reconize if the rightArrowKey has been pressed as a direction key", () => {
        let verification = service.isDirection(LetterHelper.RIGHT_ARROW_KEY_CODE);
        expect(verification).to.be.true;
    });

    it("reconize if another key has been pressed as a direction key", () => {
        let verification = service.isDirection(LetterHelper.LETTER_K_KEY_CODE);
        expect(verification).to.be.false;
    });

    it("prevent a null keyCode to pretend to be a direction key", () => {
        let verification = () => service.isDirection(null);
        expect(verification).to.throw(Error);
    });

    it("prevent a null keyCode to pretend to be a scrabbleLetter key", () => {
        let verification = () => service.isScrabbleLetter(null);
        expect(verification).to.throw(Error);
    });

    it("reconize any letter as a scrabbleLetter", () => {
        let keyCode: number;
        for (let index = LetterHelper.LETTER_A_KEY_CODE; index >= LetterHelper.LETTER_Z_KEY_CODE; ++index) {
            keyCode = index;
            expect(() => service.isScrabbleLetter(index)).to.be.true;
        }
    });

    it("reconize another key to pretend to be a scrabbleLetter", () => {
        let keyCodeAfterLetterZ = LetterHelper.LETTER_Z_KEY_CODE + 1;
        let keyCodeBeforeLetterA = LetterHelper.LETTER_A_KEY_CODE - 1;
        let verification = service.isScrabbleLetter(keyCodeBeforeLetterA);
        expect(verification).to.be.false;
        verification = service.isScrabbleLetter(keyCodeAfterLetterZ);
        expect(verification).to.be.false;
    });

    it("throw an exception when a null easelLenght is used in onKeyEventUpdate", () => {
        let verification = () => service.onKeyEventUpdateCurrentCursor(null, LetterHelper.RIGHT_ARROW_KEY_CODE, 3);
        expect(verification).to.throw(Error);
    });

    it("throw an exception when a null keyCode is used in onKeyEventUpdate", () => {
        let verification = () => service.onKeyEventUpdateCurrentCursor(3, null, 1);
        expect(verification).to.throw(Error);
    });

    it("reconize a new cursor when leftArrowKey is used in onKeyEventUpdate with first position", () => {
        let verification = service
            .onKeyEventUpdateCurrentCursor(7, LetterHelper.LEFT_ARROW_KEY_CODE, MIN_POSITION_INDEX);
        expect(verification).to.be.at.least(MIN_POSITION_INDEX - 1).and.at.most(MAX_POSITION_INDEX);
    });

    it("reconize a new cursor when rightArrowKey are used in onKeyEventUpdate  with first position", () => {
        let verification = service
            .onKeyEventUpdateCurrentCursor(7, LetterHelper.RIGHT_ARROW_KEY_CODE, MIN_POSITION_INDEX);
        expect(verification).to.be.at.least(MIN_POSITION_INDEX - 1).and.at.most(MAX_POSITION_INDEX);
    });

    it("reconize a new cursor when the tab key is used in onKeyEventUpdate  with first position", () => {
        let verification = service.onKeyEventUpdateCurrentCursor(7, LetterHelper.TAB_KEY_CODE, MIN_POSITION_INDEX);
        expect(verification).to.be.at.least(MIN_POSITION_INDEX - 1).and.at.most(MAX_POSITION_INDEX);
    });

    it("put the cursor back to position 0 when other keys are used in onKeyEventUpdate  with first position", () => {
        let verification = service.onKeyEventUpdateCurrentCursor(7, LetterHelper.LETTER_O_KEY_CODE, MIN_POSITION_INDEX);
        expect(verification).to.be.equal(0);
    });

    it("reconize a new cursor when leftArrowKey is used in onKeyEventUpdate with last position", () => {
        let verification = service
            .onKeyEventUpdateCurrentCursor(7, LetterHelper.LEFT_ARROW_KEY_CODE, MAX_POSITION_INDEX);
        expect(verification).to.be.at.least(MIN_POSITION_INDEX - 1).and.at.most(MAX_POSITION_INDEX);
    });

    it("reconize a new cursor when rightArrowKey are used in onKeyEventUpdate with last position", () => {
        let verification = service
            .onKeyEventUpdateCurrentCursor(7, LetterHelper.RIGHT_ARROW_KEY_CODE, MAX_POSITION_INDEX);
        expect(verification).to.be.at.least(MIN_POSITION_INDEX - 1).and.at.most(MAX_POSITION_INDEX);
    });

    it("reconize a new cursor when the tab key is used in onKeyEventUpdate with last position", () => {
        let verification = service.onKeyEventUpdateCurrentCursor(7, LetterHelper.TAB_KEY_CODE, MAX_POSITION_INDEX);
        expect(verification).to.be.at.least(MIN_POSITION_INDEX - 1).and.at.most(MAX_POSITION_INDEX);
    });

    it("put the cursor back to position 0 when other keys are used in onKeyEventUpdate with last position", () => {
        let verification = service.onKeyEventUpdateCurrentCursor(7, LetterHelper.LETTER_O_KEY_CODE, MAX_POSITION_INDEX);
        expect(verification).to.be.equal(0);
    });

    it("allow to set focus on a letter with a valid index", () => {
        let verification = () => service.setFocusToElementWithGivenIndex(6, 2);
        expect(verification).to.not.throw(Error);
    });

    it("throw and exception if the text is null when trying to get a list of char", () => {
        let verification = () => service.parseStringToListOfChar(null);
        expect(verification).to.throw(Error);
    });

    it("throw and exception if the text is not null when trying to get a list of char", () => {
        let response = service.parseStringToListOfChar("abc");
        expect(response).to.be.an.instanceOf(Array);
    });

    it("throw and exception if the array is null when trying to get a list of string", () => {
        let verification = () => service.parseScrabbleLettersToListOfChar(null);
        expect(verification).to.throw(Error);
    });

    it("throw and exception if the text is not null when trying to get a list of char", () => {
        let scrabbleLetters = new Array<IScrabbleLetter>();
        scrabbleLetters.push({_alphabetLetter: Alphabet.LETTER_A, _imageSource: ""});
        scrabbleLetters.push({_alphabetLetter: Alphabet.LETTER_B, _imageSource: ""});
        scrabbleLetters.push({_alphabetLetter: Alphabet.LETTER_BLANK, _imageSource: ""});
        let response = service.parseScrabbleLettersToListOfChar(scrabbleLetters);
        expect(response).to.be.an.instanceOf(Array);
    });

    it("throw an error if the easelLetters is null when trying to get a scrabble letter from easel", () => {
        //let easelLetters = new Array<ScrabbleLetter>();
        let enteredLetters = [Alphabet.LETTER_A, Alphabet.LETTER_D];
        let verification = () => service.getScrabbleWordFromTheEasel(null, enteredLetters);
        expect(verification).to.throw(Error);
    });

    it("throw an error if the enteredLetters is null when trying to get a scrabble letter from easel", () => {
        let easelLetters = new Array<IScrabbleLetter>();
        easelLetters.push({_alphabetLetter: Alphabet.LETTER_F, _imageSource: ""});
        let verification = () => service.getScrabbleWordFromTheEasel(easelLetters, null);
        expect(verification).to.throw(Error);
    });
});
