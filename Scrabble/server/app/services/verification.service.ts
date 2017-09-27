import { DictionnaryManager } from "../models/dictionnary-manager";
import { CommandsHelper } from "./commons/command/command-helper";
import { BoardHelper } from "./board/board-helper";
import { Board } from "../models/board/board";
import { SquareType } from "../models/square/square-type";
import { SquarePosition } from "../models/square/square-position";
import { Square } from "../models/square/square";
import { IPlaceWordResponse } from "./commons/command/place-word-response.interface";

const WORD_7_LETTERS = 7;
const BONUS_DOUBLE = 2;
const BONUS_TRIPLE = 3;
const BONUS_WORD_7_LETTERS = 50;
const INITIAL_SCORE = 0;

export class VerificationService {
    private _score: number;

    public get score(): number {
        return this._score;
    }
    public set score(score: number) {
        this._score = score;
    }

    constructor() {
        this._score = INITIAL_SCORE;
    }

    public verifyWordsCreated(response: IPlaceWordResponse, board: Board): boolean {
        this._score = 0;
        let areValidWords = true;

        let wordOrientation = response._wordOrientation;

        let firstRowIndex = BoardHelper.convertCharToIndex(response._squarePosition._row);
        let firstColumnIndex = response._squarePosition._column - 1;
        let initialWord = this.createStringFromArrayString(response._letters);

        if (wordOrientation === CommandsHelper.HORIZONTAL_ORIENTATION) {
            // verify the initial word
            let leftPartOfWord = this.discoverLeftPartOfWord(board, board.squares[firstRowIndex][firstColumnIndex]);
            let rightPartOfWord = this.discoverRightPartOfWord(board,
                board.squares[firstRowIndex][firstColumnIndex + initialWord.length - 1]);
            areValidWords = this.verifyWordHorizontal(board, firstRowIndex, firstColumnIndex,
                leftPartOfWord + initialWord + rightPartOfWord);
            board.lastLettersAdded.forEach((squarePosition: SquarePosition) => {
                let word = "";
                let rowIndex = BoardHelper.convertCharToIndex(squarePosition.row);
                let columnIndex = squarePosition.column - 1;
                let square = board.squares[rowIndex][columnIndex];
                let topPartOfWord = this.discoverTopPartOfWord(board, square);
                let downPartOfWord = this.discoverDownPartOfWord(board, square);
                word = topPartOfWord + square.letter.alphabetLetter + downPartOfWord;
                rowIndex -= topPartOfWord.length;
                areValidWords = areValidWords
                    && this.verifyWordVertical(board, rowIndex, columnIndex, word.toUpperCase());
            });

        } else if (wordOrientation === CommandsHelper.VERTICAL_ORIENTATION) {
            // verify the initial word
            let topPartOfWord = this.discoverTopPartOfWord(board, board.squares[firstRowIndex][firstColumnIndex]);
            let downPartOfWord = this.discoverDownPartOfWord(board,
                board.squares[firstRowIndex + initialWord.length - 1][firstColumnIndex]);
            areValidWords = this.verifyWordVertical(board, firstRowIndex, firstColumnIndex,
                topPartOfWord + initialWord + downPartOfWord);
            board.lastLettersAdded.forEach((squarePosition: SquarePosition) => {
                let word = "";
                let rowIndex = BoardHelper.convertCharToIndex(squarePosition.row);
                let columnIndex = squarePosition.column - 1;
                let square = board.squares[rowIndex][columnIndex];
                let leftPartOfWord = this.discoverLeftPartOfWord(board, square);
                let rightPartOfWord = this.discoverRightPartOfWord(board, square);
                word = leftPartOfWord + square.letter.alphabetLetter + rightPartOfWord;
                columnIndex -= leftPartOfWord.length;
                areValidWords = areValidWords
                    && this.verifyWordHorizontal(board, rowIndex, columnIndex, word.toUpperCase());
            });
        }
        return areValidWords;
    }

    public verifyWordHorizontal(board: Board, rowIndex: number, firstColumnIndex: number, word: string): boolean {
        let indexLastLettersAdded = 0;
        let scoreWord = 0;
        let isWordDouble = false;
        let isWordTriple = false;

        for (let indexOffset = 0; indexOffset < word.length; indexOffset++) {
            let square = board.squares[rowIndex][firstColumnIndex + indexOffset];

            let isSquareNewLetter =
                board.lastLettersAdded[indexLastLettersAdded] !== undefined
                && board.lastLettersAdded[indexLastLettersAdded].column - 1 === firstColumnIndex + indexOffset
                && BoardHelper.convertCharToIndex(board.lastLettersAdded[indexLastLettersAdded].row) === rowIndex;
            indexLastLettersAdded += (isSquareNewLetter) ? 1 : 0;

            scoreWord += this.calculateScoreLetterInSquare(square, isSquareNewLetter);
            if (isSquareNewLetter && square.type === SquareType.DOUBLE_WORD_COUNT) {
                isWordDouble = true;
            }
            else if (isSquareNewLetter && square.type === SquareType.TRIPLE_WORD_COUNT) {
                isWordTriple = true;
            }
        }
        scoreWord = this.applyBonusDoubleOrTripleWord(scoreWord, isWordDouble, isWordTriple);
        scoreWord = this.applyBonus7LettersWord(scoreWord, board);
        return this.verifyIfWordExistAndSetScore(word, scoreWord);
    }

