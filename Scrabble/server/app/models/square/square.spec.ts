import { SquarePosition } from "./square-position";
import { BoardRows } from "../board/board-rows";
import { BoardColumn } from "../board/board-column";
import { SquareType } from "./square-type";
import { Letter } from "../letter";
import { Alphabet } from "../commons/alphabet";
import { AlphabetQuantity } from "../commons/alphabet-quantity";
import { Square } from "./square";
import { expect } from "chai";

let _square: Square;
let _letter: Letter;
let _position: SquarePosition;
let _type: string;

describe("Square object should", () => {
    beforeEach(() => {
        _position = new SquarePosition(BoardRows[BoardRows.H], BoardColumn.EIGHT_COLUMN);
        _type = SquareType.STAR;
        _square = new Square(_position, _type);
    });

    it("should be an instance of Square", () => {
        expect(_square).to.be.an.instanceof(Square);
    });

    it("construct a square correctly", () => {
        expect(_square.position).to.be.equal(_position);
        expect(_square.type).to.be.equal(_type);
        expect(_square.squareValue).to.be.equal(_type.toString());
    });

    it("set the alphabet letter corectly", () => {
        _letter = new Letter(Alphabet.letterD.letter, Alphabet.letterD.point, AlphabetQuantity.letterD);
        _square.letter = _letter;
        expect(_square.letter).to.be.equal(_letter);
    });
    it("get the position of a square corectly", () => {
        expect(_square.position).to.be.equal(_position);
    });
    it("set the position of a square corectly", () => {
        _position = new SquarePosition(BoardRows[BoardRows.B], BoardColumn.SECOND_COLUMN);
        _square.position = _position;
        expect(_square.position).to.be.equal(_position);
    });
    it("get the type of a square corectly", () => {
        expect(_square.type).to.be.equal(SquareType.STAR);
    });
    it("set the score of the player corectly", () => {
        _type = SquareType.NORMAL;
        _square.type = _type;
        expect(_square.type).to.be.equal(_type);
    });
});
