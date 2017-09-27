import { Injectable } from "@angular/core";

import { Difficulty } from "./user-setting";
import { Time } from "./time";

@Injectable()
export class Record {
    private _username: string;
    private _difficulty: Difficulty;
    private _time : Time;

    constructor(username: string, difficulty: Difficulty, time: Time) {
        this._username = username;
        this._difficulty = difficulty;
        this._time = time;
    }

    public get username(): string {
        return this._username;
    }

    public set username(username: string) {
        this._username = username;
    }

    public get difficulty(): Difficulty {
        return this._difficulty;
    }

    public set difficulty(difficulty: Difficulty) {
        this._difficulty = difficulty;
    }

    public get time() : Time {
        return this._time;
    }

    public set time(time : Time) {
        this._time = time;
    }

}
