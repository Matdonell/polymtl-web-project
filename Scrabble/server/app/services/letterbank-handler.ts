import { Letter } from "../models/letter";
import { LetterBank } from "../models/letterbank";

const FULL_EASEL = 7;
const MIN_LETTER_POSITION = 0;
const MAX_LETTER_POSITION = 26;

export class LetterBankHandler {
    private _bank: LetterBank;

    public get bank(): LetterBank {
        return this._bank;
    }

    constructor() {
        this.createLetterBank();
    }

    private createLetterBank() {
        this._bank = new LetterBank();
    }

    public initializeEasel(): Array<Letter> {
        return this.getLetterFromBank(FULL_EASEL);
    }

    public exchangeLetters(lettersToBeChanged: Array<string>): Array<string> {
        let newLetters = new Array<Letter>();
        if (lettersToBeChanged.length < this.bank.numberOfLettersInBank) {
            this.putLetterBackInBank(this.parseFromListOfStringToListOfLetterForExchange(lettersToBeChanged));
            newLetters = this.getLetterFromBank(lettersToBeChanged.length);
        }

        return this.parseFromListOfLetterToListOfString(newLetters);
    }

    public refillEasel(numberOfLetters: number): Array<Letter> {
        let newLetters = new Array<Letter>();
        return newLetters = this.getLetterFromBank(numberOfLetters);
    }

    private getLetterFromBank(numberOfLetters: number): Array<Letter> {
        let newEasel = new Array<Letter>();
        let randomLetter: Letter;
        let randomNumber: number;

        for (let index = 0; index < numberOfLetters; index++) {
            randomNumber = this.getRandomLetter();
            randomLetter = this.bank.bank[randomNumber];
            if (this.bank.numberOfLettersInBank === 0) {
                break;
            } else if (randomLetter.quantity > 0) {
                this._bank.getLetterFromBank(randomLetter);
                newEasel.push(randomLetter);
            } else {
                // Check of this is necessary, we can stay in an infinite loop here
                --index;
            }
        }

        return newEasel;
    }

    public putLetterBackInBank(lettersToBeChanged: Array<Letter>) {
        for (let index = 0; index < lettersToBeChanged.length; index++) {
            this.bank.putLetterBackInBank(lettersToBeChanged[index]);
        }
    }

    private getRandomLetter(): number {
        let randomNumber = (Math.random() * (1 - Math.random()) / (1 - Math.random()));
        let offset = MAX_LETTER_POSITION - MIN_LETTER_POSITION; //this._bank.numberOfLettersInBank;
        return Math.floor((randomNumber * offset) % offset);
    }

    public parseFromListOfStringToListOfLetter(alphabets: Array<string>): Array<Letter> {

        if (alphabets === null) {
            throw new Error("Null argument error: the letters cannot be null");
        }

        let letters = new Array<Letter>();
        alphabets.forEach((element: string) => {
            let alphabet =
                element.match("^[A-Z]$") !== null
                    && element.match("^[A-Z]$") !== undefined
                    && element.match("^[A-Z]$").length > 0 ? "blank" : element.toUpperCase();
            let letter = this._bank.bank.filter((alphaLetter: Letter) => {
                // If the char is an Capital letter
                return alphaLetter.alphabetLetter === alphabet;
            })[0];
            letters.push(letter);
        });

        return letters;
    }

    public parseFromListOfStringToListOfLetterForExchange(alphabets: Array<string>): Array<Letter> {

        if (alphabets === null) {
            throw new Error("Null argument error: the letters cannot be null");
        }

        let letters = new Array<Letter>();
        alphabets.forEach((element: string) => {
            let letter = this._bank.bank.filter((alphaLetter: Letter) => {
                // If the char is an Capital letter
                let alphabet =
                    (element.match("^[*]$") !== null
                        && element.match("^[*]$") !== undefined
                        && element.match("^[*]$").length > 0) ? "blank" : element;
                return alphaLetter.alphabetLetter === alphabet;
            })[0];
            letters.push(letter);
        });

        return letters;
    }

    public parseFromListOfLetterToListOfString(letters: Array<Letter>): Array<string> {

        if (letters === null) {
            throw new Error("Null argument error, the parameter cannot be null");
        }

        let newList = new Array<string>();
        letters.forEach((letter) => {
            newList.push(letter.alphabetLetter);
        });
        return newList;
    }

    public getNumberOfLettersInBank(): number {
        return this.bank.numberOfLettersInBank;
    }
}
