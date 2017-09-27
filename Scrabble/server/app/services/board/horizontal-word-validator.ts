import { Easel } from "../../models/easel";
import { Player } from "../../models/player";
import { Board } from "../../models/board/board";
import { BoardHelper } from "./board-helper";
import { IValidationRequest } from "./validation-request.interface";

export class HorizontalWordValidator {
    static readonly CENTER_ROW = 7;
    static readonly CENTER_COLUMN = 7;

    private _player: Player;
    private _board: Board;

    constructor() {
        // Constructor
    }

    public matchHorizontalPlacementRules(request: IValidationRequest, board: Board): boolean {
        this._board = board;
        this._player = request._player;

        let easel = new Easel(this._player.easel.letters);
        let isWordFit = true;
        let rowIndex = request._firstRowNumber;
        let columnIndex = request._columnIndex;
        let wordLength = request._letters.length;

        if (this._board.isEmpty
            && !this.isFirstHorizontalWordCrossedMiddle(rowIndex, columnIndex, wordLength)) {
            isWordFit = false;
        }

        // Check if we have touched at least one existing letter in the board
        let hasTouchedLetterInTheBoard = false;

        for (let index = 0; isWordFit && index < wordLength; index++) {

            // Calculate and find the next values for the placement
            let nextColumnIndex = columnIndex + index;

            let letterToBePlaced = request._letters[index];


            if (!BoardHelper.isValidColumnPosition(nextColumnIndex)) {
                isWordFit = false;
                break;
            }

            // get the next square object
            let nextSquare = this._board.squares[rowIndex][nextColumnIndex];

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
                if (nextSquare.letter.alphabetLetter === letterToBePlaced.alphabetLetter) {
                    hasTouchedLetterInTheBoard = true;
                }
                else {
                    isWordFit = false;
                }
            }
        }

        if (isWordFit && !hasTouchedLetterInTheBoard && !this._board.isEmpty) {
            hasTouchedLetterInTheBoard = this.hasTouchedLetterOnBoard(
                rowIndex, columnIndex, request._letters.length);
        }
        return (isWordFit && (this._board.isEmpty || hasTouchedLetterInTheBoard));
    }

    private hasTouchedLetterOnBoard(rowIndex: number, firstColumnIndex: number, wordLength: number): boolean {
        let aboveSquareRowIndex = rowIndex - 1;
        let belowSquareRowIndex = rowIndex + 1;
        let hasTouchedFirstSquareOnLeft = (BoardHelper.isValidColumnPosition(firstColumnIndex - 1)) ?
            this._board.squares[rowIndex][firstColumnIndex - 1].isBusy : false;
        if (hasTouchedFirstSquareOnLeft) {
            return true;
        }

        for (let index = 0; index < wordLength; index++) {
            // Calculate and find the next values for the placement
            let columnIndex = firstColumnIndex + index;

            let touchedAboveSquare = (BoardHelper.isValidRowPosition(aboveSquareRowIndex)) ?
                this._board.squares[aboveSquareRowIndex][columnIndex].isBusy : false;

            let touchedBelowSquare = (BoardHelper.isValidRowPosition(belowSquareRowIndex)) ?
                this._board.squares[belowSquareRowIndex][columnIndex].isBusy : false;

            let touchedNextSquareOnRight = (BoardHelper.isValidColumnPosition(columnIndex + 1)) ?
                this._board.squares[rowIndex][columnIndex + 1].isBusy : false;

            if (touchedAboveSquare || touchedBelowSquare || touchedNextSquareOnRight) {
                return true;
            }
        }

        return false;
    }

    private isFirstHorizontalWordCrossedMiddle(row: number, firstColumn: number, wordLength: number): boolean {
        if (row === HorizontalWordValidator.CENTER_ROW
            && (firstColumn === HorizontalWordValidator.CENTER_COLUMN
                || (firstColumn < HorizontalWordValidator.CENTER_COLUMN
                    && firstColumn + wordLength - 1 >= HorizontalWordValidator.CENTER_COLUMN))) {
            return true;
        }
        else {
            return false;
        }
    }
}
