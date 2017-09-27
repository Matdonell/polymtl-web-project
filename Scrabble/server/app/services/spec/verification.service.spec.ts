import { expect } from "chai";
import { VerificationService } from '../verification.service';
import { Board } from '../../models/board/board';
import { CommandsHelper } from "../commons/command/command-helper";
import { Letter } from "../../models/letter";
import { IPlaceWordResponse } from "../commons/command/place-word-response.interface";

let verificationService: VerificationService;

describe("Point calculation in verification services should ", () => {

    let board: Board;
    let score: number;
    const BONUS_DOUBLE = 2;
    const BONUS_TRIPLE = 3;
    const BONUS_WORD_7_LETTERS = 50;

    before(() => {
        board = new Board();
        score = 17;
    });

    afterEach(() => {
        board.resetLastLettersAdded();
    });

    it("create a new VerificationService", () => {
        expect(verificationService).to.be.undefined;
        verificationService = new VerificationService();
        expect(verificationService).to.not.be.undefined;
        expect(verificationService.score).to.equals(0);
    });

    it("get and set score", () => {
        expect(verificationService.score).to.equals(0);
        verificationService.score = score;
        expect(verificationService.score).to.equals(score);
    });

    it("create a string from an array of string", () => {
        let arrayStr = ["S", "C", "R", "A", "B", "B", "L", "E"];
        let word = verificationService.createStringFromArrayString(arrayStr);
        expect(word).to.be.length(arrayStr.length);
        expect(word).to.be.equals("SCRABBLE");
    });

    it(" apply a bonus when a seven letters word is placed", () => {
        board.addLastLetterAdded(7, 7);
        board.addLastLetterAdded(7, 8);
        board.addLastLetterAdded(7, 9);
        board.addLastLetterAdded(7, 10);
        board.addLastLetterAdded(7, 11);
        board.addLastLetterAdded(7, 12);
        board.addLastLetterAdded(7, 13);
        let newScore = verificationService.applyBonus7LettersWord(score, board);
        expect(newScore).to.be.equals(score + BONUS_WORD_7_LETTERS);
    });

    it(" not apply a bonus when a word with less than 7 letters is placed", () => {
        board.addLastLetterAdded(7, 7);
        board.addLastLetterAdded(7, 8);
        let newScore = verificationService.applyBonus7LettersWord(score, board);
        expect(newScore).to.be.equals(score);
    });

    it(" double the word score when it's a double bonus", () => {
        let newScore = verificationService.applyBonusDoubleOrTripleWord(score, true, false);
        expect(newScore).to.be.equals(score * BONUS_DOUBLE);
    });

    it(" triple the word score when it's a triple bonus", () => {
        let newScore = verificationService.applyBonusDoubleOrTripleWord(score, false, true);
        expect(newScore).to.be.equals(score * BONUS_TRIPLE);
    });

    it(" not increase the word score when there is no bonus", () => {
        let newScore = verificationService.applyBonusDoubleOrTripleWord(score, false, false);
        expect(newScore).to.be.equals(score);
    });

    it(" double the letter score when it's a on double letter bonus", () => {
        let letter = new Letter("A", 1, 0);
        board.squares[6][6].letter = letter;
        let newScore = verificationService.calculateScoreLetterInSquare(board.squares[6][6], true);
        expect(newScore).to.be.equals(letter.point * BONUS_DOUBLE);
    });

    it(" triple the letter score when it's a on triple letter bonus", () => {
        let letter = new Letter("A", 1, 0);
        board.squares[5][5].letter = letter;
        let newScore = verificationService.calculateScoreLetterInSquare(board.squares[5][5], true);
        expect(newScore).to.be.equals(letter.point * BONUS_TRIPLE);
    });

    it(" not increase the letter score when there is no bonus", () => {
        let letter = new Letter("A", 1, 0);
        board.squares[7][7].letter = letter;
        let newScore = verificationService.calculateScoreLetterInSquare(board.squares[7][7], true);
        expect(newScore).to.be.equals(letter.point);
    });

    it(" not increase the letter score when the letter on the square has been previiously placed.", () => {
        let letter = new Letter("A", 1, 0);
        board.squares[5][5].letter = letter;
        let newScore = verificationService.calculateScoreLetterInSquare(board.squares[5][5], false);
        expect(newScore).to.be.equals(letter.point);

    });
});


