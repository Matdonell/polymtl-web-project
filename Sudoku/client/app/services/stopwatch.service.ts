import { Injectable } from "@angular/core";

const FIVE_SECOND_DELAY = 5000;
@Injectable()
export class StopwatchService {
    private _startTime : number;
    private _seconds: number;
    private _minutes: number;
    private _hours: number;

    constructor() {
        this._startTime = new Date().getTime();
        this._seconds = 0;
        this._minutes = 0;
        this._hours = 0;
    }

    public resetTime(){
        this._startTime = new Date().getTime();
    }

    public updateClock() {
        let elapsedTime : number;
        elapsedTime = new Date().getTime() - this._startTime;

        elapsedTime = Math.floor(elapsedTime / 1000);
        this._seconds = elapsedTime % 60;
        elapsedTime = Math.floor(elapsedTime / 60);
        this._minutes = elapsedTime % 60;
        elapsedTime = Math.floor(elapsedTime / 60);
        this._hours = elapsedTime % 60;
    }

    get minutes(): number {
        return this._minutes;
    }
    get hours(): number {
        return this._hours;
    }
    get seconds(): number {
        return this._seconds;
    }

}

