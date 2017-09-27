import { expect } from "chai";
import { Puzzle } from "../puzzle/puzzle";
import { IPuzzleItemData, PuzzleItem } from "../puzzle/puzzle-item";

const puzzleSeed = [
    [
        new PuzzleItem(1, false), new PuzzleItem(2, false), new PuzzleItem(3, false),
        new PuzzleItem(4, false), new PuzzleItem(5, false), new PuzzleItem(6, false),
        new PuzzleItem(7, false), new PuzzleItem(8, false), new PuzzleItem(9, false)
    ],
    [
        new PuzzleItem(4, false), new PuzzleItem(5, false), new PuzzleItem(6, false),
        new PuzzleItem(7, false), new PuzzleItem(8, false), new PuzzleItem(9, false),
        new PuzzleItem(1, false), new PuzzleItem(2, false), new PuzzleItem(3, false)
    ],
    [
        new PuzzleItem(7, false), new PuzzleItem(8, false), new PuzzleItem(9, false),
        new PuzzleItem(1, false), new PuzzleItem(2, false), new PuzzleItem(3, false),
        new PuzzleItem(4, false), new PuzzleItem(5, false), new PuzzleItem(6, false)
    ],
    [
        new PuzzleItem(2, false), new PuzzleItem(3, false), new PuzzleItem(4, false),
        new PuzzleItem(5, false), new PuzzleItem(6, false), new PuzzleItem(7, false),
        new PuzzleItem(8, false), new PuzzleItem(9, false), new PuzzleItem(1, false)
    ],
    [
        new PuzzleItem(5, false), new PuzzleItem(6, false), new PuzzleItem(7, false),
        new PuzzleItem(8, false), new PuzzleItem(9, false), new PuzzleItem(1, false),
        new PuzzleItem(2, false), new PuzzleItem(3, false), new PuzzleItem(4, false)
    ],
    [
        new PuzzleItem(8, false), new PuzzleItem(9, false), new PuzzleItem(1, false),
        new PuzzleItem(2, false), new PuzzleItem(3, false), new PuzzleItem(4, false),
        new PuzzleItem(5, false), new PuzzleItem(6, false), new PuzzleItem(7, false)
    ],
    [
        new PuzzleItem(3, false), new PuzzleItem(4, false), new PuzzleItem(5, false),
        new PuzzleItem(6, false), new PuzzleItem(7, false), new PuzzleItem(8, false),
        new PuzzleItem(9, false), new PuzzleItem(1, false), new PuzzleItem(2, false)
    ],
    [
        new PuzzleItem(6, false), new PuzzleItem(7, false), new PuzzleItem(8, false),
        new PuzzleItem(9, false), new PuzzleItem(1, false), new PuzzleItem(2, false),
        new PuzzleItem(3, false), new PuzzleItem(4, false), new PuzzleItem(5, false)
    ],
    [
        new PuzzleItem(9, false), new PuzzleItem(1, false), new PuzzleItem(2, false),
        new PuzzleItem(3, false), new PuzzleItem(4, false), new PuzzleItem(5, false),
        new PuzzleItem(6, false), new PuzzleItem(7, false), new PuzzleItem(8, false)
    ]
];

