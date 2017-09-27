import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";

import { LeaderboardService } from "../services/leaderboard.service";

@Component({
    selector: "leaderboard-component",
    templateUrl: "../../assets/templates/leaderboard-component.html",
    styleUrls: ["../../assets/stylesheets/leaderboard-component.css"]
})
export class LeaderboardComponent implements OnInit {

    @ViewChild("leaderboard") leaderboard: ElementRef;

    public constructor(
        private router: Router,
        public leaderboardService: LeaderboardService) {
    }

    public ngOnInit(): void {
        this.leaderboardService.fetchRecords();
        this.makeTableScroll();
    }

    public makeTableScroll() {
        let height = window.innerHeight;
        this.leaderboard.nativeElement.style.height = (Math.round(height)) + "px";
    }

    public returnMainPage(): void {
        this.router.navigate(["/"]);
    }
}
