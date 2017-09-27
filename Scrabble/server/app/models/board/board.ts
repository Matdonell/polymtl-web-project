import { BoardRows } from "./board-rows";
import { BoardColumn } from "./board-column";
import { Square } from "../square/square";
import { Letter } from "../letter";
import { SquarePosition } from "../square/square-position";
import { SquareType } from "../square/square-type";
import { LetterHelper } from "../commons/letter-helper";
import { BoardHelper } from "../../services/board/board-helper";
import { VerificationService } from "../../services/verification.service";

const BOARD_SIZE = 15;

export class Board {
    private _squares: Array<Array<Square>>;
    private _isEmpty: boolean;
    private _lastLettersAdded: Array<SquarePosition>;
    private _verificationService: VerificationService;

    constructor() {
        this._squares = new Array<Array<Square>>();
        this._verificationService = new VerificationService();
        this.generateBoard();
        this.assignTypesToSquares();
        this._isEmpty = true;
        this._lastLettersAdded = new Array<SquarePosition>();
    }

    public get verificationService(): VerificationService {
        return this._verificationService;
    }

    public get lastLettersAdded(): Array<SquarePosition> {
        return this._lastLettersAdded;
    }

    public set lastLettersAdded(v: Array<SquarePosition>) {
        this._lastLettersAdded = v;
    }

    public resetLastLettersAdded() {
        this._lastLettersAdded.splice(0, this.lastLettersAdded.length);
    }

    public removeLastLettersAddedFromBoard(): Array<Letter> {
        let removedLetters = new Array<Letter>();
        for (let index = 0; index < this._lastLettersAdded.length; index++) {
            let rowIndex = BoardHelper.convertCharToIndex(this._lastLettersAdded[index].row);
            let columnIndex = this._lastLettersAdded[index].column - 1;
            let letter = this._squares[rowIndex][columnIndex].letter;
            removedLetters.push(letter);
            this._squares[rowIndex][columnIndex].letter = new Letter("", 0, 0);
            this._squares[rowIndex][columnIndex].squareValue = this._squares[rowIndex][columnIndex].type.toString();
        }
        this.resetLastLettersAdded();
        return removedLetters;
    }

    public addLastLetterAdded(rowIndex: number, columnIndex: number) {
        this._lastLettersAdded.push(
            new SquarePosition(
                BoardHelper.parseFromNumberToCharacter(rowIndex + LetterHelper.LETTER_A_KEY_CODE),
                columnIndex + 1)
        );
    }

    public get isEmpty(): boolean {
        return this._isEmpty;
    }
    public set isEmpty(v: boolean) {
        this._isEmpty = v;
    }

    public get squares(): Array<Array<Square>> {
        return this._squares;
    }

    private generateBoard(): void {
        let row: number;
        let colomn: number;
        let innerRow: Array<Square>;

        for (row = 1; row <= BOARD_SIZE; row++) {
            innerRow = new Array<Square>();
            for (colomn = BoardColumn.FIRST_COLUMN; colomn <= BOARD_SIZE; colomn++) {
                innerRow.push(new Square(new SquarePosition(BoardRows[row], colomn), SquareType.NORMAL));
            }
            this.squares.push(innerRow);
        }
    }

    private assignTypesToSquares(): void {
        this.assignStarToSquare();
        this.assignTripleWordCountToSquare();
        this.assignDoubleWordCountToSquare();
        this.assignTripleLetterCountToSquare();
        this.assignDoubleLetterCountToSquare();
    }

    private assignStarToSquare(): void {
        this.squares[7][7].squareValue = SquareType.STAR;
    }

