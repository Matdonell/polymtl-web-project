import { Room } from "./room";
import { Easel } from "./easel";

export class Player {

    private _username: string;
    private _numberOfPlayers: number;
    private _socketId: string;
    private _easel: Easel;
    private _score: number;
    private _online: boolean;
    private _hasLeftDuringGame: boolean;


    // The constructor of a player
    constructor(username: string, numberOfPlayers: number, socketId: string) {

        if (username === null) {
            throw new Error("Argument error: The username cannot be null");
        }
        if (numberOfPlayers < Room.roomMinCapacity || numberOfPlayers > Room.roomMaxCapacity) {
            throw new RangeError("Argument error: The number of players should be between 1 and 4");
        }

        if (socketId === null) {
            throw new Error("Argument error: The socket id of the player cannot be null");
        }

        this._username = username;
        this._numberOfPlayers = numberOfPlayers;
        this.socketId = socketId;
        this._easel = new Easel();
        this._score = 0;
        this._online = true;
        this._hasLeftDuringGame = false;
    }

    public get hasLeftDuringGame(): boolean {
        return this._hasLeftDuringGame;
    }
    public set hasLeftDuringGame(v: boolean) {
        this._hasLeftDuringGame = v;
    }

    // The player's easel
    public get easel(): Easel {
        return this._easel;
    }
    public set easel(v: Easel) {
        this._easel = v;
    }

    // The player score
    public get score(): number {
        return this._score;
    }
    public set score(v: number) {
        this._score = v;
    }

    // The player name
    public get username(): string {
        return this._username;
    }

    public set username(value: string) {
        this._username = value;
    }

    // The number of player needed in the room
    public get numberOfPlayers(): number {
        return this._numberOfPlayers;
    }
    public set numberOfPlayers(value: number) {
        this._numberOfPlayers = value;
    }

    // The socket id using by the player, use to hanle deconnection event
    public get socketId(): string {
        return this._socketId;
    }
    public set socketId(value: string) {
        this._socketId = value;
    }

    public get online(): boolean {
        return this._online;
    }

    public set online(status: boolean) {
        this._online = status;
    }

    public updateScore(scoreToAdd: number) {
        this._score += scoreToAdd;
    }
}
