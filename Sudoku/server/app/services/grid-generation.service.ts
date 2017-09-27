import { GridSolver } from "./grid-solver.service";

import { Activity, Type } from "../models/dashboard/activity";
import { Dashboard } from "../models/dashboard/dashboard";
import { Difficulty } from "../models/puzzle/difficulty";
import { Puzzle } from "../models/puzzle/puzzle";

// Used to generate the type of transformation and to give a number of holes to dig in sudoku
function getRandomNumberInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export class GridGenerationManager {
    private static readonly MILLISECONDS_TO_WAIT = 5000;

    private static readonly NUMBER_OF_SUDOKUS_TO_GENERATE = 3;
    private static readonly NOMBRE_ITERATIONS_MIN = 1;
    private static readonly NOMBRE_ITERATIONS_MAX = 200;
    private static readonly NUMBERS_TO_REMOVE = [45, 60];
    private _sudokusGenerated: Array<Array<Puzzle>>;

    public static isValidDifficulty(difficulty: Difficulty): boolean {
        return difficulty >= 0 && difficulty < Difficulty.NUMBER_OF_DIFFICULTIES;
    }

    constructor() {
        this._sudokusGenerated = new Array<Array<Puzzle>>();
        for (let i = 0; i < Difficulty.NUMBER_OF_DIFFICULTIES; ++i) {
            this._sudokusGenerated.push(new Array<Puzzle>());
            this.fillArrayWithSudokus(i);
        }
    }

    get sudokusGenerated(): Array<Array<Puzzle>> {
        return this._sudokusGenerated;
    }

    private fillArrayWithSudokus(arrayIndex: number) {
        for (let row = 0; row < GridGenerationManager.NUMBER_OF_SUDOKUS_TO_GENERATE; ++row) {
            this.getNewPuzzle(arrayIndex).then((puzzle: Puzzle) => {
                this._sudokusGenerated[arrayIndex].push(puzzle);

            });
        }
    }

    public getNewPuzzle(difficulty: Difficulty): Promise<Puzzle> {
        return new Promise((resolve, reject) => {
            Dashboard.getInstance().addActivity(new Activity(new Date, Type.GRID_GENERATION, difficulty.toString()));
            if (this._sudokusGenerated[difficulty].length !== 0) {
                //Launch a new sudoku generation after the existing sudoku is returned.
                let sudokuGenerated = this._sudokusGenerated[difficulty].pop();

                resolve(sudokuGenerated);

                setTimeout(() => {
                    this.performGenerationWithDelay(difficulty)
                        .then((puzzle: Puzzle) => {
                            this._sudokusGenerated[difficulty].push(puzzle);
                        });
                }, 0);
            }
            else {
                //Launch a new sudoku generation and return the sudoku generated
                this.performGenerationWithDelay(difficulty).then((puzzle: Puzzle) => {
                    resolve(puzzle);
                });
            }
        });
    }

    //Generate a new puzzle and wait until 5 seconds is elapsed to return the sudoku generated.
    private performGenerationWithDelay(difficulty: Difficulty): Promise<Puzzle> {
        return new Promise<Puzzle>((resolve, reject) => {
            let time = Date.now();
            let sudokuGenerated = this.generateNewPuzzle(difficulty);
            let intervalOfTimeForGeneration = Date.now() - time;
            let waitTime = (GridGenerationManager.MILLISECONDS_TO_WAIT - intervalOfTimeForGeneration);
            setTimeout(resolve.bind(resolve, sudokuGenerated), waitTime > 0 ? waitTime : 0);
        });
    }

    private generateNewPuzzle(difficulty?: Difficulty) {
        let newPuzzle = new Puzzle();
        let nbIterations = getRandomNumberInRange(
            GridGenerationManager.NOMBRE_ITERATIONS_MIN,
            GridGenerationManager.NOMBRE_ITERATIONS_MAX);

        let operations = [
            (puzzle: Puzzle) => {
                let [rowA, rowB] = this.numberGeneratorForSwaping();
                newPuzzle.swapRow(rowA, rowB);
            },

            (puzzle: Puzzle) => {
                let [columnA, columnB] = this.numberGeneratorForSwaping();
                newPuzzle.swapColumn(columnA, columnB);
            },

            (puzzle: Puzzle) => {
                newPuzzle.horizontalSymmetry();
            },

            (puzzle: Puzzle) => {
                newPuzzle.verticalSymmetry();
            },

            (puzzle: Puzzle) => {
                newPuzzle.diagonal1Symmetry();
            },

            (puzzle: Puzzle) => {
                newPuzzle.diagonal2Symmetry();
            }
        ];

        for (let i = 0; i < nbIterations; ++i) {
            let operationNumberToDo = getRandomNumberInRange(0, operations.length - 1);
            operations[operationNumberToDo](newPuzzle);
        }
        this.hideNumbers(newPuzzle, GridGenerationManager.NUMBERS_TO_REMOVE[difficulty]);
        newPuzzle.createPuzzleHoles();
        return newPuzzle;
    }

    //Generate 2 numbers. The first and the second numbers are one of the following :
    //Between 0 and 2 and cannot be equals.
    //Between 3 and 5 and cannot be equals.
    //Between 6 and 8 and cannot be equals.
    //They specifie the columns or rows of the same square to be changed.
    private numberGeneratorForSwaping(): Array<number> {
        let rowNumbers = [-1, -1];
        let squareNumber: number;
        rowNumbers[0] = getRandomNumberInRange(Puzzle.MIN_COLUMN_INDEX, Puzzle.SQUARE_LENGTH - 1);
        rowNumbers[1] = (rowNumbers[0]
            + getRandomNumberInRange(Puzzle.MIN_COLUMN_INDEX + 1, Puzzle.SQUARE_LENGTH - 1))
            % Puzzle.SQUARE_LENGTH;
        squareNumber = getRandomNumberInRange(Puzzle.MIN_COLUMN_INDEX, Puzzle.SQUARE_LENGTH - 1);
        rowNumbers[0] = rowNumbers[0] + squareNumber * Puzzle.SQUARE_LENGTH;
        rowNumbers[1] = rowNumbers[1] + squareNumber * Puzzle.SQUARE_LENGTH;
        return rowNumbers;
    }

    private hideNumbers(newPuzzle: Puzzle, numbersToRemove: number) {
        let gridSolver = new GridSolver(newPuzzle);
        let validIndexesRow = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        let validIndexesColumn = [[0, 1, 2, 3, 4, 5, 6, 7, 8],
                                [0, 1, 2, 3, 4, 5, 6, 7, 8],
                                [0, 1, 2, 3, 4, 5, 6, 7, 8],
                                [0, 1, 2, 3, 4, 5, 6, 7, 8],
                                [0, 1, 2, 3, 4, 5, 6, 7, 8],
                                [0, 1, 2, 3, 4, 5, 6, 7, 8],
                                [0, 1, 2, 3, 4, 5, 6, 7, 8],
                                [0, 1, 2, 3, 4, 5, 6, 7, 8],
                                [0, 1, 2, 3, 4, 5, 6, 7, 8]];
        let numberOfRemovedNumbers = 0;
        while (validIndexesRow.length > 0 && numberOfRemovedNumbers < numbersToRemove) {
            let rowValidIndex = getRandomNumberInRange(0, validIndexesRow.length - 1);
            let rowIndex = validIndexesRow[rowValidIndex];
            let columnValidIndex = getRandomNumberInRange(0, validIndexesColumn[rowIndex].length - 1);
            let columnIndex = validIndexesColumn[rowIndex][columnValidIndex];

            newPuzzle.setPuzzleTileVisibility(rowIndex, columnIndex, true);
            if (gridSolver.getNumberOfSolutionsAfterRemovingNumber(rowIndex, columnIndex) !== 1) {
                newPuzzle.setPuzzleTileVisibility(rowIndex, columnIndex, false);
            }
            else {
                ++numberOfRemovedNumbers;
            }
            if (validIndexesColumn[rowIndex].length === 1) {
                validIndexesRow.splice(rowValidIndex, 1);
            }
            validIndexesColumn[rowIndex].splice(columnValidIndex, 1);
        }
    }
}
