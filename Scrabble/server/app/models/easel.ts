import { Letter } from "./letter";
import { CommandsHelper } from "../services/commons/command/command-helper";

/**
 * Easel
 */
export class Easel {
    private _letters: Array<Letter>;

    constructor(letters?: Array<Letter>) {
        this._letters = new Array<Letter>();
        if (letters) {
            this.replaceLetters(letters);
        }
    }

    public get letters(): Array<Letter> {
        return this._letters;
    }
    public set letters(v: Array<Letter>) {
        this._letters = v;
    }

    public replaceLetters(newLetters: Array<Letter>) {
        this.clearEasel();
        newLetters.forEach((letter: Letter) => {
            this._letters.push(new Letter(letter.alphabetLetter, letter.point, letter.quantity));
        });
    }

    public addLetters(newLetters: Array<Letter>) {
        newLetters.forEach((letter: Letter) => {
            this._letters.push(letter);
        });
    }

    public addLetter(newLetter: Letter) {
        this._letters.push(newLetter);
    }

    public removeLetter(letterChar: string) {
        let index = this._letters.findIndex((letter: Letter) => {
            return letter.alphabetLetter === letterChar;
        });
        this._letters.splice(index, 1);
    }

    public clearEasel() {
        this._letters.splice(0);
    }

    public containsLetter(letter: Letter): boolean {
        return this._letters.some((letterEasel: Letter) => {
            return letterEasel.alphabetLetter === letter.alphabetLetter;
        });
    }

    public countPointsOnEasel(): number {
        let point = 0;
        this._letters.forEach((letter: Letter) => {
            point += letter.point;
        });
        return point;
    }

    public exchangeLetters(lettersToBeExchanged: Array<string>, newLettersStr: Array<string>): boolean {
        let indexOfLettersToChange = new Array<number>();

        let tempEaselLetters = new Array<string>();
        this._letters.forEach((letter) => {
            tempEaselLetters.push(letter.alphabetLetter);
        });

        for (let index = 0; index < lettersToBeExchanged.length; ++index) {
            if (lettersToBeExchanged[index] === CommandsHelper.BLANK_VALUE) {
                lettersToBeExchanged[index] = CommandsHelper.BLANK_WORD;
            }

            let letterIndex = tempEaselLetters.findIndex((letter: string) =>
                letter.toUpperCase() === lettersToBeExchanged[index].toUpperCase());

            if (letterIndex === -1 || letterIndex === undefined) {
                return false;
            }

            tempEaselLetters[letterIndex] = '-1';
            indexOfLettersToChange.push(letterIndex);
        }
        if (indexOfLettersToChange.length === lettersToBeExchanged.length) {
            for (let i = 0; i < indexOfLettersToChange.length; i++) {
                let indexEasel = indexOfLettersToChange[i];
                this._letters[indexEasel].alphabetLetter = newLettersStr[i];
            }
            return true;
        }
        return false;
    }
}
