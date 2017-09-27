export interface IPuzzleItemData {
    _value: number;
    _hide: boolean;
}

export class Puzzle {

    public static readonly MIN_ROW_INDEX = 0;
    public static readonly MAX_ROW_INDEX = 8;
    public static readonly MIN_COLUMN_INDEX = 0;
    public static readonly MAX_COLUMN_INDEX = 8;

    public _puzzle: Array<Array<PuzzleItem>>;

    public static convertObjectToPuzzle(object: Array<Array<IPuzzleItemData>>): Puzzle {
        let puzzleItemArray = new Array<Array<PuzzleItem>>();
        for (let row = Puzzle.MIN_ROW_INDEX; row <= Puzzle.MAX_ROW_INDEX; ++row) {
            puzzleItemArray.push(new Array<PuzzleItem>());
            for (let column = Puzzle.MIN_COLUMN_INDEX; column <= Puzzle.MAX_COLUMN_INDEX; ++column) {
                puzzleItemArray[row].push(PuzzleItem.convertObjectToPuzzleItem(object[row][column]));
            }
        }
        return new Puzzle(puzzleItemArray);
    }

    constructor(grid: PuzzleItem[][]) {
        this._puzzle = grid;
     }
}

export class PuzzleItem {

    public _value: number;
    public _hide: boolean;
    public _isRed: boolean;

    public static convertObjectToPuzzleItem(object: IPuzzleItemData): PuzzleItem {
        return new PuzzleItem(object._value, object._hide);
    }

    constructor(value: number, hide: boolean) {
        this._value = value;
        this._hide = hide;
        this._isRed = false;
    }
}
