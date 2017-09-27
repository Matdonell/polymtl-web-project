import { Letter } from "./letter";
import { Alphabet } from "./commons/alphabet";
import { AlphabetQuantity } from "./commons/alphabet-quantity";

const INCREMENT_QUANTITY = 1;
const DECREMENT_QUANTITY = -1;

export class LetterBank {
    private _bank: Array<Letter>;
    private _numberOfLettersInBank: number;

    public get bank(): Array<Letter> {
        return this._bank;
    }

    public get numberOfLettersInBank(): number {
        return this._numberOfLettersInBank;
    }

    public set numberOfLettersInBank(numberOfLettersInBank: number) {
        this._numberOfLettersInBank = numberOfLettersInBank;
    }

    constructor() {
        this._bank = new Array<Letter>();
        this.numberOfLettersInBank = 102;
        this.initializeLetterBank();
    }

    private initializeLetterBank() {
        this._bank.push(new Letter(Alphabet.blank.letter, Alphabet.blank.point, AlphabetQuantity.blank));
        this._bank.push(new Letter(Alphabet.letterA.letter, Alphabet.letterA.point, AlphabetQuantity.letterA));
        this._bank.push(new Letter(Alphabet.letterB.letter, Alphabet.letterB.point, AlphabetQuantity.letterB));
        this._bank.push(new Letter(Alphabet.letterC.letter, Alphabet.letterC.point, AlphabetQuantity.letterC));
        this._bank.push(new Letter(Alphabet.letterD.letter, Alphabet.letterD.point, AlphabetQuantity.letterD));
        this._bank.push(new Letter(Alphabet.letterE.letter, Alphabet.letterE.point, AlphabetQuantity.letterE));
        this._bank.push(new Letter(Alphabet.letterF.letter, Alphabet.letterF.point, AlphabetQuantity.letterF));
        this._bank.push(new Letter(Alphabet.letterG.letter, Alphabet.letterG.point, AlphabetQuantity.letterG));
        this._bank.push(new Letter(Alphabet.letterH.letter, Alphabet.letterH.point, AlphabetQuantity.letterH));
        this._bank.push(new Letter(Alphabet.letterI.letter, Alphabet.letterI.point, AlphabetQuantity.letterI));
        this._bank.push(new Letter(Alphabet.letterJ.letter, Alphabet.letterJ.point, AlphabetQuantity.letterJ));
        this._bank.push(new Letter(Alphabet.letterK.letter, Alphabet.letterK.point, AlphabetQuantity.letterK));
        this._bank.push(new Letter(Alphabet.letterL.letter, Alphabet.letterL.point, AlphabetQuantity.letterL));
        this._bank.push(new Letter(Alphabet.letterM.letter, Alphabet.letterM.point, AlphabetQuantity.letterM));
        this._bank.push(new Letter(Alphabet.letterN.letter, Alphabet.letterN.point, AlphabetQuantity.letterN));
        this._bank.push(new Letter(Alphabet.letterO.letter, Alphabet.letterO.point, AlphabetQuantity.letterO));
        this._bank.push(new Letter(Alphabet.letterP.letter, Alphabet.letterP.point, AlphabetQuantity.letterP));
        this._bank.push(new Letter(Alphabet.letterQ.letter, Alphabet.letterQ.point, AlphabetQuantity.letterQ));
        this._bank.push(new Letter(Alphabet.letterR.letter, Alphabet.letterR.point, AlphabetQuantity.letterR));
        this._bank.push(new Letter(Alphabet.letterS.letter, Alphabet.letterS.point, AlphabetQuantity.letterS));
        this._bank.push(new Letter(Alphabet.letterT.letter, Alphabet.letterT.point, AlphabetQuantity.letterT));
        this._bank.push(new Letter(Alphabet.letterU.letter, Alphabet.letterU.point, AlphabetQuantity.letterU));
        this._bank.push(new Letter(Alphabet.letterV.letter, Alphabet.letterV.point, AlphabetQuantity.letterV));
        this._bank.push(new Letter(Alphabet.letterW.letter, Alphabet.letterW.point, AlphabetQuantity.letterW));
        this._bank.push(new Letter(Alphabet.letterX.letter, Alphabet.letterX.point, AlphabetQuantity.letterX));
        this._bank.push(new Letter(Alphabet.letterY.letter, Alphabet.letterY.point, AlphabetQuantity.letterY));
        this._bank.push(new Letter(Alphabet.letterZ.letter, Alphabet.letterZ.point, AlphabetQuantity.letterZ));
    }

    public letterIsAvailable(chosenLetter: Letter): boolean {
        let indexOfChosenLetter = this.findIndexOfChosenLetter(chosenLetter);
        return (indexOfChosenLetter !== null) ? this.bank[indexOfChosenLetter].quantity > 0 : false;
    }

    public getLetterFromBank(chosenLetter: Letter): Letter {
        // I found a bug
        // The Letterbank try to exchange and send null letters, and decrement even if the quantity is 0.
        // This must be fixed to return the same letter in this case
        let indexOfChosenLetter = this.findIndexOfChosenLetter(chosenLetter);
        this.modifyQuantityOfLetter(indexOfChosenLetter, DECREMENT_QUANTITY);
        return this.bank[indexOfChosenLetter];
    }

    public putLetterBackInBank(chosenLetter: Letter) {
        let indexOfChosenLetter = this.findIndexOfChosenLetter(chosenLetter);
        this.modifyQuantityOfLetter(indexOfChosenLetter, INCREMENT_QUANTITY);
    }

    private modifyQuantityOfLetter(indexOfChosenLetter: number, change: number) {
        this._bank[indexOfChosenLetter].quantity += change;
        this._numberOfLettersInBank += change;
    }

    private findIndexOfChosenLetter(chosenLetter: Letter): number {
        return (chosenLetter !== null) ?
            this.bank.findIndex((letter) => letter.alphabetLetter === chosenLetter.alphabetLetter) : null;
    }
}
