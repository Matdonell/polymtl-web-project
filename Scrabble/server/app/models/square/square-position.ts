export class SquarePosition {
    private _row: string;
    private _column: number;

    public get row(): string {
        return this._row;
    }

    public set row(row: string) {
        this._row = row;
    }

    public get column(): number {
        return this._column;
    }

    public set column(column: number) {
        this._column = column;
    }

    constructor(row: string, column: number) {
        this.row = row;
        this.column = column;
    }
}
