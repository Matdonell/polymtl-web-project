import { NumbersInHoles } from "./numbers-in-holes.service";
import { Puzzle } from "../models/puzzle/puzzle";

export class GridSolver {

    private _puzzleToSolve: Puzzle;
    private _numbersFittingInTheHoles: NumbersInHoles;

    constructor(puzzleToSolve: Puzzle) {
        this._puzzleToSolve = puzzleToSolve;
        this._numbersFittingInTheHoles = null;
    }

    public getNumberOfSolutionsAfterRemovingNumber(rowIndex: number, columnIndex: number): number {
        if (Puzzle.MIN_ROW_INDEX > rowIndex || Puzzle.MAX_ROW_INDEX < rowIndex) {
            throw new Error("The row index is not between " + (Puzzle.MIN_ROW_INDEX).toString()
                + " and " + (Puzzle.MAX_ROW_INDEX).toString() + " inclusively.");
        }
        if (Puzzle.MIN_COLUMN_INDEX > columnIndex || Puzzle.MAX_COLUMN_INDEX < columnIndex) {
            throw new Error("The row index is not between " + (Puzzle.MIN_COLUMN_INDEX).toString()
                + " and " + (Puzzle.MAX_COLUMN_INDEX).toString() + " inclusively.");
        }
        if (!this._puzzleToSolve.getPuzzleTileVisibility(rowIndex, columnIndex)) {
            throw new Error("The value at rowIndex and columnIndex is not hidden.");
        }

        this._numbersFittingInTheHoles = new NumbersInHoles(this._puzzleToSolve);
        let numberOfSolutions: number;
        if (this._numbersFittingInTheHoles.findPossibleValuesAtAPosition(rowIndex, columnIndex).length === 1) {
            numberOfSolutions = 1;
        }
        else {
            numberOfSolutions = this.startResolveSudoku();
        }
        return numberOfSolutions;
    }

    private startResolveSudoku(): number {

        //Initial analyse of the sudoku
        this._numbersFittingInTheHoles.computeNumbersFittingInHoles();

        //Save state
        let stateSaved = this._puzzleToSolve;
        this._puzzleToSolve = new Puzzle(this._puzzleToSolve);
        let mappingSaved = this._numbersFittingInTheHoles;
        this._numbersFittingInTheHoles = this._numbersFittingInTheHoles.copy(this._puzzleToSolve);

        //Resolve
        let numberOfSolutions = this.resolveSudoku(0);

        //Restore state
        this._puzzleToSolve = stateSaved;
        this._numbersFittingInTheHoles = mappingSaved;
        return numberOfSolutions;
    }

    //This recursive function says if there is 0, 1 or multiple solutions for the _puzzleToSolve.
    //It first fill all the tiles which have only one numbers that can go there.
    //Then, if the sudoku is not full, it takes the first tile that can fill multiple numbers and choose one.
    //Then, it calls himself again to resolve the other tiles.
    private resolveSudoku(numberOfAlreadyFoundedSolutions: number): number {

        this.fillAllTheHolesWithOnePossibility();

        if (this._numbersFittingInTheHoles.allHolesHaveSolutions()) {
            if (this._puzzleToSolve.getNumberOfHoles() === 0) {
                ++numberOfAlreadyFoundedSolutions;
            }
            else {
                let numberIndex = 0;
                let fittingNumber = this._numbersFittingInTheHoles.getHoleWithLessPossibility();
                while (numberIndex < fittingNumber.numbersThatFit.length
                    && numberOfAlreadyFoundedSolutions < 2) {
                    numberOfAlreadyFoundedSolutions = this.tryANumberInAHole(
                        fittingNumber.row
                        , fittingNumber.column
                        , fittingNumber.numbersThatFit[numberIndex]
                        , numberOfAlreadyFoundedSolutions);
                    ++numberIndex;
                }
            }
        }
        return numberOfAlreadyFoundedSolutions;
    }

    private fillAllTheHolesWithOnePossibility() {
        while (this._puzzleToSolve.getNumberOfHoles() !== 0 && this._numbersFittingInTheHoles.allHolesHaveSolutions()
            && this._numbersFittingInTheHoles.haveAHoleWithOnePossibility()) {
            let fittingNumber = this._numbersFittingInTheHoles.getHoleWithLessPossibility();
            this._puzzleToSolve.setPuzzleTileValue(
                fittingNumber.row, fittingNumber.column, fittingNumber.numbersThatFit[0]);
            this._puzzleToSolve.setPuzzleTileVisibility(
                fittingNumber.row, fittingNumber.column, false);
            this._numbersFittingInTheHoles.recomputeAfterNumberAdded(
                fittingNumber.row, fittingNumber.column, fittingNumber.numbersThatFit[0]);
        }
    }

    private tryANumberInAHole(row: number, column: number
        , numberToPut: number, numberOfSolutionsFound: number): number {
        //Save state
        let stateSaved = this._puzzleToSolve;
        this._puzzleToSolve = new Puzzle(this._puzzleToSolve);
        let mappingSaved = this._numbersFittingInTheHoles;
        this._numbersFittingInTheHoles = this._numbersFittingInTheHoles.copy(this._puzzleToSolve);

        //Try a number
        this._puzzleToSolve.setPuzzleTileValue(row, column, numberToPut);
        this._puzzleToSolve.setPuzzleTileVisibility(row, column, false);
        this._numbersFittingInTheHoles.recomputeAfterNumberAdded(row, column, numberToPut);
        numberOfSolutionsFound = this.resolveSudoku(numberOfSolutionsFound);

        //Restore state
        this._puzzleToSolve = stateSaved;
        this._numbersFittingInTheHoles = mappingSaved;

        return numberOfSolutionsFound;
    }
}
