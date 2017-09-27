import { fakeAsync, inject, TestBed } from "@angular/core/testing";

import { expect, assert } from "chai";

import { GridManagerService } from "../../services/grid-manager.service";
import { Puzzle, PuzzleItem } from "../../models/puzzle";

describe("GridManagerService", () => {

    beforeEach(async () => {
        TestBed.configureTestingModule({
            providers: [
                GridManagerService
            ]
        });
    });

    it("isDuplicatedNumberInCurrentRow, Should return false with a duplicated number error in the current row",
        inject([ GridManagerService ],
            fakeAsync((gridManagerService: GridManagerService) => {

                // Create a ready puzzle for the grid.
                let fakePuzzle = new Puzzle([
                    [new PuzzleItem(2, true), new PuzzleItem(2, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(4, false), new PuzzleItem(6, false), new PuzzleItem(3, false)],
                    [new PuzzleItem(8, false), new PuzzleItem(null, true), new PuzzleItem(null, true)],
                ]);

                let newDuplicatedRowId = 0;
                let newDuplicatedColumnId = 0;

                assert(gridManagerService.isDuplicatedNumberInCurrentRow(
                    fakePuzzle._puzzle, newDuplicatedRowId, newDuplicatedColumnId) === true,
                    " A duplicated number is not allowed in a row");

            }))
    );

    it("isDuplicatedNumberInCurrentRow, Should return false for a valid row",
        inject([ GridManagerService ],
            fakeAsync((gridManagerService: GridManagerService) => {

                // Create a ready puzzle for the grid.
                let fakePuzzle = new Puzzle([
                    [new PuzzleItem(5, true), new PuzzleItem(2, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(4, false), new PuzzleItem(6, false), new PuzzleItem(3, false)],
                    [new PuzzleItem(8, false), new PuzzleItem(null, true), new PuzzleItem(null, true)],
                ]);

                let newDuplicatedRowId = 0;
                let newDuplicatedColumnId = 0;

                assert(gridManagerService.isDuplicatedNumberInCurrentRow(
                    fakePuzzle._puzzle, newDuplicatedRowId, newDuplicatedColumnId) === false,
                    "The current row must be valid");
            }))
    );

    it("isDuplicatedNumberInCurrentColumn, Should return true with a duplicated number error in the current column",
        inject([ GridManagerService ],
            fakeAsync((gridManagerService: GridManagerService) => {

                /* []
                */
                // Create a ready puzzle for the grid.
                let fakePuzzle = new Puzzle([
                    [new PuzzleItem(6, true), new PuzzleItem(2, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(4, false), new PuzzleItem(6, false), new PuzzleItem(3, false)],
                    [new PuzzleItem(6, false), new PuzzleItem(null, true), new PuzzleItem(null, true)],
                ]);

                let newDuplicatedRowId = 0;
                let newDuplicatedColumnId = 0;

                assert(gridManagerService.isDuplicatedNumberInCurrentColumn(
                    fakePuzzle._puzzle, newDuplicatedRowId, newDuplicatedColumnId) === true,
                    " A duplicated number is not allowed in a column");

            }))
    );

    it("isDuplicatedNumberInCurrentColumn, Should return false for a valid column",
        inject([ GridManagerService ],
            fakeAsync((gridManagerService: GridManagerService) => {

                /* []
                */
                // Create a ready puzzle for the grid.
                let fakePuzzle = new Puzzle([
                    [new PuzzleItem(6, true), new PuzzleItem(2, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(4, false), new PuzzleItem(6, false), new PuzzleItem(3, false)],
                    [new PuzzleItem(8, false), new PuzzleItem(null, true), new PuzzleItem(null, true)],
                ]);

                let newDuplicatedRowId = 0;
                let newDuplicatedColumnId = 0;

                assert(gridManagerService.isDuplicatedNumberInCurrentColumn(
                    fakePuzzle._puzzle, newDuplicatedRowId, newDuplicatedColumnId) === false,
                    " The current column must be valid");

            }))
    );

    it("isDuplicatedNumberInCurrentSquare, Should return true with a duplicated number error in the first square",
        inject([ GridManagerService ],
            fakeAsync((gridManagerService: GridManagerService) => {

                /*  [][]
                    [][]
                */
                // Create a ready puzzle for the grid.
                let fakePuzzle = new Puzzle([
                    [new PuzzleItem(1, true), new PuzzleItem(2, false), new PuzzleItem(null, true),
                    new PuzzleItem(6, true), new PuzzleItem(3, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(4, false), new PuzzleItem(6, false), new PuzzleItem(3, false),
                    new PuzzleItem(5, true), new PuzzleItem(1, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(5, false), new PuzzleItem(null, true), new PuzzleItem(1, true),
                    new PuzzleItem(9, true), new PuzzleItem(4, false), new PuzzleItem(null, true)],

                    [new PuzzleItem(8, true), new PuzzleItem(5, false), new PuzzleItem(null, true),
                    new PuzzleItem(4, true), new PuzzleItem(2, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(2, false), new PuzzleItem(1, false), new PuzzleItem(4, false),
                    new PuzzleItem(3, true), new PuzzleItem(7, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(7, false), new PuzzleItem(null, true), new PuzzleItem(null, true),
                    new PuzzleItem(8, true), new PuzzleItem(5, false), new PuzzleItem(null, true)],
                ]);

                let newDuplicatedRowId = 0;
                let newDuplicatedColumnId = 0;

                assert(gridManagerService.isDuplicatedNumberInCurrentSquare(
                    fakePuzzle._puzzle, newDuplicatedRowId, newDuplicatedColumnId) === true,
                    " A duplicated number is not allowed in a square");

            }))
    );

    it("isDuplicatedNumberInCurrentSquare, Should return false for a valid square",
        inject([ GridManagerService ],
            fakeAsync((gridManagerService: GridManagerService) => {

                /*  [][]
                    [][]
                */
                // Create a ready puzzle for the grid.
                let fakePuzzle = new Puzzle([
                    [new PuzzleItem(1, true), new PuzzleItem(2, false), new PuzzleItem(null, true),
                    new PuzzleItem(6, true), new PuzzleItem(3, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(4, false), new PuzzleItem(6, false), new PuzzleItem(3, false),
                    new PuzzleItem(5, true), new PuzzleItem(1, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(5, false), new PuzzleItem(null, true), new PuzzleItem(8, true),
                    new PuzzleItem(9, true), new PuzzleItem(4, false), new PuzzleItem(null, true)],

                    [new PuzzleItem(8, true), new PuzzleItem(5, false), new PuzzleItem(null, true),
                    new PuzzleItem(4, true), new PuzzleItem(2, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(2, false), new PuzzleItem(1, false), new PuzzleItem(4, false),
                    new PuzzleItem(3, true), new PuzzleItem(7, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(7, false), new PuzzleItem(null, true), new PuzzleItem(null, true),
                    new PuzzleItem(8, true), new PuzzleItem(5, false), new PuzzleItem(null, true)],
                ]);

                let newDuplicatedRowId = 0;
                let newDuplicatedColumnId = 0;

                assert(gridManagerService.isDuplicatedNumberInCurrentSquare(
                    fakePuzzle._puzzle, newDuplicatedRowId, newDuplicatedColumnId) === false,
                    " The current square must be valid");

            }))
    );

    it("validateEnteredNumber, Should return false with a duplicated number error in the first row/column and square",
        inject([ GridManagerService ],
            fakeAsync((gridManagerService: GridManagerService) => {

                // Create a ready puzzle for the grid.
                let fakePuzzle = new Puzzle([
                    [new PuzzleItem(1, true), new PuzzleItem(2, false), new PuzzleItem(null, true),
                    new PuzzleItem(6, true), new PuzzleItem(3, false), new PuzzleItem(1, true)],
                    [new PuzzleItem(4, false), new PuzzleItem(6, false), new PuzzleItem(3, false),
                    new PuzzleItem(5, true), new PuzzleItem(1, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(5, false), new PuzzleItem(null, true), new PuzzleItem(1, true),
                    new PuzzleItem(9, true), new PuzzleItem(4, false), new PuzzleItem(null, true)],

                    [new PuzzleItem(1, true), new PuzzleItem(5, false), new PuzzleItem(null, true),
                    new PuzzleItem(4, true), new PuzzleItem(2, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(2, false), new PuzzleItem(1, false), new PuzzleItem(4, false),
                    new PuzzleItem(3, true), new PuzzleItem(7, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(7, false), new PuzzleItem(null, true), new PuzzleItem(null, true),
                    new PuzzleItem(8, true), new PuzzleItem(5, false), new PuzzleItem(null, true)],
                ]);

                let newDuplicatedRowId = 0;
                let newDuplicatedColumnId = 0;

                assert(gridManagerService.validateEnteredNumber(
                    fakePuzzle, newDuplicatedRowId, newDuplicatedColumnId) === false,
                    " A duplicated number is not allowed in the same row/column/square");

            }))
    );

    it("validateEnteredNumber, Should return false with a duplicated number in the first row",
        inject([ GridManagerService ],
            fakeAsync((gridManagerService: GridManagerService) => {

                // Create a ready puzzle for the grid.
                let fakePuzzle = new Puzzle([
                    [new PuzzleItem(1, true), new PuzzleItem(2, false), new PuzzleItem(1, false),
                    new PuzzleItem(6, true), new PuzzleItem(3, false), new PuzzleItem(8, true)],
                    [new PuzzleItem(4, false), new PuzzleItem(6, false), new PuzzleItem(3, false),
                    new PuzzleItem(5, true), new PuzzleItem(1, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(5, false), new PuzzleItem(null, true), new PuzzleItem(7, true),
                    new PuzzleItem(9, true), new PuzzleItem(4, false), new PuzzleItem(null, true)],

                    [new PuzzleItem(3, true), new PuzzleItem(5, false), new PuzzleItem(null, true),
                    new PuzzleItem(4, true), new PuzzleItem(2, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(2, false), new PuzzleItem(1, false), new PuzzleItem(4, false),
                    new PuzzleItem(3, true), new PuzzleItem(7, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(7, false), new PuzzleItem(null, true), new PuzzleItem(null, true),
                    new PuzzleItem(8, true), new PuzzleItem(5, false), new PuzzleItem(null, true)],
                ]);

                let newDuplicatedRowId = 0;
                let newDuplicatedColumnId = 0;

                assert(gridManagerService.validateEnteredNumber(
                    fakePuzzle, newDuplicatedRowId, newDuplicatedColumnId) === false,
                    " A duplicated number is not allowed in the current first row");

            }))
    );

    it("validateEnteredNumber, Should return false with a duplicated number in the first column",
        inject([ GridManagerService ],
            fakeAsync((gridManagerService: GridManagerService) => {

                // Create a ready puzzle for the grid.
                let fakePuzzle = new Puzzle([
                    [new PuzzleItem(1, true), new PuzzleItem(2, false), new PuzzleItem(null, true),
                    new PuzzleItem(6, true), new PuzzleItem(3, false), new PuzzleItem(8, true)],
                    [new PuzzleItem(4, false), new PuzzleItem(6, false), new PuzzleItem(3, false),
                    new PuzzleItem(5, true), new PuzzleItem(1, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(5, false), new PuzzleItem(null, true), new PuzzleItem(7, true),
                    new PuzzleItem(9, true), new PuzzleItem(4, false), new PuzzleItem(null, true)],

                    [new PuzzleItem(1, true), new PuzzleItem(5, false), new PuzzleItem(null, true),
                    new PuzzleItem(4, true), new PuzzleItem(2, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(2, false), new PuzzleItem(1, false), new PuzzleItem(4, false),
                    new PuzzleItem(3, true), new PuzzleItem(7, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(7, false), new PuzzleItem(null, true), new PuzzleItem(null, true),
                    new PuzzleItem(8, true), new PuzzleItem(5, false), new PuzzleItem(null, true)],
                ]);

                let newDuplicatedRowId = 0;
                let newDuplicatedColumnId = 0;

                assert(gridManagerService.validateEnteredNumber(
                    fakePuzzle, newDuplicatedRowId, newDuplicatedColumnId) === false,
                    "A duplicated number is not allowed in a column");

            }))
    );

    it("validateEnteredNumber, Should return false with a duplicated number in the 1st column, 2nd row",
        inject([ GridManagerService ],
            fakeAsync((gridManagerService: GridManagerService) => {

                // Create a ready puzzle for the grid.
                let fakePuzzle = new Puzzle([
                    [new PuzzleItem(1, true), new PuzzleItem(2, false), new PuzzleItem(null, true),
                    new PuzzleItem(6, true), new PuzzleItem(3, false), new PuzzleItem(8, true)],
                    [new PuzzleItem(2, false), new PuzzleItem(6, false), new PuzzleItem(3, false),
                    new PuzzleItem(5, true), new PuzzleItem(1, false), new PuzzleItem(2, true)],
                    [new PuzzleItem(5, false), new PuzzleItem(null, true), new PuzzleItem(7, true),
                    new PuzzleItem(9, true), new PuzzleItem(4, false), new PuzzleItem(null, true)],

                    [new PuzzleItem(1, true), new PuzzleItem(5, false), new PuzzleItem(null, true),
                    new PuzzleItem(4, true), new PuzzleItem(2, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(2, false), new PuzzleItem(1, false), new PuzzleItem(4, false),
                    new PuzzleItem(3, true), new PuzzleItem(7, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(7, false), new PuzzleItem(null, true), new PuzzleItem(null, true),
                    new PuzzleItem(8, true), new PuzzleItem(5, false), new PuzzleItem(null, true)],
                ]);

                let newDuplicatedRowId = 0;
                let newDuplicatedColumnId = 0;

                assert(gridManagerService.validateEnteredNumber(
                    fakePuzzle, newDuplicatedRowId, newDuplicatedColumnId) === false,
                    "A duplicated number is not allowed in a column");

            }))
    );

    it("validateEnteredNumber, Should return true with a valid grid",
        inject([ GridManagerService ],
            fakeAsync((gridManagerService: GridManagerService) => {

                // Create a ready puzzle for the grid.
                let fakePuzzle = new Puzzle([
                    [new PuzzleItem(1, true), new PuzzleItem(2, false), new PuzzleItem(null, true),
                    new PuzzleItem(6, true), new PuzzleItem(3, false), new PuzzleItem(8, true)],
                    [new PuzzleItem(4, false), new PuzzleItem(6, false), new PuzzleItem(3, false),
                    new PuzzleItem(5, true), new PuzzleItem(1, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(5, false), new PuzzleItem(null, true), new PuzzleItem(7, true),
                    new PuzzleItem(9, true), new PuzzleItem(4, false), new PuzzleItem(null, true)],

                    [new PuzzleItem(3, true), new PuzzleItem(5, false), new PuzzleItem(null, true),
                    new PuzzleItem(4, true), new PuzzleItem(2, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(2, false), new PuzzleItem(1, false), new PuzzleItem(4, false),
                    new PuzzleItem(3, true), new PuzzleItem(7, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(7, false), new PuzzleItem(null, true), new PuzzleItem(null, true),
                    new PuzzleItem(8, true), new PuzzleItem(5, false), new PuzzleItem(null, true)],
                ]);

                let newDuplicatedRowId = 0;
                let newDuplicatedColumnId = 0;

                assert(gridManagerService.validateEnteredNumber(
                    fakePuzzle, newDuplicatedRowId, newDuplicatedColumnId) === true,
                    " The current grid must be valid");

            }))
    );

    it("initializeGrid should throw a null argument error",
        inject([ GridManagerService ],
            fakeAsync((gridManagerService: GridManagerService) => {
                assert.throws(() => gridManagerService.initializeGrid(null), Error, "The initial grid cannot be null");
            }))
    );


    it("initializeGrid should reset the current given",
        inject([ GridManagerService ], fakeAsync((gridManagerService: GridManagerService) => {

            // Create a fake valid puzzle.
            let fakePuzzle = new Puzzle([
                [new PuzzleItem(1, true), new PuzzleItem(2, false), new PuzzleItem(null, true),
                new PuzzleItem(6, true), new PuzzleItem(3, false), new PuzzleItem(8, true)],
                [new PuzzleItem(4, false), new PuzzleItem(6, false), new PuzzleItem(3, false),
                new PuzzleItem(5, true), new PuzzleItem(1, false), new PuzzleItem(null, true)],
                [new PuzzleItem(5, false), new PuzzleItem(null, true), new PuzzleItem(7, true),
                new PuzzleItem(9, true), new PuzzleItem(4, false), new PuzzleItem(null, true)],

                [new PuzzleItem(3, true), new PuzzleItem(5, false), new PuzzleItem(null, true),
                new PuzzleItem(4, true), new PuzzleItem(2, false), new PuzzleItem(null, true)],
                [new PuzzleItem(2, false), new PuzzleItem(1, false), new PuzzleItem(4, false),
                new PuzzleItem(3, true), new PuzzleItem(7, false), new PuzzleItem(null, true)],
                [new PuzzleItem(7, false), new PuzzleItem(null, true), new PuzzleItem(null, true),
                new PuzzleItem(8, true), new PuzzleItem(5, false), new PuzzleItem(null, true)],
            ]);

            let expectedPuzzle = new Puzzle([
                [new PuzzleItem(null, true), new PuzzleItem(2, false), new PuzzleItem(null, true),
                new PuzzleItem(null, true), new PuzzleItem(3, false), new PuzzleItem(null, true)],
                [new PuzzleItem(4, false), new PuzzleItem(6, false), new PuzzleItem(3, false),
                new PuzzleItem(null, true), new PuzzleItem(1, false), new PuzzleItem(null, true)],
                [new PuzzleItem(5, false), new PuzzleItem(null, true), new PuzzleItem(null, true),
                new PuzzleItem(null, true), new PuzzleItem(4, false), new PuzzleItem(null, true)],

                [new PuzzleItem(null, true), new PuzzleItem(5, false), new PuzzleItem(null, true),
                new PuzzleItem(null, true), new PuzzleItem(2, false), new PuzzleItem(null, true)],
                [new PuzzleItem(2, false), new PuzzleItem(1, false), new PuzzleItem(4, false),
                new PuzzleItem(null, true), new PuzzleItem(7, false), new PuzzleItem(null, true)],
                [new PuzzleItem(7, false), new PuzzleItem(null, true), new PuzzleItem(null, true),
                new PuzzleItem(null, true), new PuzzleItem(5, false), new PuzzleItem(null, true)],
            ]);

            gridManagerService.initializeGrid(fakePuzzle);

            // Check the expected result
            expect(fakePuzzle).to.deep.equal(expectedPuzzle);
        }))
    );

    it("countFilledCell, Should set the number of cell to be completed to 1.",
        inject([ GridManagerService ],
            fakeAsync((gridManagerService: GridManagerService) => {

                // Create a ready puzzle for the grid.
                let fakePuzzle = new Puzzle([
                    [new PuzzleItem(1, false), new PuzzleItem(2, false), new PuzzleItem(null, false),
                    new PuzzleItem(6, false), new PuzzleItem(3, false), new PuzzleItem(8, false)],
                    [new PuzzleItem(2, false), new PuzzleItem(6, false), new PuzzleItem(3, false),
                    new PuzzleItem(5, false), new PuzzleItem(1, false), new PuzzleItem(2, false)],
                    [new PuzzleItem(5, false), new PuzzleItem(null, false), new PuzzleItem(7, false),
                    new PuzzleItem(9, false), new PuzzleItem(4, false), new PuzzleItem(null, false)],

                    [new PuzzleItem(1, false), new PuzzleItem(5, false), new PuzzleItem(null, true),
                    new PuzzleItem(4, false), new PuzzleItem(2, false), new PuzzleItem(null, false)],
                    [new PuzzleItem(2, false), new PuzzleItem(1, false), new PuzzleItem(4, false),
                    new PuzzleItem(3, false), new PuzzleItem(7, false), new PuzzleItem(null, false)],
                    [new PuzzleItem(7, false), new PuzzleItem(null, false), new PuzzleItem(null, false),
                    new PuzzleItem(8, false), new PuzzleItem(5, false), new PuzzleItem(null, false)],
                ]);

                gridManagerService.countFilledCell(fakePuzzle);
                expect(gridManagerService.cellsToBeCompleted).to.be.equals(1);
            }))
    );

    it("decrementCellsToBeCompleted, Should return 1 for a puzzle with only 2 remaining cells to be completed.",
        inject([ GridManagerService ],
            fakeAsync((gridManagerService: GridManagerService) => {

                // Create a ready puzzle for the grid.
                let fakePuzzle = new Puzzle([
                    [new PuzzleItem(1, false), new PuzzleItem(2, false), new PuzzleItem(null, false),
                    new PuzzleItem(6, false), new PuzzleItem(3, false), new PuzzleItem(8, false)],
                    [new PuzzleItem(2, false), new PuzzleItem(6, false), new PuzzleItem(3, false),
                    new PuzzleItem(5, false), new PuzzleItem(1, false), new PuzzleItem(2, false)],
                    [new PuzzleItem(5, false), new PuzzleItem(null, false), new PuzzleItem(7, false),
                    new PuzzleItem(9, false), new PuzzleItem(4, false), new PuzzleItem(null, false)],

                    [new PuzzleItem(1, false), new PuzzleItem(5, false), new PuzzleItem(null, true),
                    new PuzzleItem(4, false), new PuzzleItem(2, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(2, false), new PuzzleItem(1, false), new PuzzleItem(4, false),
                    new PuzzleItem(3, false), new PuzzleItem(7, false), new PuzzleItem(null, false)],
                    [new PuzzleItem(7, false), new PuzzleItem(null, false), new PuzzleItem(null, false),
                    new PuzzleItem(8, false), new PuzzleItem(5, false), new PuzzleItem(null, false)],
                ]);

                gridManagerService.countFilledCell(fakePuzzle);
                expect(gridManagerService.cellsToBeCompleted).to.be.equals(2);
                gridManagerService.decrementCellsToBeCompleted();
                expect(gridManagerService.cellsToBeCompleted).to.be.equals(1);
            }))
    );

    it("deleteCurrentValue, Should delete value of PuzzleItem located at row 0, column 0 "
        + "and increment cellsToBeCompleted",
        inject([ GridManagerService ],
            fakeAsync((gridManagerService: GridManagerService) => {

                // Create a ready puzzle for the grid.
                let fakePuzzle = new Puzzle([
                    [new PuzzleItem(1, false), new PuzzleItem(2, false), new PuzzleItem(null, false),
                    new PuzzleItem(6, false), new PuzzleItem(3, false), new PuzzleItem(8, false)],
                    [new PuzzleItem(2, false), new PuzzleItem(6, false), new PuzzleItem(3, false),
                    new PuzzleItem(5, false), new PuzzleItem(1, false), new PuzzleItem(2, false)],
                    [new PuzzleItem(5, false), new PuzzleItem(null, false), new PuzzleItem(7, false),
                    new PuzzleItem(9, false), new PuzzleItem(4, false), new PuzzleItem(null, false)],

                    [new PuzzleItem(1, false), new PuzzleItem(5, false), new PuzzleItem(null, true),
                    new PuzzleItem(4, false), new PuzzleItem(2, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(2, false), new PuzzleItem(1, false), new PuzzleItem(4, false),
                    new PuzzleItem(3, false), new PuzzleItem(7, false), new PuzzleItem(null, false)],
                    [new PuzzleItem(7, false), new PuzzleItem(null, false), new PuzzleItem(null, false),
                    new PuzzleItem(8, false), new PuzzleItem(5, false), new PuzzleItem(null, false)],
                ]);

                gridManagerService.countFilledCell(fakePuzzle);
                expect(gridManagerService.cellsToBeCompleted).to.be.equals(2);
                gridManagerService.deleteCurrentValue(fakePuzzle, 0, 0);
                expect(gridManagerService.cellsToBeCompleted).to.be.equals(3);
                expect(fakePuzzle._puzzle[0][0]._value).to.be.null;
            }))
    );

    it("deleteCurrentValue, Should throw an error because the row index is out of bound.",
        inject([ GridManagerService ],
            fakeAsync((gridManagerService: GridManagerService) => {

                // Create a ready puzzle for the grid.
                let fakePuzzle = new Puzzle([
                    [new PuzzleItem(1, false), new PuzzleItem(2, false), new PuzzleItem(null, false),
                    new PuzzleItem(6, false), new PuzzleItem(3, false), new PuzzleItem(8, false)],
                    [new PuzzleItem(2, false), new PuzzleItem(6, false), new PuzzleItem(3, false),
                    new PuzzleItem(5, false), new PuzzleItem(1, false), new PuzzleItem(2, false)],
                    [new PuzzleItem(5, false), new PuzzleItem(null, false), new PuzzleItem(7, false),
                    new PuzzleItem(9, false), new PuzzleItem(4, false), new PuzzleItem(null, false)],

                    [new PuzzleItem(1, false), new PuzzleItem(5, false), new PuzzleItem(null, true),
                    new PuzzleItem(4, false), new PuzzleItem(2, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(2, false), new PuzzleItem(1, false), new PuzzleItem(4, false),
                    new PuzzleItem(3, false), new PuzzleItem(7, false), new PuzzleItem(null, false)],
                    [new PuzzleItem(7, false), new PuzzleItem(null, false), new PuzzleItem(null, false),
                    new PuzzleItem(8, false), new PuzzleItem(5, false), new PuzzleItem(null, false)],
                ]);

                gridManagerService.countFilledCell(fakePuzzle);
                expect(gridManagerService.cellsToBeCompleted).to.be.equals(2);
                expect(() => gridManagerService.deleteCurrentValue(fakePuzzle, 9, 0))
                    .to.throw("A row or a column index cannot be greater than (8)");
                expect(() => gridManagerService.deleteCurrentValue(fakePuzzle, -1, 0))
                    .to.throw("A row or a column index cannot be less than (0)");
            }))
    );

    it("updateGridAfterDelete, Should not do any modification on the grid except css ones.",
        inject([ GridManagerService ],
            fakeAsync((gridManagerService: GridManagerService) => {

                // Create a ready puzzle for the grid.
                let fakePuzzle = new Puzzle([
                    [new PuzzleItem(1, true), new PuzzleItem(2, true), new PuzzleItem(null, false),
                    new PuzzleItem(6, false), new PuzzleItem(3, false), new PuzzleItem(8, false)],
                    [new PuzzleItem(2, false), new PuzzleItem(6, false), new PuzzleItem(3, false),
                    new PuzzleItem(5, false), new PuzzleItem(1, false), new PuzzleItem(2, false)],
                    [new PuzzleItem(5, false), new PuzzleItem(null, false), new PuzzleItem(7, false),
                    new PuzzleItem(9, false), new PuzzleItem(4, false), new PuzzleItem(null, false)],

                    [new PuzzleItem(1, false), new PuzzleItem(5, false), new PuzzleItem(null, true),
                    new PuzzleItem(4, false), new PuzzleItem(2, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(2, false), new PuzzleItem(1, false), new PuzzleItem(4, false),
                    new PuzzleItem(3, false), new PuzzleItem(7, false), new PuzzleItem(null, false)],
                    [new PuzzleItem(7, false), new PuzzleItem(null, false), new PuzzleItem(null, false),
                    new PuzzleItem(8, false), new PuzzleItem(5, false), new PuzzleItem(null, false)],
                ]);

                gridManagerService.countFilledCell(fakePuzzle);
                expect(gridManagerService.cellsToBeCompleted).to.be.equals(4);
                gridManagerService.updateGridAfterInsertOrDelete(fakePuzzle, 0, 0);
                expect(gridManagerService.cellsToBeCompleted).to.be.equals(4);
            }))
    );
});
