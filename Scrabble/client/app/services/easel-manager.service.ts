import { Injectable } from "@angular/core";
import { LetterHelper } from "../commons/letter-helper";
import { IScrabbleLetter } from "../models/scrabble-letter";

declare var jQuery: any;

export const INPUT_ID_PREFIX = '#easelCell_';
export const MIN_POSITION_INDEX = 0;
export const MAX_POSITION_INDEX = 6;
export const CSS_BORDER = 'border';
export const CSS_BOX_SHADOW = 'box-shadow';
export const CSS_OUT_LINE = 'out-line';
export const IMAGE_SOURCE_PATH = '../../assets/images/';
export const IMAGE_EXT = '.jpg';

const EASEL_INIT_ELEMENT_CSS = {
    'border': '1px solid #000',
    'boxShadow': 'none',
    'outline': '0 none'
};

const EASEL_FOCUS_ELEMENT_CSS = {
    'border': '3px solid red',
    'boxShadow': '0 1px 1px red inset, 0 0 8px red',
    'outline': '0 none'
};

@Injectable()
export class EaselManagerService {

    constructor() {
        // Default constructor
    }

    public isDirection(keyCode: number): boolean {
        let verification: boolean;
        if (keyCode === null) {
            throw new Error("Argument error: the keyCode cannot be null");
        }
        verification = (LetterHelper.LEFT_ARROW_KEY_CODE === keyCode
            || keyCode === LetterHelper.RIGHT_ARROW_KEY_CODE);
        return verification;
    }

    public isScrabbleLetter(keyCode: number): boolean {
        let verification: boolean;
        if (keyCode === null) {
            throw new Error("Argument error: the keyCode cannot be null");
        }
        verification = (LetterHelper.LETTER_A_KEY_CODE <= keyCode && keyCode <= LetterHelper.LETTER_Z_KEY_CODE);
        return verification;
    }

    public isTabKey(keyCode: number): boolean {
        let verification: boolean;
        if (keyCode === null) {
            throw new Error("Argument error: the keyCode cannot be null");
        }
        verification = (keyCode === LetterHelper.TAB_KEY_CODE);
        return verification;
    }

    public onKeyEventUpdateCurrentCursor(easelLength: number, keyCode: number, currentPosition?: number): number {
        if (easelLength === null) {
            throw new Error("Argument error: the easelLenght cannot be null");
        }
        this.removeFocusFormatInEasel(easelLength);

        if (keyCode === null) {
            throw new Error("Argument error: the keyCode cannot be null");
        }

        let newPosition = this.getNextLetterPosition(keyCode, currentPosition);
        if (newPosition !== null) {
            this.setFocusToElementWithGivenIndex(easelLength, newPosition);
        }



        return newPosition;
    }

    private getNextLetterPosition(keyCode: number, currentPosition: number): number {
        let newPosition: number;

        switch (keyCode) {
            case LetterHelper.LEFT_ARROW_KEY_CODE:
                newPosition = currentPosition - 1;
                return (newPosition < MIN_POSITION_INDEX) ? MAX_POSITION_INDEX : newPosition;
            case LetterHelper.RIGHT_ARROW_KEY_CODE:
                newPosition = currentPosition + 1;
                return (newPosition > MAX_POSITION_INDEX) ? MIN_POSITION_INDEX : newPosition;
            case LetterHelper.TAB_KEY_CODE:
                return MIN_POSITION_INDEX;
            default:
                return newPosition = 0;
        }
    }

    private removeFocusFormatToElementWithGivenIndex(index: number) {
        let newInputId = [INPUT_ID_PREFIX, index].join('');
        if (jQuery(newInputId) !== undefined) {
            jQuery(newInputId).css(CSS_BORDER, EASEL_INIT_ELEMENT_CSS.border);
            jQuery(newInputId).css(CSS_OUT_LINE, EASEL_INIT_ELEMENT_CSS.outline);
            jQuery(newInputId).css(CSS_BOX_SHADOW, EASEL_INIT_ELEMENT_CSS.boxShadow);
        }
    }

    public removeFocusFormatInEasel(easelLength: number) {
        for (let index = 0; index < easelLength; ++index) {
            this.removeFocusFormatToElementWithGivenIndex(index);
        }
    }

    public setFocusToElementWithGivenIndex(easelLength: number, index: number) {
        let newInputId = [INPUT_ID_PREFIX, index].join('');
        this.removeFocusFormatInEasel(easelLength);
        if (jQuery(newInputId) !== undefined) {
            jQuery(newInputId).focus();
            jQuery(newInputId).css(CSS_BORDER, EASEL_FOCUS_ELEMENT_CSS.border);
            jQuery(newInputId).css(CSS_OUT_LINE, EASEL_FOCUS_ELEMENT_CSS.outline);
            jQuery(newInputId).css(CSS_BOX_SHADOW, EASEL_FOCUS_ELEMENT_CSS.boxShadow);
        }
    }

    public parseStringToListOfChar(texte: string): Array<string> {
        if (texte === null
            || texte === undefined) {
            throw new Error("Null argument error: The parameter cannot be null");
        }
        let listOfChar = new Array<string>();
        for (let index = 0; index < texte.length; ++index) {
            listOfChar.push(texte[index]);

        }
        return listOfChar;
    }

    public parseScrabbleLettersToListOfChar(scrabbleLetters: Array<IScrabbleLetter>): Array<string> {
        if (scrabbleLetters === null) {
            throw new Error("Null argument error: The parameter cannot be null");
        }
        let listOfChar = new Array<string>();
        for (let index = 0; index < scrabbleLetters.length; ++index) {
            listOfChar.push(scrabbleLetters[index]._alphabetLetter.toUpperCase());
        }
        return listOfChar;
    }

    public getScrabbleLetterFromStringLetter(letters: Array<string>): Array<IScrabbleLetter> {

        if (letters === null || letters.length < 1) {
            throw new Error("Invalid argument error");
        }

        let scrabbleLettres = new Array<IScrabbleLetter>();
        for (let index = 0; index < letters.length; ++index) {
            let letterString = (letters[index] === '*') ? 'blank' : letters[index];
            let letter = {
                _alphabetLetter: letterString,
                _imageSource: ""
            };

            letter._imageSource = IMAGE_SOURCE_PATH + letter._alphabetLetter + IMAGE_EXT;
            scrabbleLettres.push(letter);
        }
        return scrabbleLettres;
    }

    public getScrabbleWordFromTheEasel(
        easelLetters: Array<IScrabbleLetter>,
        enteredLetters: Array<string>):
        Array<IScrabbleLetter> {
        if (enteredLetters === null
            || easelLetters === null) {
            throw new Error("Null argument error: The parameter cannot be null");
        }

        let words = new Array<IScrabbleLetter>();
        let tempEaselLetters = new Array<string>();

        easelLetters.forEach((letter) => {
            tempEaselLetters.push(letter._alphabetLetter);
        });

        // Since the char '*' should be recognize has the blank letter,
        // We have to check if the input list is not a '*' because the easel does not contains a '*' char.
        for (let index = 0; index < enteredLetters.length; ++index) {
            let letterIndex = tempEaselLetters.findIndex((letter) => {
                return letter === enteredLetters[index]
                    || enteredLetters[index] === '*';
            });

            if (letterIndex !== -1) {
                words.push(easelLetters[letterIndex]);
                tempEaselLetters[letterIndex] = null;
            }
        }

        words = (words.length === enteredLetters.length) ? words : null;
        return words;
    }
}
