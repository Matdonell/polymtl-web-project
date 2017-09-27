import { Injectable } from "@angular/core";
import { CurrentPlayer } from "../models/current-player";

@Injectable()
export class GameStatusService {
    public static readonly INITIAL_NUMBER_OF_STONES = 8;
    public static readonly DEFAULT_SCORE = 0;
    public static readonly DEFAULT_SET = 1;

    private _scorePlayer: number;
    public get scorePlayer(): number {
        return this._scorePlayer;
    }
    public set scorePlayer(score: number) {
        this._scorePlayer = score;
    }

    private _scoreComputer: number;
    public get scoreComputer(): number {
        return this._scoreComputer;
    }
    public set scoreComputer(score: number) {
        this._scoreComputer = score;
    }

    private _currentSet: number;
    public get currentSet(): number {
        return this._currentSet;
    }
    public set currentSet(set: number) {
        this._currentSet = set;
    }

    private _currentStonesPlayer: Array<number>;
    public get currentStonesPlayer(): Array<number> {
        return this._currentStonesPlayer;
    }

    public set currentStonesPlayer(count: Array<number>) {
        this._currentStonesPlayer = count;
    }

    private _currentStonesComputer: Array<number>;
    public get currentStonesComputer(): Array<number> {
        return this._currentStonesComputer;
    }
    public set currentStonesComputer(count: Array<number>) {
        this._currentStonesComputer = count;
    }

    private _isLaunched: boolean;
    public get isLaunched(): boolean {
        return this._isLaunched;
    }
    public set isLaunched(value: boolean) {
        this._isLaunched = value;
    }

    private _isFinished: boolean;
    public get isFinished(): boolean {
        return this._isFinished;
    }
    public set isFinished(gameFinished: boolean) {
        this._isFinished = gameFinished;
    }

    private _currentPlayer: CurrentPlayer;
    public get currentPlayer(): number {
        return this._currentPlayer;
    }
    public set currentPlayer(value: number) {
        this._currentPlayer = value;
    }

    constructor() {
        this.scorePlayer = GameStatusService.DEFAULT_SCORE;
        this.scoreComputer = GameStatusService.DEFAULT_SCORE;
        this.currentSet = GameStatusService.DEFAULT_SET;
        this.currentStonesPlayer = new Array<number> (GameStatusService.INITIAL_NUMBER_OF_STONES);
        this.currentStonesComputer = new Array<number> (GameStatusService.INITIAL_NUMBER_OF_STONES);
        this.isLaunched = false;
        this.isFinished = false;
        this.currentPlayer = CurrentPlayer.INVALID;
    }

    public nextPlayer() {
        if (this.currentPlayer === CurrentPlayer.BLUE) {
            this.currentPlayer = CurrentPlayer.RED;
        }
        else {
            this.currentPlayer = CurrentPlayer.BLUE;
        }
    }

    public usedStone(): void {
        if (this.currentPlayer === CurrentPlayer.BLUE) {
            this.currentStonesPlayer.pop();
        } else if (this.currentPlayer === CurrentPlayer.RED) {
            this.currentStonesComputer.pop();
        }
    }

    public incrementScorePlayer(score: number): void {
        this.scorePlayer = this.scorePlayer + score;
    }

    public incrementScoreComputer(score: number): void {
        this.scoreComputer = this.scoreComputer + score;
    }

    public launchGame() {
        this.isLaunched = true;
    }

    public resetStones(): void {
        this.currentStonesPlayer = new Array<number>(GameStatusService.INITIAL_NUMBER_OF_STONES);
        this.currentStonesComputer = new Array<number>(GameStatusService.INITIAL_NUMBER_OF_STONES);
    }

    public resetGameStatus(): void {
        this.scorePlayer = GameStatusService.DEFAULT_SCORE;
        this.scoreComputer = GameStatusService.DEFAULT_SCORE;
        this.currentSet = GameStatusService.DEFAULT_SET;
        this.resetStones();
        this.isLaunched = true;
        this.isFinished = false;
        this.currentPlayer = CurrentPlayer.INVALID;
    }

    public randomFirstPlayer(): boolean {
        let randomNumber = Math.round(Math.random() * 1000) % 2;
        if (randomNumber === 0) {
            this.currentPlayer = CurrentPlayer.BLUE;
            return true;
        }
        else {
            this.currentPlayer = CurrentPlayer.RED;
            return false;
        }
    }

    public gameIsFinished() {
        this.isFinished = true;
    }
}