    private assignTripleWordCountToSquare<T>(): void {
        this.squares[0][0].type = SquareType.TRIPLE_WORD_COUNT;
        this.squares[0][7].type = SquareType.TRIPLE_WORD_COUNT;
        this.squares[0][14].type = SquareType.TRIPLE_WORD_COUNT;
        this.squares[7][0].type = SquareType.TRIPLE_WORD_COUNT;
        this.squares[7][14].type = SquareType.TRIPLE_WORD_COUNT;
        this.squares[14][0].type = SquareType.TRIPLE_WORD_COUNT;
        this.squares[14][7].type = SquareType.TRIPLE_WORD_COUNT;
        this.squares[14][14].type = SquareType.TRIPLE_WORD_COUNT;

        this.squares[0][0].squareValue = SquareType.TRIPLE_WORD_COUNT;
        this.squares[0][7].squareValue = SquareType.TRIPLE_WORD_COUNT;
        this.squares[0][14].squareValue = SquareType.TRIPLE_WORD_COUNT;
        this.squares[7][0].squareValue = SquareType.TRIPLE_WORD_COUNT;
        this.squares[7][14].squareValue = SquareType.TRIPLE_WORD_COUNT;
        this.squares[14][0].squareValue = SquareType.TRIPLE_WORD_COUNT;
        this.squares[14][7].squareValue = SquareType.TRIPLE_WORD_COUNT;
        this.squares[14][14].squareValue = SquareType.TRIPLE_WORD_COUNT;
    }

    private assignDoubleWordCountToSquare(): void {
        this.squares[1][1].type = SquareType.DOUBLE_WORD_COUNT;
        this.squares[1][13].type = SquareType.DOUBLE_WORD_COUNT;
        this.squares[2][2].type = SquareType.DOUBLE_WORD_COUNT;
        this.squares[2][12].type = SquareType.DOUBLE_WORD_COUNT;
        this.squares[3][3].type = SquareType.DOUBLE_WORD_COUNT;
        this.squares[3][11].type = SquareType.DOUBLE_WORD_COUNT;
        this.squares[4][4].type = SquareType.DOUBLE_WORD_COUNT;
        this.squares[7][7].type = SquareType.DOUBLE_WORD_COUNT;
        this.squares[4][10].type = SquareType.DOUBLE_WORD_COUNT;
        this.squares[10][4].type = SquareType.DOUBLE_WORD_COUNT;
        this.squares[10][10].type = SquareType.DOUBLE_WORD_COUNT;
        this.squares[11][11].type = SquareType.DOUBLE_WORD_COUNT;
        this.squares[11][3].type = SquareType.DOUBLE_WORD_COUNT;
        this.squares[12][2].type = SquareType.DOUBLE_WORD_COUNT;
        this.squares[12][12].type = SquareType.DOUBLE_WORD_COUNT;
        this.squares[13][1].type = SquareType.DOUBLE_WORD_COUNT;
        this.squares[13][13].type = SquareType.DOUBLE_WORD_COUNT;

        this.squares[1][1].squareValue = SquareType.DOUBLE_WORD_COUNT;
        this.squares[1][13].squareValue = SquareType.DOUBLE_WORD_COUNT;
        this.squares[2][2].squareValue = SquareType.DOUBLE_WORD_COUNT;
        this.squares[2][12].squareValue = SquareType.DOUBLE_WORD_COUNT;
        this.squares[3][3].squareValue = SquareType.DOUBLE_WORD_COUNT;
        this.squares[3][11].squareValue = SquareType.DOUBLE_WORD_COUNT;
        this.squares[4][4].squareValue = SquareType.DOUBLE_WORD_COUNT;
        this.squares[4][10].squareValue = SquareType.DOUBLE_WORD_COUNT;
        this.squares[10][4].squareValue = SquareType.DOUBLE_WORD_COUNT;
        this.squares[10][10].squareValue = SquareType.DOUBLE_WORD_COUNT;
        this.squares[11][11].squareValue = SquareType.DOUBLE_WORD_COUNT;
        this.squares[11][3].squareValue = SquareType.DOUBLE_WORD_COUNT;
        this.squares[12][2].squareValue = SquareType.DOUBLE_WORD_COUNT;
        this.squares[12][12].squareValue = SquareType.DOUBLE_WORD_COUNT;
        this.squares[13][1].squareValue = SquareType.DOUBLE_WORD_COUNT;
        this.squares[13][13].squareValue = SquareType.DOUBLE_WORD_COUNT;
    }

