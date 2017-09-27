import { ISquarePosition } from "./square-position";
import { IScrabbleLetter } from "./scrabble-letter";
import { SquareType } from "./commons/square-type";

export interface ISquare {
    _squareValue: string;
    _letter: IScrabbleLetter;
    _position: ISquarePosition;
    _type: SquareType;
    _isBusy: boolean;
}
