export class Activity {

    private _date: Date;
    get date(): Date {
        return this._date;
    }
    set date(value: Date) {
        this._date = value;
    }

    private _type: Type;
    get type(): Type {
        return this._type;
    }

    set type(value: Type) {
        this._type = value;
    }

    private _description: String;
    get description(): String {
        return this._description;
    }

    constructor(date: Date, type: Type, description: String) {
        this.date = date;
        this.type = type;
        if (description === "0") {
            this._description = "Facile";
        }
        else if (description === "1") {
            this._description = "Difficile";
        }
        else {
            this._description = description;
        }
    }
}

export enum Type {
    GRID_GENERATION,
    GRID_DEMAND
}