const GRID_FULL = [
    [
        new PuzzleItem(4, true), new PuzzleItem(1, true), new PuzzleItem(5, true),
        new PuzzleItem(6, true), new PuzzleItem(3, false), new PuzzleItem(8, true),
        new PuzzleItem(9, true), new PuzzleItem(7, true), new PuzzleItem(2, false)
    ],
    [
        new PuzzleItem(3, true), new PuzzleItem(6, false), new PuzzleItem(2, false),
        new PuzzleItem(4, false), new PuzzleItem(7, true), new PuzzleItem(9, true),
        new PuzzleItem(1, true), new PuzzleItem(8, false), new PuzzleItem(5, true)
    ],
    [
        new PuzzleItem(7, false), new PuzzleItem(8, true), new PuzzleItem(9, true),
        new PuzzleItem(2, false), new PuzzleItem(1, true), new PuzzleItem(5, false),
        new PuzzleItem(3, true), new PuzzleItem(6, true), new PuzzleItem(4, true)
    ],
    [
        new PuzzleItem(9, true), new PuzzleItem(2, true), new PuzzleItem(6, false),
        new PuzzleItem(3, true), new PuzzleItem(4, true), new PuzzleItem(1, true),
        new PuzzleItem(7, true), new PuzzleItem(5, true), new PuzzleItem(8, false)
    ],
    [
        new PuzzleItem(1, true), new PuzzleItem(3, true), new PuzzleItem(8, true),
        new PuzzleItem(7, true), new PuzzleItem(5, true), new PuzzleItem(6, true),
        new PuzzleItem(4, true), new PuzzleItem(2, true), new PuzzleItem(9, true)
    ],
    [
        new PuzzleItem(5, true), new PuzzleItem(7, false), new PuzzleItem(4, true),
        new PuzzleItem(9, true), new PuzzleItem(8, true), new PuzzleItem(2, true),
        new PuzzleItem(6, true), new PuzzleItem(3, false), new PuzzleItem(1, true)
    ],
    [
        new PuzzleItem(2, false), new PuzzleItem(5, true), new PuzzleItem(7, true),
        new PuzzleItem(1, false), new PuzzleItem(6, true), new PuzzleItem(4, false),
        new PuzzleItem(8, false), new PuzzleItem(9, true), new PuzzleItem(3, true)
    ],
    [
        new PuzzleItem(8, true), new PuzzleItem(4, true), new PuzzleItem(3, true),
        new PuzzleItem(5, false), new PuzzleItem(9, true), new PuzzleItem(7, true),
        new PuzzleItem(2, true), new PuzzleItem(1, true), new PuzzleItem(6, true)
    ],
    [
        new PuzzleItem(6, true), new PuzzleItem(9, true), new PuzzleItem(1, true),
        new PuzzleItem(8, false), new PuzzleItem(2, false), new PuzzleItem(3, true),
        new PuzzleItem(5, true), new PuzzleItem(4, true), new PuzzleItem(7, false)
    ]
];

const GRID_HOLES = [
    [
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(null, true),
        new PuzzleItem(null, true), new PuzzleItem(3, false), new PuzzleItem(null, true),
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(2, false)
    ],
    [
        new PuzzleItem(null, true), new PuzzleItem(6, false), new PuzzleItem(2, false),
        new PuzzleItem(4, false), new PuzzleItem(null, true), new PuzzleItem(null, true),
        new PuzzleItem(null, true), new PuzzleItem(8, false), new PuzzleItem(null, true)
    ],
    [
        new PuzzleItem(7, false), new PuzzleItem(null, true), new PuzzleItem(null, true),
        new PuzzleItem(2, false), new PuzzleItem(null, true), new PuzzleItem(5, false),
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(null, true)
    ],
    [
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(6, false),
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(null, true),
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(8, false)
    ],
    [
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(null, true),
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(null, true),
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(null, true)
    ],
    [
        new PuzzleItem(null, true), new PuzzleItem(7, false), new PuzzleItem(null, true),
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(null, true),
        new PuzzleItem(null, true), new PuzzleItem(3, false), new PuzzleItem(null, true)
    ],
    [
        new PuzzleItem(2, false), new PuzzleItem(null, true), new PuzzleItem(null, true),
        new PuzzleItem(1, false), new PuzzleItem(null, true), new PuzzleItem(4, false),
        new PuzzleItem(8, false), new PuzzleItem(null, true), new PuzzleItem(null, true)
    ],
    [
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(null, true),
        new PuzzleItem(5, false), new PuzzleItem(null, true), new PuzzleItem(null, true),
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(null, true)
    ],
    [
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(null, true),
        new PuzzleItem(8, false), new PuzzleItem(2, false), new PuzzleItem(null, true),
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(7, false)
    ]
];

describe("Puzzle constructor should", () => {
    it("initialize grid and contain puzzleSeed", () => {
        let puzzle: Puzzle = new Puzzle();
        expect(puzzle._puzzle, "should contain puzzleSeed").to.be.deep.equal(puzzleSeed);
    });
});

