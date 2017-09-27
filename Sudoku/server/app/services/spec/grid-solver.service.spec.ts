import { expect } from "chai";

import { GridSolver } from "../grid-solver.service";
import { Puzzle } from "../../models/puzzle/puzzle";

/*
Generate that sudoku.
8     |   9 1 | 2
      | 7     | 9 5
      |   3   |   7 8
------+-------+------
  2   |       |     7
3   6 |   4   | 5   2
5     |       |   6
------+-------+------
4 9   |   7   |
  8 3 |     2 |
    2 | 4 8   |     9
*/
function generateASpecificSudoku(puzzle: Puzzle) {
    puzzle.hideAllItemsInRange(Puzzle.MIN_ROW_INDEX, Puzzle.MAX_ROW_INDEX
        , Puzzle.MIN_COLUMN_INDEX, Puzzle.MAX_COLUMN_INDEX);
    puzzle.setPuzzleTileVisibility(0, 0, false);
    puzzle.setPuzzleTileValue(0, 0, 8);
    puzzle.setPuzzleTileVisibility(0, 4, false);
    puzzle.setPuzzleTileValue(0, 4, 9);
    puzzle.setPuzzleTileVisibility(0, 5, false);
    puzzle.setPuzzleTileValue(0, 5, 1);
    puzzle.setPuzzleTileVisibility(0, 6, false);
    puzzle.setPuzzleTileValue(0, 6, 2);

    puzzle.setPuzzleTileVisibility(1, 3, false);
    puzzle.setPuzzleTileValue(1, 3, 7);
    puzzle.setPuzzleTileVisibility(1, 6, false);
    puzzle.setPuzzleTileValue(1, 6, 9);
    puzzle.setPuzzleTileVisibility(1, 7, false);
    puzzle.setPuzzleTileValue(1, 7, 5);

    puzzle.setPuzzleTileVisibility(2, 4, false);
    puzzle.setPuzzleTileValue(2, 4, 3);
    puzzle.setPuzzleTileVisibility(2, 7, false);
    puzzle.setPuzzleTileValue(2, 7, 7);
    puzzle.setPuzzleTileVisibility(2, 8, false);
    puzzle.setPuzzleTileValue(2, 8, 8);

    puzzle.setPuzzleTileVisibility(3, 1, false);
    puzzle.setPuzzleTileValue(3, 1, 2);
    puzzle.setPuzzleTileVisibility(3, 8, false);
    puzzle.setPuzzleTileValue(3, 8, 7);

    puzzle.setPuzzleTileVisibility(4, 0, false);
    puzzle.setPuzzleTileValue(4, 0, 3);
    puzzle.setPuzzleTileVisibility(4, 2, false);
    puzzle.setPuzzleTileValue(4, 2, 6);
    puzzle.setPuzzleTileVisibility(4, 4, false);
    puzzle.setPuzzleTileValue(4, 4, 4);
    puzzle.setPuzzleTileVisibility(4, 6, false);
    puzzle.setPuzzleTileValue(4, 6, 5);

    puzzle.setPuzzleTileVisibility(4, 8, false);
    puzzle.setPuzzleTileValue(4, 8, 2);

    puzzle.setPuzzleTileVisibility(5, 0, false);
    puzzle.setPuzzleTileValue(5, 0, 5);
    puzzle.setPuzzleTileVisibility(5, 7, false);
    puzzle.setPuzzleTileValue(5, 7, 6);

    puzzle.setPuzzleTileVisibility(6, 0, false);
    puzzle.setPuzzleTileValue(6, 0, 4);
    puzzle.setPuzzleTileVisibility(6, 1, false);
    puzzle.setPuzzleTileValue(6, 1, 9);
    puzzle.setPuzzleTileVisibility(6, 4, false);
    puzzle.setPuzzleTileValue(6, 4, 7);

    puzzle.setPuzzleTileVisibility(7, 1, false);
    puzzle.setPuzzleTileValue(7, 1, 8);
    puzzle.setPuzzleTileVisibility(7, 2, false);
    puzzle.setPuzzleTileValue(7, 2, 3);
    puzzle.setPuzzleTileVisibility(7, 5, false);
    puzzle.setPuzzleTileValue(7, 5, 2);

    puzzle.setPuzzleTileVisibility(8, 2, false);
    puzzle.setPuzzleTileValue(8, 2, 2);
    puzzle.setPuzzleTileVisibility(8, 3, false);
    puzzle.setPuzzleTileValue(8, 3, 4);
    puzzle.setPuzzleTileVisibility(8, 4, false);
    puzzle.setPuzzleTileValue(8, 4, 8);
    puzzle.setPuzzleTileVisibility(8, 8, false);
    puzzle.setPuzzleTileValue(8, 8, 9);
}


