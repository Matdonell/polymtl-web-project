import { Injectable } from "@angular/core";
import { Difficulty, UserSetting } from "../models/user-setting";
import { RestApiProxyService } from "../services/rest-api-proxy.service";

@Injectable()
export class UserSettingService {
    private _userSetting: UserSetting;

    constructor(private api: RestApiProxyService) {
        this._userSetting = new UserSetting();
    }

    public get userSetting(): UserSetting {
        return this._userSetting;
    }

    public set userSetting(value: UserSetting) {
        this._userSetting = value;
    }

    public setName(username: string) {
        this._userSetting.name = username;
    }

    public setDifficulty(difficulty: Difficulty) {
        this._userSetting.difficulty = difficulty;
    }

    public getComputerName(): string {
        if (this._userSetting.difficulty === Difficulty.NORMAL) {
            return "CPU Normal";
        } else {
            return "CPU Difficile";
        }
    }

    public activateButtonNextLogin(username: string): boolean {
        if (username !== "") {
            return true;
        }
        else {
            return false;
        }
    }

    public async verifyUsername(username: string): Promise<boolean> {
        if (username !== "") {
            let isValid: boolean;
            await this.api.verifyUsername(username)
                .then(result => {
                    isValid = result;
                })
                .catch(error => {
                    console.log(error);
                    throw error;
                });
            if (isValid) {
                this.setName(username);
                return true;
            } else {
                return false;
            }
        }
        else {
            return false;
        }
    }
}