    public verifyWordVertical(board: Board, firstRowIndex: number, columnIndex: number, word: string): boolean {
        let indexLastLettersAdded = 0;
        let scoreWord = 0;
        let isWordDouble = false;
        let isWordTriple = false;

        for (let indexOffset = 0; indexOffset < word.length; indexOffset++) {
            let square = board.squares[firstRowIndex + indexOffset][columnIndex];

            let isSquareNewLetter =
                board.lastLettersAdded[indexLastLettersAdded] !== undefined
                && board.lastLettersAdded[indexLastLettersAdded].column - 1 === columnIndex
                && BoardHelper.convertCharToIndex(board.lastLettersAdded[indexLastLettersAdded].row)
                === firstRowIndex + indexOffset;
            indexLastLettersAdded += (isSquareNewLetter) ? 1 : 0;
            scoreWord += this.calculateScoreLetterInSquare(square, isSquareNewLetter);

            if (isSquareNewLetter && square.type === SquareType.DOUBLE_WORD_COUNT) {
                isWordDouble = true;
            }
            else if (isSquareNewLetter && square.type === SquareType.TRIPLE_WORD_COUNT) {
                isWordTriple = true;
            }
        }
        scoreWord = this.applyBonusDoubleOrTripleWord(scoreWord, isWordDouble, isWordTriple);
        scoreWord = this.applyBonus7LettersWord(scoreWord, board);
        return this.verifyIfWordExistAndSetScore(word, scoreWord);
    }

    public verifyIfWordExistAndSetScore(word: string, score: number): boolean {
        if (word.length >= 2) {
            if (!DictionnaryManager.contains(word)) {
                return false;
            }
            else {
                this._score += score;
            }
        }
        return true;
    }

    public discoverTopPartOfWord(board: Board, square: Square): string {
        let topPartOfWord = "";
        let nextRowIndex = BoardHelper.convertCharToIndex(square.position.row);
        let columnIndex = square.position.column - 1;
        let touchedTopSquare = true;
        while (touchedTopSquare) {
            touchedTopSquare = (BoardHelper.isValidRowPosition(--nextRowIndex)) ?
                board.squares[nextRowIndex][columnIndex].isBusy : false;
            if (touchedTopSquare) {
                topPartOfWord = board.squares[nextRowIndex][columnIndex].letter.alphabetLetter + topPartOfWord;
            }
        }
        return topPartOfWord;
    }

    public discoverDownPartOfWord(board: Board, square: Square): string {
        let downPartOfWord = "";
        let nextRowIndex = BoardHelper.convertCharToIndex(square.position.row);
        let columnIndex = square.position.column - 1;
        let touchedDownSquare = true;
        while (touchedDownSquare) {
            touchedDownSquare = (BoardHelper.isValidRowPosition(++nextRowIndex)) ?
                board.squares[nextRowIndex][columnIndex].isBusy : false;
            if (touchedDownSquare) {
                downPartOfWord = downPartOfWord + board.squares[nextRowIndex][columnIndex].letter.alphabetLetter;
            }
        }
        return downPartOfWord;
    }

    public discoverLeftPartOfWord(board: Board, square: Square): string {
        let leftPartOfWord = "";
        let rowIndex = BoardHelper.convertCharToIndex(square.position.row);
        let nextColumnIndex = square.position.column - 1;
        let touchedLeftSquare = true;
        while (touchedLeftSquare) {
            touchedLeftSquare = (BoardHelper.isValidColumnPosition(--nextColumnIndex)) ?
                board.squares[rowIndex][nextColumnIndex].isBusy : false;
            if (touchedLeftSquare) {
                leftPartOfWord = board.squares[rowIndex][nextColumnIndex].letter.alphabetLetter + leftPartOfWord;
            }
        }
        return leftPartOfWord;
    }

    public discoverRightPartOfWord(board: Board, square: Square): string {
        let rightPartOfWord = "";
        let rowIndex = BoardHelper.convertCharToIndex(square.position.row);
        let nextColumnIndex = square.position.column - 1;
        let touchedLeftSquare = true;
        while (touchedLeftSquare) {
            touchedLeftSquare = (BoardHelper.isValidColumnPosition(++nextColumnIndex)) ?
                board.squares[rowIndex][nextColumnIndex].isBusy : false;
            if (touchedLeftSquare) {
                rightPartOfWord = rightPartOfWord + board.squares[rowIndex][nextColumnIndex].letter.alphabetLetter;
            }
        }
        return rightPartOfWord;
    }

    public calculateScoreLetterInSquare(square: Square, isSquareNewLetter: boolean): number {
        if (isSquareNewLetter) {
            if (square.type === SquareType.DOUBLE_LETTER_COUNT) {
                return square.letter.point * BONUS_DOUBLE;
            }
            else if (square.type === SquareType.TRIPLE_LETTER_COUNT) {
                return square.letter.point * BONUS_TRIPLE;
            }
        }
        return square.letter.point;
    }

    public applyBonusDoubleOrTripleWord(score: number, isWordDouble: boolean, isWordTriple: boolean): number {
        if (isWordTriple) {
            return score * BONUS_TRIPLE;
        }
        else if (isWordDouble) {
            return score * BONUS_DOUBLE;
        }
        else {
            return score;
        }
    }

    public applyBonus7LettersWord(score: number, board: Board): number {
        if (board.lastLettersAdded.length === WORD_7_LETTERS) {
            return score + BONUS_WORD_7_LETTERS;
        }
        return score;
    }

    public createStringFromArrayString(letters: Array<string>): string {
        let word = "";
        letters.forEach((letter: string) => {
            word += letter.toUpperCase();
        });
        return word;
    }
}
