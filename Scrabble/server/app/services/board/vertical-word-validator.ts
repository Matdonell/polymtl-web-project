import { Player } from "../../models/player";
import { Easel } from "../../models/easel";
import { Board } from "../../models/board/board";
import { BoardHelper } from "./board-helper";
import { IValidationRequest } from "./validation-request.interface";

export class VerticalWordValidator {
    static readonly CENTER_ROW = 7;
    static readonly CENTER_COLUMN = 7;

    private _player: Player;
    private _board: Board;

    constructor() {
        // Constructor
    }

    public matchVerticalPlacementRules(request: IValidationRequest, board: Board): boolean {
        this._board = board;
        this._player = request._player;
        let easel = new Easel(this._player.easel.letters);
        let isWordFit = true;
        let firstRowIndex = request._firstRowNumber;
        let columnIndex = request._columnIndex;

        if (this._board.isEmpty
            && !this.isFirstVerticalWordCrossedMiddle(firstRowIndex, columnIndex, request._letters.length)) {
            isWordFit = false;
        }

        // Check if we have touched at least one existing letter in the board
        let hasTouchedLetterInTheBoard = false;


        for (let index = 0; index < request._letters.length && isWordFit; index++) {
            let rowIndex = firstRowIndex + index;

            if (!BoardHelper.isValidRowPosition(rowIndex)) {
                isWordFit = false;
                break;
            }

            // get the next square object
            let nextSquare = this._board.squares[rowIndex][columnIndex];


            let letterToBePlaced = request._letters[index];

            // Check if the square already contains a letter or not
            if (!nextSquare.isBusy) {

                // If the letter to be placed is not in the player easel
                // we have an invalid word
                if (!easel.containsLetter(letterToBePlaced)) {
                    isWordFit = false;
                }
                else {

                    easel.removeLetter(letterToBePlaced.alphabetLetter);
                }
            }
            // If we find an existing letter in the square that does not match the current one
            else {
                if (nextSquare.letter.alphabetLetter !== letterToBePlaced.alphabetLetter) {
                    isWordFit = false;
                }
                else {
                    hasTouchedLetterInTheBoard = true;
                }
            }
        }

        if (isWordFit && !hasTouchedLetterInTheBoard && !this._board.isEmpty) {
            hasTouchedLetterInTheBoard = this.hasTouchedLetterOnBoard(
                firstRowIndex, columnIndex, request._letters.length);
        }

        return (isWordFit && (this._board.isEmpty || hasTouchedLetterInTheBoard));
    }

    private isFirstVerticalWordCrossedMiddle(firstRow: number, column: number, wordLength: number): boolean {
        if (column === VerticalWordValidator.CENTER_COLUMN
            && (firstRow === VerticalWordValidator.CENTER_ROW
                || (firstRow < VerticalWordValidator.CENTER_ROW
                    && firstRow + wordLength - 1 >= VerticalWordValidator.CENTER_ROW))) {
            return true;
        }
        else {
            return false;
        }
    }

    private hasTouchedLetterOnBoard(firstRowIndex: number, columnIndex: number, wordLength: number): boolean {
        let leftSquareIndex = columnIndex - 1;
        let rightSquareIndex = columnIndex + 1;
        let hasTouchedFirstSquareAbove = (BoardHelper.isValidRowPosition(firstRowIndex - 1)) ?
            this._board.squares[firstRowIndex - 1][columnIndex].isBusy : false;
        if (hasTouchedFirstSquareAbove) {
            return true;
        }

        for (let index = 0; index < wordLength; index++) {
            // Calculate and find the next values for the placement
            let rowIndex = firstRowIndex + index;

            let touchedLeftSquare = (BoardHelper.isValidColumnPosition(leftSquareIndex)) ?
                this._board.squares[rowIndex][leftSquareIndex].isBusy : false;
            let touchedRightSquare = (BoardHelper.isValidColumnPosition(rightSquareIndex)) ?
                this._board.squares[rowIndex][rightSquareIndex].isBusy : false;
            let touchedNextSquareBelow = (BoardHelper.isValidColumnPosition(rowIndex + 1)) ?
                this._board.squares[rowIndex + 1][columnIndex].isBusy : false;
            if (touchedLeftSquare || touchedRightSquare || touchedNextSquareBelow) {
                return true;
            }
        }

        return false;
    }
}
