import "rxjs/add/operator/toPromise";
import { Injectable } from "@angular/core";
import { Headers, Http, Response } from "@angular/http";

import { GameStatusService } from "./game-status.service";

import { Difficulty } from "../models/difficulty";
import { Record } from "../models/record";

@Injectable()
export class RestApiProxyService {
    private _urlApi = "http://localhost:3003/api/";
    private _headers = new Headers({ "Content-Type": "application/json" });

    constructor(private http: Http) {
        // Default
    }

    public async createGameRecord(record: Record): Promise<boolean> {
            return await this.http
                .post(this._urlApi + "game-over", JSON.stringify({
                    username: record.username,
                    difficulty: record.difficulty,
                    scorePlayer: record.scorePlayer,
                    scoreComputer: record.scoreComputer,
                    date: new Date()
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
                    console.log("ERROR in RestApiProxyService - createGameRecord. ", error);
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

    public async getAllRecords(): Promise<Array<Record>> {
        let records: Array<Record> = new Array<Record>();
        await this.http.get(this._urlApi + "records-all").toPromise()
            .then(response => {
                if (response.status === 200) {
                    let arrObj: Array<any> = response.json();
                    arrObj.forEach(element => {
                        records.push(new Record(element.username,
                            element.difficulty,
                            element.scorePlayer,
                            element.scoreComputer,
                            element.date));
                    });
                }
            })
            .catch(error => {
                console.error("ERROR - Rest api getAllRecords - Une erreur est survenue - ", error);
                throw error;
            });
        return records;
    }

    public isResponseValid(response: Response) {
        return response.status === 200 ? true : false;
    }
}
