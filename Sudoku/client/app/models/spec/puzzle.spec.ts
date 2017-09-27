import { assert, expect } from "chai";

import { IPuzzleItemData, Puzzle, PuzzleItem } from "../../models/puzzle";

import { INVALID_PUZZLE_ITEMS_DATA_1, INVALID_PUZZLE_ITEMS_DATA_2,
         INITIAL_PUZZLE_SEED, PUZZLE_ITEMS_DATA } from "../../services/mock-data";

describe("Puzzle", () => {

    it("should transform object to Puzzle", () => {
        expect(() => { Puzzle.convertObjectToPuzzle(PUZZLE_ITEMS_DATA); }).to.not.throw(Error);
    });

    it("should not transform object to Puzzle", () => {
        expect(() => { Puzzle.convertObjectToPuzzle(INVALID_PUZZLE_ITEMS_DATA_1); }).to.throw(TypeError);
        expect(() => { Puzzle.convertObjectToPuzzle(INVALID_PUZZLE_ITEMS_DATA_2); }).to.throw(TypeError);
    });

   // Testing puzzle constructor
   it("should initialize grid to INITIAL_PUZZLE_SEED", () => {
       let puzzle: Puzzle = new Puzzle(INITIAL_PUZZLE_SEED);
       assert(puzzle._puzzle === INITIAL_PUZZLE_SEED, "Error constructing puzzle");
   });

   // Testing Puzzle item.
   it("should create a PuzzleItem that contains 3 and is hidden", () => {
       // Must be completed
       let item: PuzzleItem = new PuzzleItem(3, true);

       // Check the expected result
       assert(item._hide === true, "Should be hidden");
       assert(item._value === 3, "Should contain the number 3");
   });
});
