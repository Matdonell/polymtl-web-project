import { Injectable } from "@angular/core";

import { Puzzle, PuzzleItem } from "../models/puzzle";

const SUDOKU_LENGTH = 9;
@Injectable()
export class GridManagerService {
    private _cellsToBeCompleted = 0;

    constructor() {
        //Default constructor
    }

    get cellsToBeCompleted(): number {
        return this._cellsToBeCompleted;
    }

    //  Check if the value is valid
    public validateEnteredNumber(puzzle: Puzzle, rowIndex: number, columnIndex: number): boolean {

        let grid = puzzle._puzzle;

        let isColumnValid = !this.isDuplicatedNumberInCurrentColumn(grid, rowIndex, columnIndex);
        let isRowValid = !this.isDuplicatedNumberInCurrentRow(grid, rowIndex, columnIndex);
        let isSquareValid = !this.isDuplicatedNumberInCurrentSquare(grid, rowIndex, columnIndex);

        if (isColumnValid && isRowValid && isSquareValid) {
            puzzle._puzzle[rowIndex][columnIndex]._isRed = false;
        } else {
            if ((!isSquareValid || !isColumnValid || !isRowValid)
                && grid[rowIndex][columnIndex]._value !== null) {
                puzzle._puzzle[rowIndex][columnIndex]._isRed = true;
            }
        }
        return (isColumnValid && isRowValid && isSquareValid);
    }

    public isDuplicatedNumberInCurrentRow(grid: PuzzleItem[][], rowIndex: number, columnIndex: number): boolean {

        let puzzleItem = Number(grid[rowIndex][columnIndex]._value);

        for (let columnId = 0; columnId < grid[rowIndex].length; ++columnId) {
            if (columnId !== columnIndex && puzzleItem === Number(grid[rowIndex][columnId]._value)) {
                return true;
            }
        }
        return false;
    }

    public isDuplicatedNumberInCurrentColumn(grid: PuzzleItem[][], rowIndex: number, columnIndex: number): boolean {

        let puzzleItem = Number(grid[rowIndex][columnIndex]._value);

        for (let rowId = 0; rowId < grid[rowIndex].length; ++rowId) {
            if (rowId !== rowIndex && puzzleItem === Number(grid[rowId][columnIndex]._value)) {
                return true;
            }
        }
        return false;
    }

    // Check if the square around the value is valid.
    public isDuplicatedNumberInCurrentSquare(grid: PuzzleItem[][], rowIndex: number, columnIndex: number): boolean {
        let squareMinRowIndex = Math.floor(rowIndex / 3) * 3;
        let squareMaxRowIndex = squareMinRowIndex + 2;
        let squareMinColumnIndex = Math.floor(columnIndex / 3) * 3;
        let squareMaxColumnIndex = squareMinColumnIndex + 2;

        let puzzleItem = Number(grid[rowIndex][columnIndex]._value);

        for (let rowId = squareMinRowIndex; rowId <= squareMaxRowIndex; ++rowId) {
            for (let columnId = squareMinColumnIndex; columnId <= squareMaxColumnIndex; ++columnId) {
                if (columnId !== columnIndex && rowId !== rowIndex
                    && puzzleItem === Number(grid[rowId][columnId]._value)) {
                    return true;
                }
            }
        }
        return false;
    }

    // Clears the cells the user filled.
    // Initialize the grid format to prevent when an invalid grid format is applied.
    public initializeGrid(puzzle: Puzzle) {

        if (puzzle === null
            || puzzle._puzzle === null) {
                throw new Error("The initial grid cannot be null");
        }
        this._cellsToBeCompleted = 0;

        for (let row = 0; row < puzzle._puzzle.length; ++row) {
            for (let column = 0; column < puzzle._puzzle.length; ++column) {
                if (puzzle._puzzle[row][column]._hide) {
                    puzzle._puzzle[row][column]._value = null;
                    puzzle._puzzle[row][column]._isRed = false;
                    this._cellsToBeCompleted++;
                }
            }
        }
    }

    // Delete the current value and update the cell format.
    public deleteCurrentValue(puzzle: Puzzle, rowIndex: number, colIndex: number) {

        if (rowIndex < 0 || colIndex < 0) {
            throw new Error("A row or a column index cannot be less than (0)");
        }
        else if (rowIndex >= SUDOKU_LENGTH || colIndex >= SUDOKU_LENGTH) {
            throw new Error("A row or a column index cannot be greater than (8)");
        }

        puzzle._puzzle[rowIndex][colIndex]._isRed = false;
        puzzle._puzzle[rowIndex][colIndex]._value = null;
        this._cellsToBeCompleted++;
    }

    public countFilledCell(puzzle: Puzzle) {
        this._cellsToBeCompleted = 0;
        puzzle._puzzle.forEach((puzzleItems) => {
            puzzleItems.forEach((puzzleItem) => {
                if (puzzleItem._hide) {
                    this._cellsToBeCompleted++;
                }
            });
        });
    }

    public updateGridAfterInsertOrDelete(puzzle: Puzzle, rowIndexModif: number, colIndexModif: number): void {
        this.updateRowAfterInsertOrDelete(puzzle, rowIndexModif);
        this.updateColumnAfterInsertOrDelete(puzzle, colIndexModif);
        this.updateSquareAfterInsertOrDelete(puzzle, rowIndexModif, colIndexModif);
    }


    public updateRowAfterInsertOrDelete(puzzle: Puzzle, rowIndexModif: number): void {
        for (let columnIndex = 0; columnIndex < puzzle._puzzle.length; ++columnIndex) {
            if (puzzle._puzzle[rowIndexModif][columnIndex]._hide === true) {
                this.validateEnteredNumber(puzzle, rowIndexModif, columnIndex);
            }
        }
    }

    public updateColumnAfterInsertOrDelete(puzzle: Puzzle, colIndexModif: number): void {
        for (let rowIndex = 0; rowIndex < puzzle._puzzle.length; ++rowIndex) {
            if (puzzle._puzzle[rowIndex][colIndexModif]._hide === true) {
                this.validateEnteredNumber(puzzle, rowIndex, colIndexModif);
            }
        }
    }

    public updateSquareAfterInsertOrDelete(puzzle: Puzzle, rowIndexModif: number, colIndexModif: number): void {
        let squareMinRowIndex = Math.floor(rowIndexModif / 3) * 3;
        let squareMaxRowIndex = squareMinRowIndex + 2;
        let squareMinColumnIndex = Math.floor(colIndexModif / 3) * 3;
        let squareMaxColumnIndex = squareMinColumnIndex + 2;

        for (let rowId = squareMinRowIndex; rowId <= squareMaxRowIndex; ++rowId) {
            for (let columnId = squareMinColumnIndex; columnId <= squareMaxColumnIndex; ++columnId) {
                if (puzzle._puzzle[rowIndexModif][colIndexModif]._hide === true
                    && columnId !== colIndexModif && rowId !== rowIndexModif) {
                    this.validateEnteredNumber(puzzle, rowId, columnId);
                }
            }
        }
    }

    public decrementCellsToBeCompleted() {
        --this._cellsToBeCompleted;
    }
}
