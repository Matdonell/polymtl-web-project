import { Injectable } from "@angular/core";
import { Record } from "../models/record";
import { RestApiProxyService } from "./rest-api-proxy.service";

@Injectable()
export class LeaderboardService {

    private _records: Array<Record>;
    public get records(): Array<Record> {
        return this._records;
    }
    public set records(records: Array<Record>) {
        this._records = records;
    }

    constructor(private api?: RestApiProxyService) {
        this.records = new Array<Record>();
    }

    public async fetchRecords() {
        await this.api.getAllRecords()
            .then(results => {
                this.records = results;
            })
            .catch(error => {
                console.log(error);
            });
    }
}
