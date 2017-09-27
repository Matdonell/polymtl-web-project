import { ISquare } from "./square";

export class Board {
    private _squares: Array<Array<ISquare>>;
    public get squares(): Array<Array<ISquare>> {
        return this._squares;
    }

    constructor(response: Array<Array<any>>) {
        this._squares = new Array<Array<ISquare>>();
        response.forEach((row: any) => {
            let rowSquares = new Array<ISquare>();
            row.forEach((square: any) => {



                let squareModified = {
                    _squareValue: square._squareValue,
                    _letter: {
                        _alphabetLetter: square._letter._alphabetLetter,
                        _imageSource: square._letter._imageSource
                    },
                    _position: {
                        _row: square._position._row,
                        _column: square._position._column
                    },
                    _type: square._type,
                    _isBusy: square._isBusy
                };
                rowSquares.push(squareModified);
            });
            this._squares.push(rowSquares);
        });
    }
}

export enum BoardColumn {
    INIT_COLUMN = 0,
    FIRST_COLUMN = 1,
    SECOND_COLUMN = 2,
    THIRD_COLUMN = 3,
    FOURTH_COLUMN = 4,
    FIFTH_COLUMN = 5,
    SIXTH_COLUMN = 6,
    SEVENTH_COLUMN = 7,
    EIGHT_COLUMN = 8,
    NINTH_COLUMN = 9,
    TENTH_COLUMN = 10,
    ELEVENT_COLUMN = 11,
    TWELFTH_COLUMN = 12,
    THIRTEENTH_COLUMN = 13,
    FOURTEENTH_COLUMN = 14,
    FIFTHTEENTH_COLUMN = 15,
}

export enum BoardRows {
    A = 1,
    B = 2,
    C = 3,
    D = 4,
    E = 5,
    F = 6,
    G = 7,
    H = 8,
    I = 9,
    J = 10,
    K = 11,
    L = 12,
    M = 13,
    N = 14,
    O = 15
}
