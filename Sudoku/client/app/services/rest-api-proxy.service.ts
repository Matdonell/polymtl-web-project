import { Injectable } from "@angular/core";
import { Response, Http, Headers } from "@angular/http";

import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/toPromise";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";

import { Difficulty, UserSetting } from "../models/user-setting";
import { Puzzle } from "../models/puzzle";
import { Record } from "../models/record";
import { Time } from "../models/time";

@Injectable()
export class RestApiProxyService {

    // API Url for new Puzzle request to the server
    protected _urlApi = "http://localhost:3002/api/";
    protected _headers = new Headers({ "Content-Type": "application/json" });

    constructor(private http: Http) { }

    public getNewPuzzle(difficulty: Difficulty): Observable<Puzzle> {
        return this.http.get(this._urlApi + difficulty)
            .map(this.transformSudokuDataFromHttpResponse)
            .catch((error: Error) => {
                throw error;
            });
    }

    private transformSudokuDataFromHttpResponse(res: Response) {
        let body = res.json();
        let result = Puzzle.convertObjectToPuzzle(body);
        return result;
    }

    public async createGameRecord(userSetting: UserSetting, time: Time): Promise<boolean> {
        return await this.http
            .post(this._urlApi + "game-over", JSON.stringify({
                username: userSetting.name,
                difficulty: userSetting.difficulty,
                time: time
            }), { headers: this._headers })
            .toPromise()
            .then(response => {
                if (response.status === 200) {
                    return true;
                }
                else {
                    return false;
                }
            })
            .catch(error => {
                throw error;
            });
    }

    public async verifyUsername(username: string): Promise<boolean> {
        return await this.http
            .post(this._urlApi + "login", JSON.stringify({ username: username }), { headers: this._headers })
            .toPromise()
            .then(response => {
                if (response.status === 200) {
                    return true;
                }
                else {
                    return false;
                }
            })
            .catch(error => {
                throw new Error("RestApiProxyService - An error occured during the verification of the username.");
            });
    }

    public async removeUsername(username: string): Promise<boolean> {
        return await this.http
            .post(this._urlApi + "logout", JSON.stringify({ username: username }), { headers: this._headers })
            .toPromise()
            .then(response => {
                if (response.status === 200) {
                    return true;
                }
                else {
                    return false;
                }
            })
            .catch(error => {
                throw new Error("RestApiProxyService - An error occured when the logout was processed.");
            });
    }

    public async getTopRecords(): Promise<Array<Array<Record>>> {
        let records = new Array<Array<Record>>();
        await this.http.get(this._urlApi + "top-records").toPromise()
            .then(response => {
                if (response.status === 200) {
                    let arrObj: Array<Array<any>> = response.json();
                    for (let i = 0; i < arrObj.length; ++i) {
                        let tempRecords = new Array<Record>();
                        arrObj[i].forEach(record => {
                            tempRecords.push(new Record(record.username,
                                record.difficulty,
                                record.time
                            ));
                        });
                        records.push(tempRecords);
                    }
                }
            })
            .catch(error => {
                console.error("ERROR - Rest api getAllRecords - An error occured when getting top records - ", error);
                throw error;
            });
        return records;
    }

    public async verifyGrid(puzzle: Puzzle): Promise<boolean> {
        return await this.http
            .post(this._urlApi + "grid-validation", JSON.stringify({ puzzle: puzzle._puzzle }),
            { headers: this._headers })
            .toPromise()
            .then(response => {
                let body = response.json();
                if (body.validity === "valid") {
                    return true;
                }
                else {
                    return false;
                }
            })
            .catch(error => {
                console.log("RestApiProxyService - An error occured during the grid validation.");
                return false;
            });
    }
}
