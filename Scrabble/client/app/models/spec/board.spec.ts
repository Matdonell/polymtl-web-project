// import { Board } from "../board";
// import { Square } from "./../../../../server/app/models/square/square";
// import { BoardRows } from "./../../../../server/app/models/board/board-rows";
// import { BoardColumn } from "./../../../../server/app/models/board/board-column";
// import { SquarePosition } from "./../../../../server/app/models/square/square-position";
// import { SquareType } from "./../../../../server/app/models/square/square-type";
// import { expect } from "chai";

// describe("Board object should", () => {

//     let _board: Board;
//     let _serverBoard: Array<Array<Square>>;

//     beforeEach(() => {
//         _serverBoard = new Array<Array<Square>>();
//         let innerRow: Array<Square>;

//         for (let row = 0; row < 15; row++) {
//             innerRow = new Array<Square>();
//             for (let colomn = 0; colomn < 15; colomn++) {
//                 innerRow.push(new Square(new SquarePosition(BoardRows[row], colomn), SquareType.NORMAL));
//             }
//             _serverBoard.push(innerRow);
//         }
//         _board = new Board(_serverBoard);
//     });

//     it("construct a board correctly", () => {
//         console.log(_board.squares.length);
//         expect(_board.squares).to.have.lengthOf(15);
//         console.log(_board.squares[0].length);
//         expect(_board.squares[0]).to.have.lengthOf(15);
//     });

//     it("get the board correctly", () => {
//         let _fakeBoard = new Board(_serverBoard);
//         expect(_board).to.be.deep.equals(_fakeBoard);
//     });
// });
