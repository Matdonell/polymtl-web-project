import { Alphabet } from "../../models/commons/alphabet";
import { AlphabetQuantity } from "../../models/commons/alphabet-quantity";
import { Letter } from "../../models/letter";
import { LetterBank } from "../../models/letterbank";
import { LetterBankHandler } from "../letterbank-handler";

import { expect } from "chai";

let _bankHandler: LetterBankHandler;

describe("BankLetterHandler should", () => {
    beforeEach(() => {
        _bankHandler = new LetterBankHandler();
    });

    it("construct a bank of letters correctly", () => {
        let bank = new LetterBank();
        expect(_bankHandler.bank).to.be.deep.equals(bank);
    });

    it("initialize an easel correctly", () => {
        let newEasel = _bankHandler.initializeEasel();
        expect(newEasel.length).to.be.equal(7);
        expect(_bankHandler.bank.numberOfLettersInBank).to.be.equal(95);
    });

    it("exchange letters correctly in case there are sufficiant letters in bank", () => {
        let newEasel = new Array<string>();
        let lettersToChange = new Array<Letter>();
        let previousQuantityOfLettersInBank = _bankHandler.bank.numberOfLettersInBank;
        lettersToChange.push(new Letter(Alphabet.blank.letter, Alphabet.blank.point, AlphabetQuantity.blank));
        lettersToChange.push(new Letter(Alphabet.letterA.letter, Alphabet.letterA.point, AlphabetQuantity.letterA));
        lettersToChange.push(new Letter(Alphabet.letterB.letter, Alphabet.letterB.point, AlphabetQuantity.letterB));
        lettersToChange.push(new Letter(Alphabet.letterC.letter, Alphabet.letterC.point, AlphabetQuantity.letterC));
        lettersToChange.push(new Letter(Alphabet.letterD.letter, Alphabet.letterD.point, AlphabetQuantity.letterD));
        lettersToChange.push(new Letter(Alphabet.letterE.letter, Alphabet.letterE.point, AlphabetQuantity.letterE));
        newEasel = _bankHandler.exchangeLetters(_bankHandler.parseFromListOfLetterToListOfString(lettersToChange));
        expect(newEasel.length).to.be.equal(lettersToChange.length);
        expect(previousQuantityOfLettersInBank).to.be.equal(_bankHandler.bank.numberOfLettersInBank);
    });

    it("prevent player from exchanging letters in case there are not sufficiant letters in bank", () => {
        let newEasel = new Array<string>();
        let lettersToChange = new Array<Letter>();
        _bankHandler.bank.numberOfLettersInBank = 1;
        lettersToChange.push(new Letter(Alphabet.blank.letter, Alphabet.blank.point, AlphabetQuantity.blank));
        lettersToChange.push(new Letter(Alphabet.letterA.letter, Alphabet.letterA.point, AlphabetQuantity.letterA));
        lettersToChange.push(new Letter(Alphabet.letterB.letter, Alphabet.letterB.point, AlphabetQuantity.letterB));
        lettersToChange.push(new Letter(Alphabet.letterC.letter, Alphabet.letterC.point, AlphabetQuantity.letterC));
        newEasel = _bankHandler.exchangeLetters(_bankHandler.parseFromListOfLetterToListOfString(lettersToChange));
        expect(newEasel.length).to.be.equal(0);
        expect(_bankHandler.bank.numberOfLettersInBank).to.be.equal(1);
    });

    it("refill a player's easel after when letters are missing", () => {
        let numberOfLetersPlaced = 3;
        let newEasel = new Array<Letter>();
        newEasel = _bankHandler.refillEasel(numberOfLetersPlaced);
        expect(newEasel.length).to.be.equal(numberOfLetersPlaced);
    });

    it("getLetterByAlphabet, should return a null argument error", () => {
        let getLetters = () => { _bankHandler.parseFromListOfStringToListOfLetter(null); };
        expect(getLetters).to.throw(Error, "Null argument error: the letters cannot be null");
    });

    it("getLetterByAlphabet, should return a null argument error", () => {
        let fakeLetters = ['A', 'K', 'E', 'O', 'P'];
        let newLetters = _bankHandler.parseFromListOfStringToListOfLetter(fakeLetters);

        expect(newLetters).not.to.be.null;
        expect(newLetters).not.to.be.undefined;
        expect(fakeLetters).to.not.deep.equals(newLetters);
    });

    it("get the number of letters in bank correctly", () => {
        expect(_bankHandler.getNumberOfLettersInBank()).to.be.equal(102);
        _bankHandler.initializeEasel();
        expect(_bankHandler.getNumberOfLettersInBank()).to.be.equal(95);
    });

    it("should not be able to return letter from the bank", () => {
        expect(_bankHandler.getNumberOfLettersInBank()).to.be.equal(102);
        // let fakeEasel = _bankHandler.getLetterFromBank(103);
        // expect(fakeEasel).to.be.null;
    });

    it("not parse null arrays of letters and throw an erro", () => {
        let getLefakeStringParsedtters = () => { _bankHandler.parseFromListOfLetterToListOfString(null); };
        expect(getLefakeStringParsedtters).to.throw(Error, "Null argument error, the parameter cannot be null");
    });
});
