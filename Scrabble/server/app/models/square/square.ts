import { SquarePosition } from "./square-position";
import { Letter } from "./../letter";

export class Square {

    private _squareValue: string;
    private _letter: Letter;
    private _position: SquarePosition;
    private _type: string;
    private _isBusy: boolean;

    public get squareValue(): string {
        return this._squareValue;
    }
    public set squareValue(v: string) {
        this._squareValue = v;
    }

    public get letter(): Letter {
        return this._letter;
    }

    public set letter(letter: Letter) {
        this._letter = letter;
    }

    public get position(): SquarePosition {
        return this._position;
    }

    public set position(position: SquarePosition) {
        this._position = position;
    }

    public get type(): string {
        return this._type;
    }

    public set type(type: string) {
        this._type = type;
    }

    public get isBusy(): boolean {
        return this._isBusy;
    }

    public set isBusy(v: boolean) {
        this._isBusy = v;
    }

    constructor(position: SquarePosition, type: string) {
        this.squareValue = type.toString();
        this.letter = new Letter("", 0, 0);
        this.position = position;
        this.type = type;
        this.isBusy = false;
    }
}
