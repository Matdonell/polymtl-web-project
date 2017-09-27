import { expect } from "chai";

import { GridValidationManager } from "../grid-validation.service";
import { IPuzzleItemData, PuzzleItem } from "../../models/puzzle/puzzle-item";
import { Puzzle } from "../../models/puzzle/puzzle";

const BAD_GRID_1 = [
    [{ _value: 1, _hide: true }, { _value: 2, _hide: true }, { _value: 3, _hide: true }]
];

const BAD_GRID_2 = [
    [{ _value: 1, _hide: true }, { _value: 2, _hide: true }, { _value: 3, _hide: true },
    { _value: 4, _hide: true }, { _value: 5, _hide: true }, { _value: 6, _hide: true },
    { _value: 7, _hide: true }, { _value: 8, _hide: true }, { _value: 9, _hide: true }]
];

const BAD_GRID_3 = [
    [{ _value: 1, _hide: true }, { _value: 2, _hide: true }, null]
];


const GRID_VALID = [
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

// ERROR on the first row (two 4 : column 0 and 1)
// ERROR on the first column (two 4 : row 0 and 3)
// ERROR on the first square (two 4 : pos 00 and 01)
const GRID_NOT_VALID = [
    [
        new PuzzleItem(4, true), new PuzzleItem(4, true), new PuzzleItem(5, true),
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
        new PuzzleItem(4, true), new PuzzleItem(2, true), new PuzzleItem(6, false),
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

describe("Grid validation manager - constructions", () => {

    it("should throw exceptions because of invalid data structure", () => {
        expect(() => { new GridValidationManager(null); }, "should not accept null value.").to.throw(Error);
        expect(() => { GridValidationManager.convertObjectToAnArrayOfPuzzleItem(BAD_GRID_1); },
            "should not accept BAD_GRID_1.").to.throw(TypeError);
        expect(() => { GridValidationManager.convertObjectToAnArrayOfPuzzleItem(BAD_GRID_2); },
            "should not accept BAD_GRID_2.").to.throw(TypeError);
        expect(() => { GridValidationManager.convertObjectToAnArrayOfPuzzleItem(BAD_GRID_3); },
            "should not accept BAD_GRID_3.").to.throw(TypeError);
    });

    it("should not construct a double array of PuzzleItem from a doubleArray of IPuzzleItemData", () => {
        let badObject1: Array<Array<IPuzzleItemData>> = [null];
        let badObject2: Array<Array<IPuzzleItemData>> = [[{ _value: 1, _hide: true }]];
        expect(() => { GridValidationManager.convertObjectToAnArrayOfPuzzleItem(badObject1); }).to.throw(TypeError);
        expect(() => { GridValidationManager.convertObjectToAnArrayOfPuzzleItem(badObject2); }).to.throw(TypeError);
    });

    it("should construct a double array of PuzzleItem from a doubleArray of IPuzzleItemData", () => {
        let arrayOfIPuzzleData = new Array<Array<IPuzzleItemData>>();
        for (let row = Puzzle.MIN_ROW_INDEX; row <= Puzzle.MAX_ROW_INDEX; ++row) {
            arrayOfIPuzzleData.push(new Array<IPuzzleItemData>());
            for (let column = Puzzle.MIN_COLUMN_INDEX; column <= Puzzle.MAX_COLUMN_INDEX; ++column) {
                arrayOfIPuzzleData[row].push({ _value: 1, _hide: false });
            }
        }
        expect(() => { GridValidationManager.convertObjectToAnArrayOfPuzzleItem(arrayOfIPuzzleData); })
            .to.not.throw(TypeError);
    });
});

describe("Grid validation manager - Invalid grid", () => {

    let gridValidationManager: GridValidationManager;

    beforeEach(() => {
        gridValidationManager = new GridValidationManager(GRID_NOT_VALID);
    });

    it("should return false with a duplicated number error in the current row", () => {
        expect(gridValidationManager.hasNoRepeatedNumbersInRange(0, 0,
            Puzzle.MIN_COLUMN_INDEX, Puzzle.MAX_COLUMN_INDEX)).to.be.false;
    });

    it("should return false with a duplicated number error in the current column", () => {
        expect(gridValidationManager.hasNoRepeatedNumbersInRange(Puzzle.MIN_ROW_INDEX, Puzzle.MAX_ROW_INDEX,
            0, 0)).to.be.false;
    });

    it("should return false with a duplicated number error in the first square", () => {
        expect(gridValidationManager.hasNoRepeatedNumbersInRange(Puzzle.MIN_ROW_INDEX, Puzzle.SQUARE_LENGTH - 1,
            Puzzle.MIN_COLUMN_INDEX, Puzzle.SQUARE_LENGTH - 1)).to.be.false;
    });

    it("should return false for a grid with at least an invalid row", () => {
        expect(gridValidationManager.validateRows()).to.be.false;
    });

    it("should return false for a grid with at least an invalid column",
        () => {
            expect(gridValidationManager.validateColumns()).to.be.false;
        }
    );

    it("should return false for a grid with at least an invalid square", () => {
        expect(gridValidationManager.validateSquares()).to.be.false;
    });

    it("should return false for an invalid grid.", () => {
        expect(gridValidationManager.validateGrid()).to.be.false;
    });
});


describe("Grid Validation Manager - valid grid", () => {

    let gridValidationManager: GridValidationManager;

    beforeEach(() => {
        gridValidationManager = new GridValidationManager(GRID_VALID);
    });

    it("should return true for a valid row", () => {
        expect(gridValidationManager.hasNoRepeatedNumbersInRange(0, 0,
            Puzzle.MIN_COLUMN_INDEX, Puzzle.MAX_COLUMN_INDEX)).to.be.true;
    });

    it("should return true for a valid column", () => {
        expect(gridValidationManager.hasNoRepeatedNumbersInRange(Puzzle.MIN_ROW_INDEX, Puzzle.MAX_ROW_INDEX,
            0, 0)).to.be.true;
    });

    it("should return true for a valid square", () => {
        expect(gridValidationManager.hasNoRepeatedNumbersInRange(Puzzle.MIN_ROW_INDEX, Puzzle.SQUARE_LENGTH - 1,
            Puzzle.MIN_COLUMN_INDEX, Puzzle.SQUARE_LENGTH - 1)).to.be.true;
    });

    it("should return true for a grid with valid rows", () => {
        expect(gridValidationManager.validateRows()).to.be.true;
    });

    it("should return true for a grid with valid columns", () => {
        expect(gridValidationManager.validateColumns()).to.be.true;
    });

    it("should return true for a grid with valid squares", () => {
        expect(gridValidationManager.validateSquares()).to.be.true;
    });

    it("should return true for a valid grid", () => {
        expect(gridValidationManager.validateGrid()).to.be.true;
    });
});
