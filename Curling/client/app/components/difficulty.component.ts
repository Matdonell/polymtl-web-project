import { Component, HostListener, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { Difficulty } from "../models/difficulty";
import { RestApiProxyService } from "../services/rest-api-proxy.service";
import { UserService } from "../services/user.service";

@Component({
    moduleId: module.id,
    selector: "difficulty-component",
    templateUrl: "/assets/templates/difficulty-component.html",
    styleUrls: ["../../assets/stylesheets/difficulty-component.css"]
})
export class DifficultyComponent implements OnInit {
    public _username: string;
    public _difficulty: string;

    constructor(
        private router: Router,
        private api: RestApiProxyService,
        private userService: UserService) { }

    ngOnInit() {
        this._username = this.userService.username;
        if (this._username === "") {
            this.router.navigate(["/"]);
        }
        this._difficulty = "0";
    }

    @HostListener("window:beforeunload")
    public async logout() {
        await this.api.removeUsername(this._username);
    }

    public launchGame() {
        const RADIX = 10;
        if (parseInt(this._difficulty, RADIX) === 0) {
            this.userService.difficulty = Difficulty.NORMAL;
        } else {
            this.userService.difficulty = Difficulty.HARD;
        }
        this.router.navigate(["/game"]);
    }
}
