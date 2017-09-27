import { assert } from "chai";
import { BoardHelper } from '../board/board-helper';
import { LetterHelper } from '../../models/commons/letter-helper';
import { CommandsHelper } from '../commons/command/command-helper';

describe("BoardHelper", () => {

    it("should detect values between A and O as a valid row position", () => {
        for (let row = LetterHelper.LETTER_A_KEY_CODE; row <= LetterHelper.LETTER_O_KEY_CODE; ++row) {
            assert(BoardHelper.isValidRowLetterPosition(row) === true);
        }
    });

    it("should detect the CharCode below 65 (A) as an invalid row position", () => {
        for (let row = 0; row < LetterHelper.LETTER_A_KEY_CODE; ++row) {
            assert(BoardHelper.isValidRowLetterPosition(row) === false);
        }
    });

    it("should detect the CharCode greater than 79 (O) as an invalid row position", () => {
        assert(BoardHelper.isValidRowLetterPosition(80) === false);
    });


    it("should detect values between 0 and 14 as a valid row index", () => {
        for (let row = CommandsHelper.MIN_BOARD_POSITION_INDEX - 1;
            row <= CommandsHelper.MAX_BOARD_POSITION_INDEX - 1; ++row) {
            assert(BoardHelper.isValidRowPosition(row) === true);
        }
    });

    it("should detect the index -1 as an invalid row index", () => {
        assert(BoardHelper.isValidRowPosition(-1) === false);
    });

    it("should detect the index 20 as an invalid row index", () => {
        assert(BoardHelper.isValidRowPosition(20) === false);
    });

    it("should detect values between 1 and 15 as a valid column position", () => {
        for (let column = CommandsHelper.MIN_BOARD_POSITION_INDEX - 1;
            column < CommandsHelper.MAX_BOARD_POSITION_INDEX; ++column) {
            assert(BoardHelper.isValidColumnPosition(column) === true);
        }
    });

    it("should detect negative value or greater than 14 as an valid column position", () => {
        assert(BoardHelper.isValidColumnPosition(-1) === false);
        assert(BoardHelper.isValidColumnPosition(15) === false);
    });

    it("should detect 'v' as a valid vertical orientation", () => {
        assert(BoardHelper.isValidOrientation('v') === true);
    });

    it("should detect 'h' as a valid horizontal orientation", () => {
        assert(BoardHelper.isValidOrientation('h') === true);
    });

    it("should detect 'd' as an invalid orientation", () => {
        assert(BoardHelper.isValidOrientation('d') === false);
    });

    it("should detect '2' as an invalid orientation", () => {
        assert(BoardHelper.isValidOrientation('2') === false);
    });

});
