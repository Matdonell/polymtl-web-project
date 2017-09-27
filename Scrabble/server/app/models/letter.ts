export class Letter {
    private _alphabetLetter: string;
    private _point: number;
    private _quantity: number;
    private _imageSource: string;

    public get imageSource(): string {
        return this._imageSource;
    }

    public get alphabetLetter(): string {
        return this._alphabetLetter;
    }

    public set alphabetLetter(letter: string) {
        this._alphabetLetter = letter;
    }

    public get point(): number {
        return this._point;
    }

    public set point(value: number) {
        this._point = value;
    }

    public get quantity(): number {
        return this._quantity;
    }

    public set quantity(quantity: number) {
        this._quantity = quantity;
    }

    constructor(letter: string, point: number, quantity: number) {
        this._alphabetLetter = letter;
        this._point = point;
        this._quantity = quantity;
        this._imageSource = "";
    }

    public decrementQuantity(){
        this._quantity--;
    }

    public incrementQuantity(){
        this._quantity++;
    }
}
