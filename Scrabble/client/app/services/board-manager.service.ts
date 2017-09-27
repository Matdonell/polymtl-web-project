import { Injectable } from '@angular/core';
declare var jQuery: any;

import { EaselManagerService } from "./easel-manager.service";
import { CommandsHelper } from "./commons/commands-helper";
import { LetterHelper } from "../commons/letter-helper";
import { ExceptionHelperService } from "./exception-helper.service";

import { Board } from '../models/board';

export const INPUT_ID_PREFIX = '#';
export const CSS_BACKGROUND_IMAGE = 'background-image';
export const BACKGROUND_URL_PREFIX = 'url(';
export const BACKGROUND_URL_SUFFIX = ')';

@Injectable()
export class BoardManagerService {

    private _board: Board;
    public get board(): Board {
        return this._board;
    }
    public set board(v: Board) {
        this._board = v;
    }

    constructor(
        private easelManagerService: EaselManagerService,
        private exceptionHelperService: ExceptionHelperService) {
        // Constructor
    }

    public isValidRowPosition(letter: string): boolean {
        this.exceptionHelperService.throwNullArgumentException(letter);
        let keyCode = letter.toUpperCase().charCodeAt(0);
        return keyCode >= LetterHelper.LETTER_A_KEY_CODE
            && keyCode <= LetterHelper.LETTER_O_KEY_CODE;
    }

    public isValidColumnPosition(index: number): boolean {
        this.exceptionHelperService.throwNullArgumentException(index);
        return index !== 0 && !isNaN(Number(index))
            && index >= CommandsHelper.MIN_BOARD_POSITION_INDEX
            && index <= CommandsHelper.MAX_BOARD_POSITION_INDEX;
    }

    public isValidOrientation(orientation: string): boolean {
        this.exceptionHelperService.throwNullArgumentException(orientation);
        return orientation === CommandsHelper.VERTICAL_ORIENTATION
            || orientation === CommandsHelper.HORIZONTAL_ORIENTATION;
    }

    public parseFromNumberToCharacter(value: number) {
        this.exceptionHelperService.throwNullArgumentException(value);
        this.exceptionHelperService.throwOutOfRangeException(
            LetterHelper.LETTER_A_KEY_CODE,
            LetterHelper.LETTER_Z_KEY_CODE,
            value);
        return String.fromCharCode(value);
    }
}
