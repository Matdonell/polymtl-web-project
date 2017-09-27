import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";

const ONE_SECOND = 1000;
const DEFAULT_MAX_VALUE = 0;

@Injectable()
export class TimerService {

    private _counterMaxValue: number;
    public set counterMaxValue(value: number) {
        this._counterMaxValue = value;
    }

    private _seconds: number;
    public get seconds(): number {
        return this._seconds;
    }

    private _minutes: number;
    public get minutes(): number {
        return this._minutes;
    }

    constructor() {
        this._counterMaxValue = DEFAULT_MAX_VALUE;
        this.initializeCounter();
    }

    public updateClock() {
        --this._seconds;
        if (this._seconds < 0) {
            --this._minutes;
            this._seconds = 30;
            if (this._minutes < 0) {
                this._minutes = DEFAULT_MAX_VALUE;
            }
        }
    }

    public initializeCounter() {
        this._minutes = this._counterMaxValue;
        this._seconds = 30;
    }

    public timer() {
        let observable = new Observable((observer: any) => {
            setInterval(() => {
                this.updateClock();
                let count = { minutes: this.minutes, seconds: this.seconds };
                observer.next(count);

            }, ONE_SECOND);

            return () => {
                this.initializeCounter();
            };
        });
        return observable;
    }

    public timerIsRunning(): boolean {
        return (this.minutes > 0 || this.seconds > 0);
    }
}