describe("GridSolver should", () => {

    let gridSolver: GridSolver;
    let puzzleUsed: Puzzle;

    beforeEach(() => {
        puzzleUsed = new Puzzle();
        gridSolver = new GridSolver(puzzleUsed);
    });

    it("say that the number of solutions is one when only one tile is hidden.", () => {
        puzzleUsed.setPuzzleTileVisibility(2, 2, true);
        expect(gridSolver.getNumberOfSolutionsAfterRemovingNumber(2, 2)).to.be.equal(1);
    });

    it("say that the number of solutions is zero.", function () {
        puzzleUsed.hideAllItemsInRange(Puzzle.MIN_ROW_INDEX, Puzzle.MAX_ROW_INDEX
            , Puzzle.MIN_COLUMN_INDEX, Puzzle.MAX_COLUMN_INDEX);
        puzzleUsed.setPuzzleTileVisibility(3, 2, false);
        puzzleUsed.setPuzzleTileValue(3, 2, 3);
        puzzleUsed.setPuzzleTileVisibility(0, 0, false);
        puzzleUsed.setPuzzleTileValue(0, 0, 1);
        puzzleUsed.setPuzzleTileVisibility(0, 1, false);
        puzzleUsed.setPuzzleTileValue(0, 1, 2);
        puzzleUsed.setPuzzleTileVisibility(1, 0, false);
        puzzleUsed.setPuzzleTileValue(1, 0, 4);
        puzzleUsed.setPuzzleTileVisibility(1, 1, false);
        puzzleUsed.setPuzzleTileValue(1, 1, 5);
        puzzleUsed.setPuzzleTileVisibility(1, 2, false);
        puzzleUsed.setPuzzleTileValue(1, 2, 6);
        puzzleUsed.setPuzzleTileVisibility(2, 0, false);
        puzzleUsed.setPuzzleTileValue(2, 0, 7);
        puzzleUsed.setPuzzleTileVisibility(2, 1, false);
        puzzleUsed.setPuzzleTileValue(2, 1, 8);
        puzzleUsed.setPuzzleTileVisibility(2, 2, false);
        puzzleUsed.setPuzzleTileValue(2, 2, 9);
        expect(gridSolver.getNumberOfSolutionsAfterRemovingNumber(0, 8)).to.be.equal(0);
    });

    it("say there is only one solution even if there are tiles with multiple possibilities.", () => {
        generateASpecificSudoku(puzzleUsed);
        expect(gridSolver.getNumberOfSolutionsAfterRemovingNumber(0, 3)).to.be.equal(1);
    });

    it("say there are many solutions to the sudoku.", () => {
        puzzleUsed.hideAllItemsInRange(1, Puzzle.MAX_ROW_INDEX
            , 6, Puzzle.MAX_COLUMN_INDEX);
        puzzleUsed.setPuzzleTileVisibility(5, 6, false);
        puzzleUsed.setPuzzleTileVisibility(5, 8, false);
        puzzleUsed.setPuzzleTileVisibility(7, 6, false);
        puzzleUsed.setPuzzleTileVisibility(7, 8, false);
        expect(gridSolver.getNumberOfSolutionsAfterRemovingNumber(1, 6)).to.be.equal(2);
    });

    it("throw an exception because the row index is not valid.", () => {
        expect(gridSolver.getNumberOfSolutionsAfterRemovingNumber.bind(gridSolver, -1, 0)).to.throw(Error);
    });

    it("throw an exception because the column index is not valid.", () => {
        expect(gridSolver.getNumberOfSolutionsAfterRemovingNumber.bind(gridSolver, 0, -1)).to.throw(Error);
    });

    it("throw an exception because the number is not hidden.", () => {
        expect(gridSolver.getNumberOfSolutionsAfterRemovingNumber.bind(gridSolver, 0, 0)).to.throw(Error);
    });

    it("say there is one solution after removing a single number", () => {
        puzzleUsed.setPuzzleTileVisibility(3, 4, true);
        let numberOfSolutions = gridSolver.getNumberOfSolutionsAfterRemovingNumber(3, 4);
        expect(numberOfSolutions, "The number of solutions should be 1.").to.be.equal(1);
    });
});
