import { Component, HostListener, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { RestApiProxyService } from "../services/rest-api-proxy.service";
import { UserSettingService } from "../services/user-setting.service";

@Component({
    moduleId: module.id,
    selector: "difficulty-component",
    templateUrl: "../assets/templates/difficulty.component.html",
    styleUrls: [ "../../assets/stylesheets/difficulty.component.css" ],
    providers: [RestApiProxyService]
})
export class DifficultyComponent implements OnInit {
    _username: string;
    _difficulty: string;

    @HostListener("window:beforeunload")
    public async logout() {
        await this.api.removeUsername(this._username);
        return "are you sure";
    }

    constructor(
        private router: Router,
        private userSettingService: UserSettingService,
        private api: RestApiProxyService) { }

    ngOnInit() {
        this._username = this.userSettingService.userSetting.name;
        if (this._username === "") {
            this.router.navigate(["/"]);
        }
        this._difficulty = "0";
    }

    public launchGame() {
        let RADIX = 10;
        this.userSettingService.userSetting.difficulty = parseInt(this._difficulty, RADIX);
        this.router.navigate(["/game"]);
    }
}
