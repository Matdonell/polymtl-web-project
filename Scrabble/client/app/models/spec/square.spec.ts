// import { SquarePosition } from "./square-position";
// import { BoardRows } from "../board/board-rows";
// import { BoardColumn } from "../board/board-column";
// import { SquareType } from "./square-type";
// import { ScrabbleLetter } from "../letter/scrabble-letter";
// import { Alphabet } from "../letter/alphabet";
// import { Square } from "./square";
// import { expect } from "chai";

// let _square: Square;
// let _letter: ScrabbleLetter;
// let _position: SquarePosition;
// let _type: SquareType;

// describe("Square object should", () => {
//     beforeEach(() => {
//         _position = new SquarePosition(BoardRows[BoardRows.H], BoardColumn.EIGHT_COLUMN);
//         _type = SquareType.STAR;
//         _square = new Square(_position, _type);
//     });

//     it("should be an instance of Square", () => {
//         expect(_square).to.be.an.instanceof(Square);
//     });

//     it("construct a square correctly", () => {
//         expect(_square.letter).to.be.null;
//         expect(_square.position).to.be.equal(_position);
//         expect(_square.type).to.be.equal(_type);
//     });
//     it("get the alphabet letter correctly", () => {
//         expect(_square.letter).to.be.null;
//     });
//     it("set the alphabet letter corectly", () => {
//         _letter = new ScrabbleLetter(Alphabet.LETTER_D);
//         _square.letter = _letter;
//         expect(_square.letter).to.be.equal(_letter);
//     });
//     it("get the position of a square corectly", () => {
//         expect(_square.position).to.be.equal(_position);
//     });
//     it("set the position of a square corectly", () => {
//         _position = new SquarePosition(BoardRows[BoardRows.B], BoardColumn.SECOND_COLUMN);
//         _square.position = _position;
//         expect(_square.position).to.be.equal(_position);
//     });
//     it("get the type of a square corectly", () => {
//         expect(_square.type).to.be.equal(SquareType.STAR);
//     });
//     it("set the score of the player corectly", () => {
//         _type = SquareType.NORMAL;
//         _square.type = _type;
//         expect(_square.type).to.be.equal(_type);
//     });
// });
