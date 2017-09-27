import { IPuzzleItemData, PuzzleItem } from "../models/puzzle/puzzle-item";
import { Puzzle } from "../models/puzzle/puzzle";

export class GridValidationManager {

    private _puzzle: Array<Array<PuzzleItem>>;

    /**
     * Convert a double array of IPuzzleItemData to a double array of PuzzleItems.
     * The IPuzzleItemData are generated when the server receives a sudoku grid from the client.
     * @param object The puzzle items data to convert to Puzzle items.
     */
    public static convertObjectToAnArrayOfPuzzleItem(object: Array<Array<IPuzzleItemData>>): Array<Array<PuzzleItem>> {
        let puzzleItemsArray = new Array<Array<PuzzleItem>>();
        for (let row = Puzzle.MIN_ROW_INDEX; row <= Puzzle.MAX_ROW_INDEX; ++row) {
            if (object[row] === undefined || object[row] === null) {
                throw new TypeError("The puzzle is not a valid double array of 9 x 9.");
            }
            puzzleItemsArray.push(new Array<PuzzleItem>());
            for (let column = Puzzle.MIN_COLUMN_INDEX; column <= Puzzle.MAX_COLUMN_INDEX; ++column) {
                if (object[row][column] === undefined || object[row][column] === null) {
                    throw new TypeError("The puzzle is not a valid double array of 9 x 9.");
                }
                puzzleItemsArray[row].push(PuzzleItem.convertObjectToPuzzleItem(object[row][column]));
            }
        }
        return puzzleItemsArray;
    }

    constructor(puzzle: Array<Array<PuzzleItem>>) {
        if (puzzle === null || puzzle === undefined) {
            throw new Error("The puzzle cannot be null or undefined.");
        }
        this._puzzle = puzzle;
    }

    public validateGrid(): boolean {
        return this.validateRows() && this.validateColumns() && this.validateSquares();
    }

    public validateRows(): boolean {
        let rowsValid = true;
        let row = Puzzle.MIN_ROW_INDEX;
        while (rowsValid && row <= Puzzle.MAX_ROW_INDEX) {
            rowsValid = this.hasNoRepeatedNumbersInRange(row, row, Puzzle.MIN_COLUMN_INDEX, Puzzle.MAX_COLUMN_INDEX);
            ++row;
        }
        return rowsValid;
    }

    public validateColumns(): boolean {
        let columnsValid = true;
        let column = Puzzle.MIN_COLUMN_INDEX;
        while (columnsValid && column <= Puzzle.MAX_COLUMN_INDEX) {
            columnsValid = this.hasNoRepeatedNumbersInRange(Puzzle.MIN_ROW_INDEX, Puzzle.MAX_ROW_INDEX, column, column);
            ++column;
        }
        return columnsValid;
    }

    public validateSquares(): boolean {
        let squareValid = true;
        let row = Puzzle.MIN_ROW_INDEX;
        while (squareValid && row < Puzzle.SQUARE_LENGTH) {
            let column = Puzzle.MIN_COLUMN_INDEX;
            while (squareValid && column < Puzzle.SQUARE_LENGTH) {
                let rowPosition = row * Puzzle.SQUARE_LENGTH;
                let columnPosition = column * Puzzle.SQUARE_LENGTH;
                squareValid = this.hasNoRepeatedNumbersInRange(rowPosition, rowPosition + Puzzle.SQUARE_LENGTH - 1,
                    columnPosition, columnPosition + Puzzle.SQUARE_LENGTH - 1);
                ++column;
            }
            ++row;
        }
        return squareValid;
    }

    public hasNoRepeatedNumbersInRange(minRow: number, maxRow: number, minColumn: number, maxColumn: number): boolean {
        if (minRow < Puzzle.MIN_ROW_INDEX || maxRow > Puzzle.MAX_ROW_INDEX || minColumn < Puzzle.MIN_COLUMN_INDEX
            || maxColumn > Puzzle.MAX_COLUMN_INDEX || minRow > maxRow || minColumn > maxColumn) {
            throw new RangeError("One parameter is invalid. The min must be smaller or equals than the max"
                + " and they must be in the range of the sudoku index.");
        }

        let noRepetitions = true;
        let contained = new Array<number>();
        let row = minRow;
        while (noRepetitions && row <= maxRow) {
            let column = minColumn;
            while (noRepetitions && column <= maxColumn) {
                noRepetitions = this._puzzle[row][column].value !== null
                    && this._puzzle[row][column].value >= Puzzle.MIN_NUMBER
                    && this._puzzle[row][column].value <= Puzzle.MAX_NUMBER
                    && contained.indexOf(this._puzzle[row][column].value) === -1;
                if (noRepetitions) {
                    contained.push(this._puzzle[row][column].value);
                }
                ++column;
            }
            ++row;
        }
        return noRepetitions;
    }
}
