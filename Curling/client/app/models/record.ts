import { Injectable } from '@angular/core';
import { Difficulty } from './difficulty';

@Injectable()
export class Record {
    private _username: string;
    public get username(): string {
        return this._username;
    }
    public set username(username: string) {
        this._username = username;
    }

    private _difficulty: Difficulty;
    public get difficulty(): Difficulty {
        return this._difficulty;
    }
    public set difficulty(difficulty: Difficulty) {
        this._difficulty = difficulty;
    }

    private _scorePlayer: number;
    public get scorePlayer(): number {
        return this._scorePlayer;
    }
    public set scorePlayer(scorePlayer: number) {
        this._scorePlayer = scorePlayer;
    }

    private _scoreComputer: number;
    public get scoreComputer(): number {
        return this._scoreComputer;
    }
    public set scoreComputer(scoreComputer: number) {
        this._scoreComputer = scoreComputer;
    }

    private _date: Date;

    constructor(username: string, difficulty: Difficulty, scorePlayer: number, scoreComputer: number, date?: Date) {
        this._username = username;
        this._difficulty = difficulty;
        this._scorePlayer = scorePlayer;
        this._scoreComputer = scoreComputer;
        this._date = (date) ? date : new Date();
    }
}
