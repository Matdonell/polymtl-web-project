import { CommandsHelper } from "../commons/command/command-helper";
import { ExceptionHelper } from "../commons/exception-helper";
import { BoardHelper } from "./board-helper";

import { Player } from "../../models/player";
import { Board } from "../../models/board/board";
import { Letter } from "../../models/letter";
import { Alphabet } from "../../models/commons/alphabet";
import { IPlaceWordResponse } from "../commons/command/place-word-response.interface";
import { LetterBankHandler } from "../letterbank-handler";
import { VerticalWordValidator } from "./vertical-word-validator";
import { HorizontalWordValidator } from "./horizontal-word-validator";

import { IValidationRequest } from "./validation-request.interface";

export class BoardManager {
    private _letterBankHandler: LetterBankHandler;
    private _verticalWordValidator: VerticalWordValidator;
    private _horizontalWordValidator: HorizontalWordValidator;

    private _player: Player;
    private _board: Board;

    constructor() {
        this._letterBankHandler = new LetterBankHandler();
        this._verticalWordValidator = new VerticalWordValidator();
        this._horizontalWordValidator = new HorizontalWordValidator();
    }

    public get player(): Player {
        return this._player;
    }
    public set player(v: Player) {
        this._player = v;
    }

    public placeWordInBoard(
        response: IPlaceWordResponse,
        board: Board,
        player: Player): boolean {

        this._board = board;
        this._player = player;

        let firstRowIndex = BoardHelper.convertCharToIndex(response._squarePosition._row);
        let firstColumnIndex = response._squarePosition._column - 1;
        let letters = response._letters;
        let scrabbleLetters = this._letterBankHandler.parseFromListOfStringToListOfLetter(letters);

        ExceptionHelper.throwNullArgumentException(firstRowIndex);
        ExceptionHelper.throwNullArgumentException(firstColumnIndex);
        ExceptionHelper.throwNullArgumentException(scrabbleLetters);

        let isPlaced = false;
        if (response._wordOrientation === CommandsHelper.HORIZONTAL_ORIENTATION) {
            isPlaced = this.placeWordInHorizontalOrientation(
                firstRowIndex, firstColumnIndex, scrabbleLetters, letters);

        } else if (response._wordOrientation === CommandsHelper.VERTICAL_ORIENTATION) {
            isPlaced = this.placeWordInVerticalOrientation(
                firstRowIndex, firstColumnIndex, scrabbleLetters, letters);
        }

        if (isPlaced) {
            this._board.isEmpty = false;
        }

        return isPlaced;
    }

    private placeWordInHorizontalOrientation(
        firstRowIndex: number,
        columnIndex: number,
        scrabbleLetters: Array<Letter>,
        trueWord: Array<string>): boolean {

        let request: IValidationRequest = {
            _firstRowNumber: firstRowIndex,
            _columnIndex: columnIndex,
            _letters: scrabbleLetters,
            _player: this._player
        };

        if (!this._horizontalWordValidator.matchHorizontalPlacementRules(request, this._board)) {
            return false;
        }

        this._board.resetLastLettersAdded();
        for (let index = 0; index < scrabbleLetters.length; index++) {
            let nextColumnIndex = columnIndex + index;

            let letter = scrabbleLetters[index];
            // Get the row number from the given letter
            let currentSquare = this._board.squares[firstRowIndex][nextColumnIndex];

            if (!currentSquare.isBusy) {
                this._board.squares[firstRowIndex][nextColumnIndex].squareValue =
                    letter.alphabetLetter;
                this._board.squares[firstRowIndex][nextColumnIndex].letter
                    = new Letter(letter.alphabetLetter, letter.point, letter.quantity);
                if (letter.alphabetLetter === Alphabet.blank.letter) {
                    this._board.squares[firstRowIndex][nextColumnIndex].letter.alphabetLetter
                        = trueWord[index].toUpperCase();
                }
                this._board.squares[firstRowIndex][nextColumnIndex].isBusy = true;
                this._player.easel.removeLetter(letter.alphabetLetter);

                this._board.addLastLetterAdded(firstRowIndex, nextColumnIndex);
            }
        }
        return true;
    }

    private placeWordInVerticalOrientation(
        firstRowIndex: number,
        columnIndex: number,
        scrabbleLetters: Array<Letter>,
        trueWord: Array<string>): boolean {

        let request: IValidationRequest = {
            _firstRowNumber: firstRowIndex,
            _columnIndex: columnIndex,
            _letters: scrabbleLetters,
            _player: this._player
        };

        if (!this._verticalWordValidator.matchVerticalPlacementRules(request, this._board)) {
            return false;
        }

        this._board.resetLastLettersAdded();
        for (let index = 0; index < scrabbleLetters.length; index++) {
            let nextRowIndex = firstRowIndex + index;
            let nextSquare = this._board.squares[nextRowIndex][columnIndex];
            let letter = scrabbleLetters[index];

            if (!nextSquare.isBusy) {
                this._board.squares[nextRowIndex][columnIndex].squareValue =
                    letter.alphabetLetter;
                this._board.squares[nextRowIndex][columnIndex].letter
                    = new Letter(letter.alphabetLetter, letter.point, letter.quantity);
                if (letter.alphabetLetter === Alphabet.blank.letter) {
                    this._board.squares[nextRowIndex][columnIndex].letter.alphabetLetter
                        = trueWord[index].toUpperCase();
                }
                this._board.squares[nextRowIndex][columnIndex].isBusy = true;
                this._player.easel.removeLetter(letter.alphabetLetter);
                this._board.addLastLetterAdded(nextRowIndex, columnIndex);
            }
        }
        return true;
    }
}
