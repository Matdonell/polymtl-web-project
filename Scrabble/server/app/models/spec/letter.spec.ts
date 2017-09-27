import { Letter } from "../letter";
import { Alphabet } from "../commons/alphabet";
import { AlphabetQuantity } from "../commons/alphabet-quantity";

import { expect } from "chai";

let _letter: Letter;
let _alphabetLetter = Alphabet.letterE.letter;
let _point = Alphabet.letterE.point;
let _quantity = AlphabetQuantity.letterE;

describe("Letter should", () => {
    beforeEach(() => {
        _letter = new Letter(_alphabetLetter, _point, _quantity);
    });

    it("construct a letter object correctly", () => {
        expect(_letter.alphabetLetter).to.be.equal(_alphabetLetter);
        expect(_letter.point).to.be.equal(_point);
        expect(_letter.quantity).to.be.equal(_quantity);
        expect(_letter.imageSource).to.be.equal("");
    });

    it("get the alphabet letter correctly", () => {
        expect(_letter.alphabetLetter).to.be.equal(_alphabetLetter);
    });

    it("set the alphabet letter corectly", () => {
        _alphabetLetter = Alphabet.letterR.letter;
        _letter.alphabetLetter = Alphabet.letterR.letter;
        expect(_letter.alphabetLetter).to.be.equal(_alphabetLetter);
    });

    it("get the point value of a letter corectly", () => {
        expect(_letter.point).to.be.equal(_point);
    });

    it("set the point value of a letter corectly", () => {
        _point = Alphabet.letterR.point;
        _letter.point = Alphabet.letterR.point;
        expect(_letter.point).to.be.equal(_point);
    });

    it("get the quantity for a letter corectly", () => {
        expect(_letter.quantity).to.be.equal(_quantity);
    });

    it("set the score of the player corectly", () => {
        _quantity = AlphabetQuantity.letterR;
        _letter.quantity = AlphabetQuantity.letterR;
        expect(_letter.quantity).to.be.equal(_quantity);
    });
});
