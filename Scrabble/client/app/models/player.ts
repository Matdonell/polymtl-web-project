import { IScrabbleLetter } from "./scrabble-letter";

export class Player {

    private _username: string;
    private _numberOfPlayers: number;
    private _socketId: string;
    private _score: number;
    private _letters: Array<IScrabbleLetter>;
    private _isOnline: boolean;


    // The constructor of a player
    constructor(username: string) {
        if (username === null) {
            throw new Error("Argument error: The username cannot be null");
        }
        this._username = username;
        this._score = 0;
        this.letters = new Array<IScrabbleLetter>();
        this._numberOfPlayers = 1;
        this._isOnline = true;
    }

    public get letters(): Array<IScrabbleLetter> {
        return this._letters;
    }

    public set letters(letters: Array<IScrabbleLetter>) {
        this._letters = letters;
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

    public get score(): number {
        return this._score;
    }
    public set score(score: number) {
        this._score = score;
    }

    public get isOnline(): boolean {
        return this._isOnline;
    }
    public set isOnline(v: boolean) {
        this._isOnline = v;
    }
}