    private assignTripleLetterCountToSquare(): void {
        this.squares[1][5].type = SquareType.TRIPLE_LETTER_COUNT;
        this.squares[1][9].type = SquareType.TRIPLE_LETTER_COUNT;
        this.squares[5][1].type = SquareType.TRIPLE_LETTER_COUNT;
        this.squares[5][5].type = SquareType.TRIPLE_LETTER_COUNT;
        this.squares[5][9].type = SquareType.TRIPLE_LETTER_COUNT;
        this.squares[5][13].type = SquareType.TRIPLE_LETTER_COUNT;
        this.squares[9][1].type = SquareType.TRIPLE_LETTER_COUNT;
        this.squares[9][5].type = SquareType.TRIPLE_LETTER_COUNT;
        this.squares[9][9].type = SquareType.TRIPLE_LETTER_COUNT;
        this.squares[9][13].type = SquareType.TRIPLE_LETTER_COUNT;
        this.squares[13][5].type = SquareType.TRIPLE_LETTER_COUNT;
        this.squares[13][9].type = SquareType.TRIPLE_LETTER_COUNT;

        this.squares[1][5].squareValue = SquareType.TRIPLE_LETTER_COUNT;
        this.squares[1][9].squareValue = SquareType.TRIPLE_LETTER_COUNT;
        this.squares[5][1].squareValue = SquareType.TRIPLE_LETTER_COUNT;
        this.squares[5][5].squareValue = SquareType.TRIPLE_LETTER_COUNT;
        this.squares[5][9].squareValue = SquareType.TRIPLE_LETTER_COUNT;
        this.squares[5][13].squareValue = SquareType.TRIPLE_LETTER_COUNT;
        this.squares[9][1].squareValue = SquareType.TRIPLE_LETTER_COUNT;
        this.squares[9][5].squareValue = SquareType.TRIPLE_LETTER_COUNT;
        this.squares[9][9].squareValue = SquareType.TRIPLE_LETTER_COUNT;
        this.squares[9][13].squareValue = SquareType.TRIPLE_LETTER_COUNT;
        this.squares[13][5].squareValue = SquareType.TRIPLE_LETTER_COUNT;
        this.squares[13][9].squareValue = SquareType.TRIPLE_LETTER_COUNT;
    }

    private assignDoubleLetterCountToSquare(): void {
        this.squares[0][3].type = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[0][11].type = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[2][6].type = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[2][8].type = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[3][0].type = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[3][7].type = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[3][14].type = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[6][2].type = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[6][6].type = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[6][8].type = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[6][12].type = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[7][3].type = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[7][11].type = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[8][2].type = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[8][6].type = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[8][8].type = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[8][12].type = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[11][0].type = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[11][7].type = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[11][14].type = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[12][6].type = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[12][8].type = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[14][3].type = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[14][11].type = SquareType.DOUBLE_LETTER_COUNT;

        this.squares[0][3].squareValue = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[0][11].squareValue = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[2][6].squareValue = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[2][8].squareValue = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[3][0].squareValue = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[3][7].squareValue = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[3][14].squareValue = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[6][2].squareValue = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[6][12].squareValue = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[6][6].squareValue = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[6][8].squareValue = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[7][3].squareValue = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[7][11].squareValue = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[8][2].squareValue = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[8][6].squareValue = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[8][8].squareValue = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[8][12].squareValue = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[11][0].squareValue = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[11][7].squareValue = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[11][14].squareValue = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[12][6].squareValue = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[12][8].squareValue = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[14][3].squareValue = SquareType.DOUBLE_LETTER_COUNT;
        this.squares[14][11].squareValue = SquareType.DOUBLE_LETTER_COUNT;
    }
}