describe("Word discovery in verification services should ", () => {

    let board: Board;
    let score: number;

    before(() => {
        board = new Board();
        score = 17;
    });

    afterEach(() => {
        board.resetLastLettersAdded();
        board = new Board();
    });

    it("discover the right part of a word", () => {
        board.squares[7][7].letter = new Letter("J", 8, 0);
        board.squares[7][7].isBusy = true;
        board.squares[7][8].letter = new Letter("U", 1, 0);
        board.squares[7][8].isBusy = true;
        board.squares[7][9].letter = new Letter("M", 2, 0);
        board.squares[7][9].isBusy = true;
        board.squares[7][10].letter = new Letter("P", 3, 0);
        board.squares[7][10].isBusy = true;
        board.squares[7][11].letter = new Letter("M", 2, 0);
        board.squares[7][11].isBusy = true;
        board.squares[7][12].letter = new Letter("A", 1, 0);
        board.squares[7][12].isBusy = true;
        board.squares[7][13].letter = new Letter("N", 1, 0);
        board.squares[7][13].isBusy = true;
        let word = verificationService.discoverRightPartOfWord(board, board.squares[7][6]);
        expect(word).to.be.equals("JUMPMAN");
    });

    it("discover left part of a word", () => {
        board.squares[7][3].letter = new Letter("Y", 10, 0);
        board.squares[7][3].isBusy = true;
        board.squares[7][4].letter = new Letter("E", 1, 0);
        board.squares[7][4].isBusy = true;
        board.squares[7][5].letter = new Letter("E", 1, 0);
        board.squares[7][5].isBusy = true;
        board.squares[7][6].letter = new Letter("Z", 10, 0);
        board.squares[7][6].isBusy = true;
        board.squares[7][7].letter = new Letter("Y", 10, 0);
        board.squares[7][7].isBusy = true;
        let word = verificationService.discoverLeftPartOfWord(board, board.squares[7][8]);
        expect(word).to.be.equals("YEEZY");
    });

    it("discover top part of a word", () => {
        board.squares[4][7].letter = new Letter("S", 1, 0);
        board.squares[4][7].isBusy = true;
        board.squares[5][7].letter = new Letter("P", 3, 0);
        board.squares[5][7].isBusy = true;
        board.squares[6][7].letter = new Letter("L", 1, 0);
        board.squares[6][7].isBusy = true;
        board.squares[7][7].letter = new Letter("Y", 10, 0);
        board.squares[7][7].isBusy = true;
        let word = verificationService.discoverTopPartOfWord(board, board.squares[8][7]);
        expect(word).to.be.equals("SPLY");
    });

    it("discover down part of a word", () => {
        board.squares[7][7].letter = new Letter("K", 10, 0);
        board.squares[7][7].isBusy = true;
        board.squares[8][7].letter = new Letter("D", 2, 0);
        board.squares[8][7].isBusy = true;
        board.squares[9][7].letter = new Letter("O", 1, 0);
        board.squares[9][7].isBusy = true;
        board.squares[10][7].letter = new Letter("T", 1, 0);
        board.squares[10][7].isBusy = true;
        let word = verificationService.discoverDownPartOfWord(board, board.squares[6][7]);
        expect(word).to.be.equals("KDOT");
    });

    it("return false on a fake word", () => {
        board.squares[3][7].letter = new Letter("K", 10, 0);
        board.squares[3][7].isBusy = true;
        board.squares[4][7].letter = new Letter("A", 1, 0);
        board.squares[4][7].isBusy = true;
        board.squares[5][7].letter = new Letter("N", 1, 0);
        board.squares[5][7].isBusy = true;
        board.squares[6][7].letter = new Letter("Y", 10, 0);
        board.squares[6][7].isBusy = true;
        board.squares[7][7].letter = new Letter("E", 1, 0);
        board.squares[7][7].isBusy = true;
        let wordTop = verificationService.discoverTopPartOfWord(board, board.squares[8][7]);
        board.squares[8][7].letter = new Letter("W", 10, 0);
        board.squares[8][7].isBusy = true;
        board.squares[9][7].letter = new Letter("E", 1, 0);
        board.squares[9][7].isBusy = true;
        board.squares[10][7].letter = new Letter("S", 1, 0);
        board.squares[10][7].isBusy = true;
        board.squares[11][7].letter = new Letter("T", 1, 0);
        board.squares[11][7].isBusy = true;
        let wordDown = verificationService.discoverDownPartOfWord(board, board.squares[7][7]);
        expect(wordTop + wordDown).to.be.equals("KANYEWEST");
        expect(verificationService.verifyIfWordExistAndSetScore(wordTop + wordDown, 0)).to.be.false;
    });

});


