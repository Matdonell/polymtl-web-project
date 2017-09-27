import { ExceptionHelper } from '../commons/exception-helper';
import { CommandsHelper } from '../commons/command/command-helper';
import { LetterHelper } from '../../models/commons/letter-helper';

export class BoardHelper {
    public static isValidRowLetterPosition(rowIndex: number): boolean {
        ExceptionHelper.throwNullArgumentException(rowIndex);
        let letter = String.fromCharCode(rowIndex);
        let keyCode = letter.toUpperCase().charCodeAt(0);
        return keyCode >= LetterHelper.LETTER_A_KEY_CODE
            && keyCode <= LetterHelper.LETTER_O_KEY_CODE;
    }

    public static isValidRowPosition(rowIndex: number): boolean {
        ExceptionHelper.throwNullArgumentException(rowIndex);
        return rowIndex >= CommandsHelper.MIN_BOARD_POSITION_INDEX - 1
            && rowIndex <= CommandsHelper.MAX_BOARD_POSITION_INDEX - 1;
    }

    public static isValidColumnPosition(index: number): boolean {
        ExceptionHelper.throwNullArgumentException(index);
        return index >= CommandsHelper.MIN_BOARD_POSITION_INDEX - 1
            && index <= CommandsHelper.MAX_BOARD_POSITION_INDEX - 1;
    }

    public static isValidOrientation(orientation: string): boolean {
        ExceptionHelper.throwNullArgumentException(orientation);
        return orientation === CommandsHelper.VERTICAL_ORIENTATION
            || orientation === CommandsHelper.HORIZONTAL_ORIENTATION;
    }

    public static parseFromNumberToCharacter(value: number) {
        ExceptionHelper.throwNullArgumentException(value);
        ExceptionHelper.throwOutOfRangeException(
            LetterHelper.LETTER_A_KEY_CODE,
            LetterHelper.LETTER_Z_KEY_CODE,
            value);
        return String.fromCharCode(value);
    }

    public static convertCharToIndex(letter: string) {
        ExceptionHelper.throwNullArgumentException(letter);
        return letter.toUpperCase().charCodeAt(0) - LetterHelper.LETTER_A_KEY_CODE;
    }
}
