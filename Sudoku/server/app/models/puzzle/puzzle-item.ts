export interface IPuzzleItemData {
    _value: number;
    _hide: boolean;
}

export class PuzzleItem {
    private _value: number;
    get value(): number {
        return this._value;
    }
    set value(value: number) {
        this._value = value;
    }

    private _hide: boolean;
    get isHidden(): boolean {
        return this._hide;
    }
    set isHidden(hidden: boolean) {
        this._hide = hidden;
    }

    public static convertObjectToPuzzleItem(object: IPuzzleItemData): PuzzleItem {
        if (object._value === undefined || object._hide === undefined) {
            throw new TypeError("The object doesn't have the property _value or _hide.");
        }
        return new PuzzleItem(Number(object._value), object._hide);
    }

    constructor(value: number, hide: boolean) {
        this._value = value;
        this._hide = hide;
    }
}
