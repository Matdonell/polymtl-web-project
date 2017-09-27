import { expect } from "chai";
import { NumbersInHoles, FittingNumbers } from "../numbers-in-holes.service";
import { Puzzle } from "../../models/puzzle/puzzle";

function setNoSolutionsConfiguration(puzzle: Puzzle) {
    puzzle.hideAllItemsInRange(Puzzle.MIN_ROW_INDEX, Puzzle.MAX_ROW_INDEX
        , Puzzle.MIN_COLUMN_INDEX, Puzzle.MAX_COLUMN_INDEX);
    puzzle.setPuzzleTileVisibility(3, 2, false);
    puzzle.setPuzzleTileValue(3, 2, 3);
    puzzle.setPuzzleTileVisibility(0, 0, false);
    puzzle.setPuzzleTileValue(0, 0, 1);
    puzzle.setPuzzleTileVisibility(0, 1, false);
    puzzle.setPuzzleTileValue(0, 1, 2);
    puzzle.setPuzzleTileVisibility(1, 0, false);
    puzzle.setPuzzleTileValue(1, 0, 4);
    puzzle.setPuzzleTileVisibility(1, 1, false);
    puzzle.setPuzzleTileValue(1, 1, 5);
    puzzle.setPuzzleTileVisibility(1, 2, false);
    puzzle.setPuzzleTileValue(1, 2, 6);
    puzzle.setPuzzleTileVisibility(2, 0, false);
    puzzle.setPuzzleTileValue(2, 0, 7);
    puzzle.setPuzzleTileVisibility(2, 1, false);
    puzzle.setPuzzleTileValue(2, 1, 8);
    puzzle.setPuzzleTileVisibility(2, 2, false);
    puzzle.setPuzzleTileValue(2, 2, 9);
}

describe("NumbersInHoles constructor should", () => {

    it("throw an error with invalid parameter", () => {
        expect(() => { new NumbersInHoles(null); }).to.throw(Error);
    });

    it("create an object NumbersInHoles", () => {
        let numbersInHoles = new NumbersInHoles(new Puzzle());
        expect(numbersInHoles).to.be.instanceof(NumbersInHoles);
    });
});

