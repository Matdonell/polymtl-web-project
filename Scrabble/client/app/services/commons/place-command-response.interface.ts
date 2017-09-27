import { ISquarePosition } from "../../models/square-position";

export interface IPlaceWordResponse {
    _squarePosition: ISquarePosition;
    _wordOrientation: string;
    _letters: Array<string>;
}
