export interface IPlaceWordResponse {
    _squarePosition: { _row: string, _column: number };
    _wordOrientation: string;
    _letters: Array<string>;
}