describe("Puzzle should", () => {

    let puzzle: Puzzle;

    beforeEach(() => {
        puzzle = new Puzzle();
    });

    // Puzzle operations
    it("copy himself with the constructor", () => {
        let puzzleCopy = new Puzzle(puzzle);
        expect(puzzleCopy, "should contain same values").to.be.deep.equal(puzzle);
        puzzleCopy.setPuzzleTileValue(3, 3, 3);
        expect(puzzleCopy.getPuzzleTileValue(3, 3)).to.not.equal(puzzle.getPuzzleTileValue(3, 3));
    });

    it("have setters and getters working properly", () => {
        expect(puzzle.setPuzzleTileValue.bind(puzzle, -1, 1, 7)
            , "Puzzle setter tile value should throw exception with invalid row.").to.throw(RangeError);
        expect(puzzle.setPuzzleTileValue.bind(puzzle, 1, -1, 7)
            , "Puzzle setter tile value should throw exception with invalid column.").to.throw(RangeError);
        expect(puzzle.setPuzzleTileValue.bind(puzzle, 1, 1, 0)
            , "Puzzle setter tile value should throw exception with invalid value.").to.throw(RangeError);
        expect(puzzle.setPuzzleTileValue.bind(puzzle, 1, 1, 6), "Puzzle setter tile value should accept the value")
            .to.not.throw(RangeError);

        expect(puzzle.setPuzzleTileVisibility.bind(puzzle, -1, 1, true)
            , "Puzzle setter tile visibility should throw exception with invalid row.").to.throw(RangeError);
        expect(puzzle.setPuzzleTileVisibility.bind(puzzle, 1, -1, true)
            , "Puzzle setter tile visibility should throw exception with invalid column.").to.throw(RangeError);
        expect(puzzle.setPuzzleTileVisibility.bind(puzzle, 1, 1, null)
            , "Puzzle setter tile visibility should throw exception with invalid value.").to.throw(RangeError);
        expect(puzzle.setPuzzleTileVisibility.bind(puzzle, 1, 1, true)
            , "Puzzle setter tile visibility should accept the value").to.not.throw(RangeError);

        expect(puzzle.getPuzzleTileValue.bind(puzzle, -1, 1)
            , "Puzzle getter tile value should throw exception with invalid row.").to.throw(RangeError);
        expect(puzzle.getPuzzleTileValue.bind(puzzle, 1, -1)
            , "Puzzle getter tile value should throw exception with invalid column.").to.throw(RangeError);
        expect(puzzle.getPuzzleTileValue(1, 1)
            , "Puzzle getter tile value should give the value entered by the setter.").to.be.equal(6);

        expect(puzzle.getPuzzleTileVisibility.bind(puzzle, -1, 1)
            , "Puzzle getter tile visibility should throw exception with invalid row.").to.throw(RangeError);
        expect(puzzle.getPuzzleTileVisibility.bind(puzzle, 1, -1)
            , "Puzzle setter tile visibility should throw exception with invalid column.").to.throw(RangeError);
        expect(puzzle.getPuzzleTileVisibility(1, 1)
            , "Puzzle getter tile visibility should give the value entered by the setter.").to.be.equal(true);
    });


    it("swap column 0 with 1", () => {
        puzzle._puzzle = [
            [
                new PuzzleItem(1, true), new PuzzleItem(2, false)
            ],
            [
                new PuzzleItem(3, false), new PuzzleItem(4, true)
            ]
        ];
        let cell00 = puzzle._puzzle[0][1].value;
        let cell01 = puzzle._puzzle[0][0].value;
        let cell10 = puzzle._puzzle[1][1].value;
        let cell11 = puzzle._puzzle[1][0].value;
        puzzle.swapColumn(0, 1);
        expect(puzzle._puzzle[0][0].value, "should have swapped").to.equals(cell00);
        expect(puzzle._puzzle[0][1].value, "should have swapped").to.equals(cell01);
        expect(puzzle._puzzle[1][0].value, "should have swapped").to.equals(cell10);
        expect(puzzle._puzzle[1][1].value, "should have swapped").to.equals(cell11);
    });

    it("swap row 0 with 1", () => {
        puzzle._puzzle = [
            [
                new PuzzleItem(1, true), new PuzzleItem(2, false)
            ],
            [
                new PuzzleItem(3, false), new PuzzleItem(4, true)
            ]
        ];

        let cell00 = puzzle._puzzle[1][0].value;
        let cell01 = puzzle._puzzle[1][1].value;
        let cell10 = puzzle._puzzle[0][0].value;
        let cell11 = puzzle._puzzle[0][1].value;
        puzzle.swapRow(0, 1);
        expect(puzzle._puzzle[0][0].value, "should have swapped").to.equals(cell00);
        expect(puzzle._puzzle[0][1].value, "should have swapped").to.equals(cell01);
        expect(puzzle._puzzle[1][0].value, "should have swapped").to.equals(cell10);
        expect(puzzle._puzzle[1][1].value, "should have swapped").to.equals(cell11);
    });

    it("invert puzzle on horizontal axis", () => {
        puzzle._puzzle = [
            [
                new PuzzleItem(1, true), new PuzzleItem(2, false)
            ],
            [
                new PuzzleItem(3, false), new PuzzleItem(4, true)
            ]
        ];

        let cell00 = puzzle._puzzle[1][0].value;
        let cell01 = puzzle._puzzle[1][1].value;
        let cell10 = puzzle._puzzle[0][0].value;
        let cell11 = puzzle._puzzle[0][1].value;
        puzzle.swapRow(0, 1);
        expect(puzzle._puzzle[0][0].value, "should have swapped 1").to.equals(cell00);
        expect(puzzle._puzzle[0][1].value, "should have swapped 2").to.equals(cell01);
        expect(puzzle._puzzle[1][0].value, "should have swapped 3").to.equals(cell10);
        expect(puzzle._puzzle[1][1].value, "should have swapped 4").to.equals(cell11);
    });

    it("invertPuzzle on diagonal 1", () => {
        let cell00 = puzzle._puzzle[0][0].value;
        let cell01 = puzzle._puzzle[0][1].value;
        let cell10 = puzzle._puzzle[1][0].value;
        let cell52 = puzzle._puzzle[5][2].value;
        puzzle.diagonal1Symmetry();
        expect(puzzle._puzzle[0][0].value, "should not have swapped").to.equals(cell00);
        expect(puzzle._puzzle[1][0].value, "should have swapped 1").to.equals(cell01);
        expect(puzzle._puzzle[0][1].value, "should have swapped 2").to.equals(cell10);
        expect(puzzle._puzzle[2][5].value, "should have swapped 3").to.equals(cell52);
    });

    it("invertPuzzle on diagonal 2", () => {
        let cell08 = puzzle._puzzle[0][8].value;
        let cell00 = puzzle._puzzle[0][0].value;
        let cell88 = puzzle._puzzle[8][8].value;
        let cell32 = puzzle._puzzle[3][2].value;
        puzzle.diagonal2Symmetry();
        expect(puzzle._puzzle[0][8].value, "should not have swapped").to.equals(cell08);
        expect(puzzle._puzzle[8][8].value, "should have swapped 1").to.equals(cell00);
        expect(puzzle._puzzle[0][0].value, "should have swapped 2").to.equals(cell88);
        expect(puzzle._puzzle[6][5].value, "should have swapped 3").to.equals(cell32);
    });

    it("erase values from puzzleItem marked hidden", () => {
        puzzle._puzzle = GRID_FULL;
        let puzzleHoles = new Puzzle();
        puzzleHoles._puzzle = GRID_HOLES;
        puzzle.createPuzzleHoles();
        expect(puzzle).to.be.deep.equal(puzzleHoles);
    });

    it("throw exception due to invalid parameters", () => {
        expect(puzzle.hideAllItemsInRange.bind(puzzle, -1, 8, 0, 8)).to.throw(Error);
        expect(puzzle.hideAllItemsInRange.bind(puzzle, 0, 9, 0, 8)).to.throw(Error);
        expect(puzzle.hideAllItemsInRange.bind(puzzle, 0, 8, -1, 8)).to.throw(Error);
        expect(puzzle.hideAllItemsInRange.bind(puzzle, 0, 8, 0, 9)).to.throw(Error);
        expect(puzzle.hideAllItemsInRange.bind(puzzle, 7, 6, 0, 8)).to.throw(Error);
        expect(puzzle.hideAllItemsInRange.bind(puzzle, 0, 8, 4, 3)).to.throw(Error);
    });

    it("hide 1 item", () => {
        puzzle.hideAllItemsInRange(4, 4, 8, 8);
        expect(puzzle._puzzle[4][8].isHidden).to.equal(true);
    });

    it("hide some items", () => {
        puzzle.hideAllItemsInRange(0, 4, 6, 8);
        for (let row = 0; row <= 4; ++row) {
            for (let column = 6; column <= 8; ++column) {
                expect(puzzle._puzzle[row][column].isHidden).to.equal(true);
            }
        }
    });

    it("have the right number of holes", () => {
        expect(puzzle.getNumberOfHoles(), "Initial puzzle should have 0 holes.").to.be.equal(0);
        puzzle.setPuzzleTileVisibility(4, 5, true);
        expect(puzzle.getNumberOfHoles(), "Puzzle should have 1 hole.").to.be.equal(1);
        puzzle.setPuzzleTileVisibility(4, 5, false);
        puzzle.setPuzzleTileVisibility(6, 6, true);
        expect(puzzle.getNumberOfHoles(), "Puzzle should still have 1 hole.").to.be.equal(1);
        puzzle.hideAllItemsInRange(Puzzle.MIN_ROW_INDEX, Puzzle.MAX_ROW_INDEX
            , Puzzle.MIN_COLUMN_INDEX, Puzzle.MAX_COLUMN_INDEX);
        expect(puzzle.getNumberOfHoles(), "Puzzle should have the maximum number of holes")
            .to.be.equal((Puzzle.MAX_ROW_INDEX + 1) * (Puzzle.MAX_COLUMN_INDEX + 1));
    });
});
