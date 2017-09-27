export class Time {
    private _hours: number;
    private _minutes: number;
    private _seconds: number;

    constructor() {
        this.resetTime();
    }

    get hours(): number {
        return this._hours;
    }

    set hours(value: number) {
        this._hours = value;
    }

    get minutes(): number {
        return this._minutes;
    }

    set minutes(value: number) {
        this._minutes = value;
    }

    get seconds(): number {
        return this._seconds;
    }

    set seconds(value: number) {
        this._seconds = value;
    }

    public resetTime(): void {
        this._hours = 0;
        this._minutes = 0;
        this._seconds = 0;
    }

    public printHours(): string {
        return ("0" + this.hours).slice(-2);
    }

    public printMinutes(): string {
        return ("0" + this.minutes).slice(-2);
    }

    public printSeconds(): string {
        return ("0" + this.seconds).slice(-2);
    }

    public compareTo(time: Time): number {
        const areHoursLessThan = this._hours < time._hours;
        const areHoursEqual = this._hours === time._hours;

        const areMinutesLessThan = this._minutes < time._minutes;
        const areMinutesEqual = this._minutes === time._minutes;

        const areSecondsLessThan = this._seconds < time._seconds;
        const areSecondsEqual = this._seconds === time._seconds;

        if (areHoursLessThan
            || (areHoursEqual && areMinutesLessThan)
            || (areHoursEqual && areMinutesEqual && areSecondsLessThan)) {
            return -1;
        }
        else if (areHoursEqual && areMinutesEqual && areSecondsEqual) {
            return 0;
        }
        else {
            return 1;
        }
    }
}
