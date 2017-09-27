import { Injectable } from "@angular/core";
import { RestApiProxyService } from "./rest-api-proxy.service";
import { Difficulty } from "../models/difficulty";

@Injectable()
export class UserService {
    private _username: string;
    public get username(): string {
        return this._username;
    }
    public set username(value: string) {
        this._username = value;
    }

    private _difficulty: Difficulty;
    public get difficulty(): Difficulty {
        return this._difficulty;
    }
    public set difficulty(value: Difficulty) {
        this._difficulty = value;
    }

    constructor(private api: RestApiProxyService) {
        this._username = "";
        this._difficulty = Difficulty.NORMAL;
    }

    public getComputerName(): string {
        if (this._difficulty === Difficulty.NORMAL) {
            return "CPU Normal";
        } else {
            return "CPU Difficile";
        }
    }

    public activateButtonNextLogin(username: string): boolean {
        return (username !== "") ? true : false;
    }

    public async verifyUsername(username: string): Promise<boolean> {
        if (username !== "") {
            return await this.api.verifyUsername(username)
                .then(isValid => {
                    this.username = isValid ? username : "";
                    return isValid;
                })
                .catch(error => {
                    console.log(error);
                    throw error;
                });
        }
        else {
            return false;
        }
    }
}
