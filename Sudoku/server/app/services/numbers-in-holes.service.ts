import { Puzzle } from "../models/puzzle/puzzle";

export interface FittingNumbers {
    row: number;
    column: number;
    numbersThatFit: Array<number>;
}

export class NumbersInHoles {

    private _puzzleToAnalyze: Puzzle;
    private _numbersForHoles: Array<Array<Array<number>>>;
    private _haveASolution: boolean;
    private _nextHole: { row: number, column: number };

    constructor(puzzle: Puzzle) {
        if (puzzle === null) {
            throw new Error("Invalid puzzle passed in parameters.");
        }
        this._puzzleToAnalyze = puzzle;
        this._haveASolution = true;
        this._nextHole = null;
        this.initializeArrays();
    }

    private initializeArrays() {
        this._numbersForHoles = new Array<Array<Array<number>>>();
        for (let row = 0; row <= Puzzle.MAX_ROW_INDEX; ++row) {
            this._numbersForHoles.push(new Array<Array<number>>());
            for (let column = 0; column <= Puzzle.MAX_COLUMN_INDEX; ++column) {
                this._numbersForHoles[row].push(null);
            }
        }
    }

    //Perform a copy of the NumbersInHoles, but change the puzzle to the newPuzzle in parameter.
    public copy(newPuzzle: Puzzle): NumbersInHoles {
        let copy = new NumbersInHoles(newPuzzle);
        this._numbersForHoles.forEach((row: number[][], rowIndex: number, allNumbers: number[][][]) => {
            row.forEach((column: number[], columnIndex: number, columnArray: number[][]) => {
                if (column != null) {
                    copy._numbersForHoles[rowIndex][columnIndex] = new Array<number>();
                    column.forEach((value: number, index: number, array: number[]) => {
                        copy._numbersForHoles[rowIndex][columnIndex].push(value);
                    });
                }
            });
        });
        copy._puzzleToAnalyze = newPuzzle;
        copy._haveASolution = this._haveASolution;
        copy._nextHole = this._nextHole !== null ? { row: this._nextHole.row, column: this._nextHole.column } : null;
        return copy;
    }

    public getHoleWithLessPossibility(): FittingNumbers {
        if (this._nextHole === null) {
            throw new Error("The numbers fitting in holes have not been calculated.");
        }
        return {
            row: this._nextHole.row
            , column: this._nextHole.column
            , numbersThatFit: this._numbersForHoles[this._nextHole.row][this._nextHole.column]
        };
    }

    public allHolesHaveSolutions() {
        return this._haveASolution;
    }

    public haveAHoleWithOnePossibility(): boolean {
        if (!this._haveASolution) {
            throw new Error("Cannot know if the hole have one possibility because the sudoku has no solutions.");
        }
        return this._numbersForHoles[this._nextHole.row][this._nextHole.column].length === 1;
    }

    //Compute a mapping of all possibilities at hidden tiles. If a tile with zero possibilities is meet,
    //the computation of the mapping stop. It is useless to continue the mapping of the sudoku if it is not valid.
    //When the sudoku is not valid, the last element of the returned mapping will have an empty array for
    //the numbers that fit at that location.
    public computeNumbersFittingInHoles() {
        this._nextHole = null;
        let row = 0;
        while (this._haveASolution && row <= Puzzle.MAX_ROW_INDEX) {
            let column = 0;
            while (this._haveASolution && column <= Puzzle.MAX_COLUMN_INDEX) {
                if (this._puzzleToAnalyze.getPuzzleTileVisibility(row, column)) {
                    let possibleValues = this.findPossibleValuesAtAPosition(row, column);
                    this._numbersForHoles[row][column] = possibleValues;
                    this._haveASolution = possibleValues.length !== 0;
                    this.updateHoleWithLessPossibilities(row, column, possibleValues);
                }
                ++column;
            }
            ++row;
        }
    }

