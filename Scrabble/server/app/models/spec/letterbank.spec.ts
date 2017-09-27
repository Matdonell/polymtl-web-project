import { Alphabet } from "../commons/alphabet";
import { AlphabetQuantity } from "../commons/alphabet-quantity";
import { Letter } from "../letter";
import { LetterBank } from "../letterbank";

import { expect, assert } from "chai";

let _letterBank: LetterBank;

describe("LetterBank should", () => {
    beforeEach(() => {
        _letterBank = new LetterBank();
    });

    it("construct a bank of letters correctly", () => {
        expect(_letterBank.bank[4].alphabetLetter).to.be.equal(Alphabet.letterD.letter);
        expect(_letterBank.bank[4].point).to.be.equal(Alphabet.letterD.point);
        expect(_letterBank.bank[4].quantity).to.be.equal(AlphabetQuantity.letterD);
    });

    it("get the bank of letters correctly", () => {
        let _fakeBank = new Array<Letter>();
        _fakeBank.push(new Letter(Alphabet.blank.letter, Alphabet.blank.point, AlphabetQuantity.blank));
        _fakeBank.push(new Letter(Alphabet.letterA.letter, Alphabet.letterA.point, AlphabetQuantity.letterA));
        _fakeBank.push(new Letter(Alphabet.letterB.letter, Alphabet.letterB.point, AlphabetQuantity.letterB));
        _fakeBank.push(new Letter(Alphabet.letterC.letter, Alphabet.letterC.point, AlphabetQuantity.letterC));
        _fakeBank.push(new Letter(Alphabet.letterD.letter, Alphabet.letterD.point, AlphabetQuantity.letterD));
        _fakeBank.push(new Letter(Alphabet.letterE.letter, Alphabet.letterE.point, AlphabetQuantity.letterE));
        _fakeBank.push(new Letter(Alphabet.letterF.letter, Alphabet.letterF.point, AlphabetQuantity.letterF));
        _fakeBank.push(new Letter(Alphabet.letterG.letter, Alphabet.letterG.point, AlphabetQuantity.letterG));
        _fakeBank.push(new Letter(Alphabet.letterH.letter, Alphabet.letterH.point, AlphabetQuantity.letterH));
        _fakeBank.push(new Letter(Alphabet.letterI.letter, Alphabet.letterI.point, AlphabetQuantity.letterI));
        _fakeBank.push(new Letter(Alphabet.letterJ.letter, Alphabet.letterJ.point, AlphabetQuantity.letterJ));
        _fakeBank.push(new Letter(Alphabet.letterK.letter, Alphabet.letterK.point, AlphabetQuantity.letterK));
        _fakeBank.push(new Letter(Alphabet.letterL.letter, Alphabet.letterL.point, AlphabetQuantity.letterL));
        _fakeBank.push(new Letter(Alphabet.letterM.letter, Alphabet.letterM.point, AlphabetQuantity.letterM));
        _fakeBank.push(new Letter(Alphabet.letterN.letter, Alphabet.letterN.point, AlphabetQuantity.letterN));
        _fakeBank.push(new Letter(Alphabet.letterO.letter, Alphabet.letterO.point, AlphabetQuantity.letterO));
        _fakeBank.push(new Letter(Alphabet.letterP.letter, Alphabet.letterP.point, AlphabetQuantity.letterP));
        _fakeBank.push(new Letter(Alphabet.letterQ.letter, Alphabet.letterQ.point, AlphabetQuantity.letterQ));
        _fakeBank.push(new Letter(Alphabet.letterR.letter, Alphabet.letterR.point, AlphabetQuantity.letterR));
        _fakeBank.push(new Letter(Alphabet.letterS.letter, Alphabet.letterS.point, AlphabetQuantity.letterS));
        _fakeBank.push(new Letter(Alphabet.letterT.letter, Alphabet.letterT.point, AlphabetQuantity.letterT));
        _fakeBank.push(new Letter(Alphabet.letterU.letter, Alphabet.letterU.point, AlphabetQuantity.letterU));
        _fakeBank.push(new Letter(Alphabet.letterV.letter, Alphabet.letterV.point, AlphabetQuantity.letterV));
        _fakeBank.push(new Letter(Alphabet.letterW.letter, Alphabet.letterW.point, AlphabetQuantity.letterW));
        _fakeBank.push(new Letter(Alphabet.letterX.letter, Alphabet.letterX.point, AlphabetQuantity.letterX));
        _fakeBank.push(new Letter(Alphabet.letterY.letter, Alphabet.letterY.point, AlphabetQuantity.letterY));
        _fakeBank.push(new Letter(Alphabet.letterZ.letter, Alphabet.letterZ.point, AlphabetQuantity.letterZ));
        expect(_letterBank.bank).to.be.deep.equals(_fakeBank);
    });

    it("should not find a letter from the bank", () => {
        // Since the letter Y has 1 as a quantity, we cannot find 2 instances of a Letter in the bank
        // I found a bug
        // The Letterbank try to exchange and send null letters, and decrement even if the quantity is 0.
        // This must be fixed to return the same letter in this case
        let letterY = new Letter(Alphabet.letterY.letter, Alphabet.letterY.point, AlphabetQuantity.letterY);
        letterY = _letterBank.getLetterFromBank(letterY);
        assert(_letterBank.letterIsAvailable(null) === false);
    });
});
