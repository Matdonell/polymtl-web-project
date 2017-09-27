import { SquarePosition } from "./square-position";
import { BoardRows } from "../board/board-rows";
import { BoardColumn } from "../board/board-column";

import { expect } from "chai";

let _row: string;
let _column: BoardColumn;
let _position: SquarePosition;

describe("SquarePosition object should", () => {
    beforeEach(() => {
        _row = BoardRows[BoardRows.A];
        _column = BoardColumn.FIRST_COLUMN;
        _position = new SquarePosition(_row, _column);
    });

    it("be an instance of SquarePosition", () => {
        expect(_position).to.be.an.instanceof(SquarePosition);
    });

    it("construct a square position correctly", () => {
        expect(_position.row).to.be.equal(_row);
        expect(_position.column).to.be.equal(_column);
    });
    it("get the row index correctly", () => {
        expect(_position.row).to.be.equal(_row);
    });
    it("set the row index correctly", () => {
        _row = BoardRows[BoardRows.B];
        _position.row = _row;
        expect(_position.row).to.be.equal(_row);
    });
    it("get the column index correctly", () => {
        expect(_position.column).to.be.equal(_column);
    });
    it("set the column index correctly", () => {
        _column = BoardColumn.SECOND_COLUMN;
        _position.column = _column;
        expect(_position.column).to.be.equal(_column);
    });
});