describe("NumbersInHoles should", () => {

    let numbersInHoles: NumbersInHoles;
    let puzzle: Puzzle;
    beforeEach(() => {
        puzzle = new Puzzle();
        numbersInHoles = new NumbersInHoles(puzzle);
    });

    it("say there is one possible value at a tile when everything else is filled.", () => {
        puzzle.setPuzzleTileVisibility(2, 2, true);
        expect(numbersInHoles.findPossibleValuesAtAPosition(2, 2)).to.be.deep.equal([9]);
    });

    it("say there is only one possible number because of the numbers in a row", () => {
        puzzle.hideAllItemsInRange(1, Puzzle.MAX_ROW_INDEX
            , Puzzle.MIN_COLUMN_INDEX, Puzzle.MAX_COLUMN_INDEX);
        puzzle.setPuzzleTileVisibility(0, 2, true);
        expect(numbersInHoles.findPossibleValuesAtAPosition(0, 2)).to.deep.equal([3]);
    });

    it("say there is only one possible number because of the numbers in a column", () => {
        puzzle.hideAllItemsInRange(Puzzle.MIN_ROW_INDEX, Puzzle.MAX_ROW_INDEX
            , 1, Puzzle.MAX_COLUMN_INDEX);
        puzzle.setPuzzleTileVisibility(2, 0, true);
        expect(numbersInHoles.findPossibleValuesAtAPosition(2, 0)).to.deep.equal([7]);
    });

    it("say there is only one possible number because of the numbers in a square", () => {
        puzzle.hideAllItemsInRange(Puzzle.MIN_ROW_INDEX, Puzzle.MAX_ROW_INDEX
            , Puzzle.MIN_COLUMN_INDEX, Puzzle.MAX_COLUMN_INDEX);
        puzzle.setPuzzleTileVisibility(0, 0, false);
        puzzle.setPuzzleTileVisibility(0, 1, false);
        puzzle.setPuzzleTileVisibility(0, 2, false);
        puzzle.setPuzzleTileVisibility(1, 0, false);
        puzzle.setPuzzleTileVisibility(1, 1, false);
        puzzle.setPuzzleTileVisibility(2, 0, false);
        puzzle.setPuzzleTileVisibility(2, 1, false);
        puzzle.setPuzzleTileVisibility(2, 2, false);
        expect(numbersInHoles.findPossibleValuesAtAPosition(1, 2)).to.deep.equal([6]);
    });

    it("say there is no possible number to put", () => {
        setNoSolutionsConfiguration(puzzle);
        expect(numbersInHoles.findPossibleValuesAtAPosition(0, 2)).to.deep.equal([]);
    });

    it("say there are three possible numbers to put", () => {
        puzzle.hideAllItemsInRange(Puzzle.MIN_ROW_INDEX, Puzzle.MAX_ROW_INDEX
            , Puzzle.MIN_COLUMN_INDEX, Puzzle.MAX_COLUMN_INDEX);
        puzzle.setPuzzleTileVisibility(0, 0, false);
        puzzle.setPuzzleTileVisibility(0, 1, false);
        puzzle.setPuzzleTileVisibility(1, 2, false);
        puzzle.setPuzzleTileVisibility(2, 0, false);
        puzzle.setPuzzleTileVisibility(2, 1, false);
        puzzle.setPuzzleTileVisibility(2, 2, false);
        expect(numbersInHoles.findPossibleValuesAtAPosition(0, 2)).to.be.deep.equal([3, 4, 5]);
    });

    it("verify the number that fit in a single hole.", () => {
        puzzle.setPuzzleTileVisibility(2, 2, true);
        let numberFitting: FittingNumbers = { row: 2, column: 2, numbersThatFit: [9] };
        numbersInHoles.computeNumbersFittingInHoles();
        expect(numbersInHoles.getHoleWithLessPossibility()).to.be.deep.equal(numberFitting);
    });

    it("verify there are no possibilities", () => {
        setNoSolutionsConfiguration(puzzle);
        numbersInHoles.computeNumbersFittingInHoles();
        expect(numbersInHoles.allHolesHaveSolutions()).to.be.equal(false);
    });

    it("verify the numbers that fit for multiple holes.", () => {
        puzzle.setPuzzleTileVisibility(0, 0, true);
        puzzle.setPuzzleTileVisibility(0, 1, true);
        puzzle.setPuzzleTileVisibility(3, 0, true);
        puzzle.setPuzzleTileVisibility(8, 1, true);
        let numberFitting1: FittingNumbers = { row: 3, column: 0, numbersThatFit: [2] };
        let numberFitting2: FittingNumbers = { row: 0, column: 0, numbersThatFit: [1] };
        numbersInHoles.computeNumbersFittingInHoles();
        expect(numbersInHoles.allHolesHaveSolutions(), "It should have a solution.").to.be.equal(true);
        expect(numbersInHoles.haveAHoleWithOnePossibility(), "It should have a hole with one possibility.")
            .to.be.equal(true);
        expect(numbersInHoles.getHoleWithLessPossibility(), "Hole at 3, 0 with value 2 should have been returned.")
            .to.be.deep.equal(numberFitting1);
        puzzle.setPuzzleTileVisibility(3, 0, false);
        numbersInHoles.recomputeAfterNumberAdded(3, 0, 2);
        expect(numbersInHoles.allHolesHaveSolutions(), "It still should have a solution.").to.be.equal(true);
        expect(numbersInHoles.haveAHoleWithOnePossibility(), "It still should have a hole with one possibility.")
            .to.be.equal(true);
        expect(numbersInHoles.getHoleWithLessPossibility()).to.be.deep.equal(numberFitting2);
    });

    it("do a copy of the NumbersInHoles", () => {
        let puzzleCopy = new Puzzle(puzzle);
        let numbersInHolesCopy = numbersInHoles.copy(puzzleCopy);
        puzzleCopy.setPuzzleTileVisibility(0, 3, true);
        numbersInHolesCopy.computeNumbersFittingInHoles();
        let fittingNumber = numbersInHolesCopy.getHoleWithLessPossibility();
        expect(fittingNumber.row, "The row number is not the one expected.").to.be.equal(0);
        expect(fittingNumber.column, "The column number is not the one expected.").to.be.equal(3);
        expect(fittingNumber.numbersThatFit, "The number fitting is not the one expected.").to.be.deep.equal([4]);
        expect(numbersInHoles.getHoleWithLessPossibility, "The initial numbersInHoles must not have been calculated")
            .to.throw(Error);
    });

});