describe("Word verification in verification services should ", () => {

    let board: Board;
    let score: number;

    const BONUS_DOUBLE = 2;
    const BONUS_TRIPLE = 3;

    before(() => {
        board = new Board();
        score = 0;
    });

    afterEach(() => {
        board.resetLastLettersAdded();
        board = new Board();
        verificationService.score = 0;
    });

    it("return true on a real word", () => {
        board.squares[5][7].letter = new Letter("C", 3, 0);
        board.squares[5][7].isBusy = true;
        board.squares[6][7].letter = new Letter("A", 1, 0);
        board.squares[6][7].isBusy = true;
        board.squares[7][7].letter = new Letter("R", 1, 0);
        board.squares[7][7].isBusy = true;
        let wordTop = verificationService.discoverTopPartOfWord(board, board.squares[8][7]);
        expect(verificationService.verifyIfWordExistAndSetScore(wordTop, 0)).to.be.true;
    });

    it("return false on a fake word", () => {
        board.squares[3][7].letter = new Letter("K", 10, 0);
        board.squares[3][7].isBusy = true;
        board.squares[4][7].letter = new Letter("A", 1, 0);
        board.squares[4][7].isBusy = true;
        board.squares[5][7].letter = new Letter("N", 1, 0);
        board.squares[5][7].isBusy = true;
        board.squares[6][7].letter = new Letter("Y", 10, 0);
        board.squares[6][7].isBusy = true;
        board.squares[7][7].letter = new Letter("E", 1, 0);
        board.squares[7][7].isBusy = true;
        let wordTop = verificationService.discoverTopPartOfWord(board, board.squares[8][7]);
        board.squares[8][7].letter = new Letter("W", 10, 0);
        board.squares[8][7].isBusy = true;
        board.squares[9][7].letter = new Letter("E", 1, 0);
        board.squares[9][7].isBusy = true;
        board.squares[10][7].letter = new Letter("S", 1, 0);
        board.squares[10][7].isBusy = true;
        board.squares[11][7].letter = new Letter("T", 1, 0);
        board.squares[11][7].isBusy = true;
        let wordDown = verificationService.discoverDownPartOfWord(board, board.squares[7][7]);
        expect(wordTop + wordDown).to.be.equals("KANYEWEST");
        expect(verificationService.verifyIfWordExistAndSetScore(wordTop + wordDown, 0)).to.be.false;
    });

    it("--HORIZONTAL return points without multipliers on a double multiplier when it is not a newly placed word",
        () => {
            board.squares[4][10].letter = new Letter("C", 3, 0);
            board.squares[4][10].isBusy = true;
            board.squares[4][11].letter = new Letter("A", 1, 0);
            board.squares[4][11].isBusy = true;
            board.squares[4][12].letter = new Letter("R", 1, 0);
            board.squares[4][12].isBusy = true;
            let wordTop = verificationService.verifyWordHorizontal(board, 4, 10, "CAR");
            expect(verificationService.score).to.be.equals((board.squares[4][10].letter.point +
                board.squares[4][11].letter.point + board.squares[4][12].letter.point));
            expect(wordTop).to.be.equals(true);
        });


    it("--HORIZONTAL return points with multipliers on a double word", () => {
        board.squares[4][10].letter = new Letter("C", 3, 0);
        board.squares[4][10].isBusy = true;
        board.addLastLetterAdded(4, 10);
        board.squares[4][11].letter = new Letter("A", 1, 0);
        board.squares[4][11].isBusy = true;
        board.addLastLetterAdded(4, 11);
        board.squares[4][12].letter = new Letter("R", 1, 0);
        board.squares[4][12].isBusy = true;
        board.addLastLetterAdded(4, 12);
        let wordTop = verificationService.verifyWordHorizontal(board, 4, 10, "CAR");
        expect(verificationService.score).to.be.equals((board.squares[4][10].letter.point +
            board.squares[4][11].letter.point + board.squares[4][12].letter.point) * BONUS_DOUBLE);
        expect(wordTop).to.be.equals(true);
    });

    it("--HORIZONTAL return points without multipliers on a triple word when it is not a newly placed word", () => {
        board.squares[0][6].letter = new Letter("C", 3, 0);
        board.squares[0][6].isBusy = true;
        board.squares[0][7].letter = new Letter("A", 1, 0);
        board.squares[0][7].isBusy = true;
        board.squares[0][8].letter = new Letter("R", 1, 0);
        board.squares[0][8].isBusy = true;
        let wordTop = verificationService.verifyWordHorizontal(board, 0, 6, "CAR");
        expect(verificationService.score).to.be.equals((board.squares[0][6].letter.point +
            board.squares[0][7].letter.point + board.squares[0][8].letter.point));
        expect(wordTop).to.be.equals(true);
    });

    it("--HORIZONTAL return points with multipliers on a triple word", () => {
        board.squares[0][6].letter = new Letter("C", 3, 0);
        board.squares[0][6].isBusy = true;
        board.addLastLetterAdded(0, 6);
        board.squares[0][7].letter = new Letter("A", 1, 0);
        board.squares[0][7].isBusy = true;
        board.addLastLetterAdded(0, 7);
        board.squares[0][8].letter = new Letter("R", 1, 0);
        board.squares[0][8].isBusy = true;
        board.addLastLetterAdded(0, 8);
        let wordTop = verificationService.verifyWordHorizontal(board, 0, 6, "CAR");
        expect(verificationService.score).to.be.equals((board.squares[0][6].letter.point +
            board.squares[0][7].letter.point + board.squares[0][8].letter.point) * BONUS_TRIPLE);
        expect(wordTop).to.be.equals(true);
    });

    it("--VERTICAL return points without multipliers on a triple word when it is not a newly placed word", () => {
        board.squares[4][10].letter = new Letter("C", 3, 0);
        board.squares[4][10].isBusy = true;
        board.squares[5][10].letter = new Letter("A", 1, 0);
        board.squares[5][10].isBusy = true;
        board.squares[6][10].letter = new Letter("R", 1, 0);
        board.squares[6][10].isBusy = true;
        let wordTop = verificationService.verifyWordVertical(board, 4, 10, "CAR");
        expect(verificationService.score).to.be.equals((board.squares[4][10].letter.point +
            board.squares[5][10].letter.point + board.squares[6][10].letter.point));
        expect(wordTop).to.be.equals(true);
    });

    it("--VERTICAL return points with multipliers on a double word", () => {
        board.squares[4][10].letter = new Letter("C", 3, 0);
        board.squares[4][10].isBusy = true;
        board.addLastLetterAdded(4, 10);
        board.squares[5][10].letter = new Letter("A", 1, 0);
        board.squares[5][10].isBusy = true;
        board.addLastLetterAdded(5, 10);
        board.squares[6][10].letter = new Letter("R", 1, 0);
        board.squares[6][10].isBusy = true;
        board.addLastLetterAdded(6, 10);
        let wordTop = verificationService.verifyWordVertical(board, 4, 10, "CAR");
        expect(verificationService.score).to.be.equals((board.squares[4][10].letter.point +
            board.squares[5][10].letter.point + board.squares[6][10].letter.point) * BONUS_DOUBLE);
        expect(wordTop).to.be.equals(true);
    });

    it("--VERTICAL return points without multipliers on a triple word when it is not a newly placed word", () => {
        board.squares[0][7].letter = new Letter("C", 3, 0);
        board.squares[0][7].isBusy = true;
        board.squares[1][7].letter = new Letter("A", 1, 0);
        board.squares[1][7].isBusy = true;
        board.squares[2][7].letter = new Letter("R", 1, 0);
        board.squares[2][7].isBusy = true;
        let wordTop = verificationService.verifyWordVertical(board, 0, 7, "CAR");
        expect(verificationService.score).to.be.equals((board.squares[0][7].letter.point +
            board.squares[1][7].letter.point + board.squares[2][7].letter.point));
        expect(wordTop).to.be.equals(true);
    });

    it("--VERTICAL return points with multipliers on a triple word", () => {
        board.squares[0][7].letter = new Letter("C", 3, 0);
        board.squares[0][7].isBusy = true;
        board.addLastLetterAdded(0, 7);
        board.squares[1][7].letter = new Letter("A", 1, 0);
        board.squares[1][7].isBusy = true;
        board.addLastLetterAdded(1, 7);
        board.squares[2][7].letter = new Letter("R", 1, 0);
        board.squares[2][7].isBusy = true;
        board.addLastLetterAdded(2, 7);
        let wordTop = verificationService.verifyWordVertical(board, 0, 7, "CAR");
        expect(verificationService.score).to.be.equals((board.squares[0][7].letter.point +
            board.squares[1][7].letter.point + board.squares[2][7].letter.point) * BONUS_TRIPLE);
        expect(wordTop).to.be.equals(true);
    });

    it("HORIZONTAL verify created words and correctly calculate score dependant on orientation", () => {
        let arrayStr = ["C", "A", "R"];
        board.squares[6][7].letter = new Letter("C", 3, 0);
        board.squares[6][7].isBusy = true;
        board.squares[8][7].letter = new Letter("R", 1, 0);
        board.squares[8][7].isBusy = true;

        board.squares[7][6].letter = new Letter("C", 3, 0);
        board.squares[7][6].isBusy = true;
        board.squares[7][7].letter = new Letter("A", 1, 0);
        board.squares[7][7].isBusy = true;
        board.squares[7][8].letter = new Letter("R", 1, 0);
        board.squares[7][8].isBusy = true;
        board.addLastLetterAdded(7, 6);
        board.addLastLetterAdded(7, 7);
        board.addLastLetterAdded(7, 8);
        let response: IPlaceWordResponse = {
            _squarePosition: {
                _row: "H",
                _column: 7,
            },
            _letters: arrayStr,
            _wordOrientation: CommandsHelper.HORIZONTAL_ORIENTATION
        };
        verificationService.verifyWordsCreated(response, board);

        expect(verificationService.score).to.be.equals(15);
    });

    it("VERTICAL verify created words and correctly calculate score dependant on orientation", () => {
        let arrayStr = ["C", "A", "R"];
        board.squares[7][6].letter = new Letter("C", 3, 0);
        board.squares[7][6].isBusy = true;
        board.squares[7][8].letter = new Letter("R", 1, 0);
        board.squares[7][8].isBusy = true;

        board.squares[6][7].letter = new Letter("C", 3, 0);
        board.squares[6][7].isBusy = true;
        board.squares[7][7].letter = new Letter("A", 1, 0);
        board.squares[7][7].isBusy = true;
        board.squares[8][7].letter = new Letter("R", 1, 0);
        board.squares[8][7].isBusy = true;
        board.addLastLetterAdded(6, 7);
        board.addLastLetterAdded(7, 7);
        board.addLastLetterAdded(8, 7);

        let response: IPlaceWordResponse = {
            _squarePosition: {
                _row: "G",
                _column: 8,
            },
            _letters: arrayStr,
            _wordOrientation: CommandsHelper.VERTICAL_ORIENTATION
        };
        verificationService.verifyWordsCreated(response, board);

        expect(verificationService.score).to.be.equals(15);
    });
});