    public findPossibleValuesAtAPosition(rowIndex: number, columnIndex: number): Array<number> {
        if (!this._puzzleToAnalyze.getPuzzleTileVisibility(rowIndex, columnIndex)) {
            throw new Error("The number at the rowIndex = " + rowIndex + " and columnIndex = " + columnIndex);
        }
        let rowPresentValues = this.getPresentValuesInARange(rowIndex, rowIndex
            , Puzzle.MIN_COLUMN_INDEX, Puzzle.MAX_COLUMN_INDEX);
        let columnPresentValues = this.getPresentValuesInARange(Puzzle.MIN_ROW_INDEX, Puzzle.MAX_ROW_INDEX
            , columnIndex, columnIndex);
        let rowSquareBegin = this.calculateBeginSquareIndex(rowIndex);
        let columnSquareBegin = this.calculateBeginSquareIndex(columnIndex);
        let squarePresentValues = this.getPresentValuesInARange(rowSquareBegin
            , rowSquareBegin + Puzzle.SQUARE_LENGTH - 1
            , columnSquareBegin, columnSquareBegin + Puzzle.SQUARE_LENGTH - 1);

        let numbersNotPresent = this.getNumbersNotInArray(Puzzle.ALL_NUMBERS, rowPresentValues);
        numbersNotPresent = this.getNumbersNotInArray(numbersNotPresent, columnPresentValues);
        numbersNotPresent = this.getNumbersNotInArray(numbersNotPresent, squarePresentValues);
        return numbersNotPresent;
    }

    private calculateBeginSquareIndex(index: number): number {
        return index - index % Puzzle.SQUARE_LENGTH;
    }

    private getPresentValuesInARange(minRow: number, maxRow: number, minColumn: number, maxColumn: number) {
        let presentValues = new Array<number>();
        for (let row = minRow; row <= maxRow; ++row) {
            for (let column = minColumn; column <= maxColumn; ++column) {
                if (!this._puzzleToAnalyze.getPuzzleTileVisibility(row, column)) {
                    presentValues.push(this._puzzleToAnalyze.getPuzzleTileValue(row, column));
                }
            }
        }
        return presentValues;
    }

    private getNumbersNotInArray(arrayToFilter: Array<number>, referenceArray: Array<Number>): Array<number> {
        return arrayToFilter.filter((value: number, index: number, array: number[]) => {
            return referenceArray.indexOf(value) === -1;
        });
    }

    //Stop to recompute if a hole have no numbers to be put.
    public recomputeAfterNumberAdded(row: number, column: number, value: number) {
        this._nextHole = null;
        this._numbersForHoles[row][column] = null;
        this.recomputeNumbersInRange(Puzzle.MIN_ROW_INDEX, Puzzle.MAX_ROW_INDEX, column, column, value);
        if (this._haveASolution) {
            this.recomputeNumbersInRange(row, row, Puzzle.MIN_COLUMN_INDEX, Puzzle.MAX_COLUMN_INDEX, value);
            if (this._haveASolution) {
                let rowSquareBegin = this.calculateBeginSquareIndex(row);
                let columnSquareBegin = this.calculateBeginSquareIndex(column);
                this.recomputeNumbersInRange(rowSquareBegin, rowSquareBegin + Puzzle.SQUARE_LENGTH - 1
                    , columnSquareBegin, columnSquareBegin + Puzzle.SQUARE_LENGTH - 1, value);
                if (this._haveASolution) {
                    for (let rowIndex = Puzzle.MIN_ROW_INDEX; rowIndex <= Puzzle.MAX_ROW_INDEX; ++rowIndex) {
                        for (let columnIndex = Puzzle.MIN_COLUMN_INDEX; columnIndex <= Puzzle.MAX_COLUMN_INDEX;
                            ++columnIndex) {
                            if (this._numbersForHoles[rowIndex][columnIndex] !== null) {
                                this.updateHoleWithLessPossibilities(rowIndex, columnIndex
                                    , this._numbersForHoles[rowIndex][columnIndex]);
                            }
                        }
                    }
                }
            }
        }
    }

    private recomputeNumbersInRange(minRow: number, maxRow: number, minColumn: number, maxColumn: number
        , numberToRemove: number) {
        let row = minRow;
        while (this._haveASolution && row <= maxRow) {
            let column = minColumn;
            while (this._haveASolution && column <= maxColumn) {
                if (this._numbersForHoles[row][column] !== null) {
                    this._numbersForHoles[row][column] =
                        this._numbersForHoles[row][column].filter(
                            (possibleNumber: number, index: number, array: number[]) => {
                                return possibleNumber !== numberToRemove;
                            });
                    this._haveASolution = this._numbersForHoles[row][column].length !== 0;
                }
                ++column;
            }
            ++row;
        }
    }

    private updateHoleWithLessPossibilities(row: number, column: number, possibleValues: Array<number>) {
        if (this._nextHole === null) {
            this._nextHole = { row: row, column: column };
        }
        else if (possibleValues.length < this._numbersForHoles[this._nextHole.row][this._nextHole.column].length) {
            this._nextHole.row = row;
            this._nextHole.column = column;
        }
    }
}
