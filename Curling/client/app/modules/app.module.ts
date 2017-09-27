import { AppRoutingModule } from "./app-routing.module";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { MaterialModule } from "@angular/material";
import { NgModule } from "@angular/core";

import { AppComponent } from "../components/app.component";
import { DifficultyComponent } from "../components/difficulty.component";
import { LeaderboardComponent } from "../components/leaderboard.component";
import { DisplayComponent } from "../components/display.component";
import { UsernameComponent } from "../components/username.component";

import { ModifierDirective } from "../directives/modifier.directive";

import { GameStatusService } from "./../services/game-status.service";
import { LeaderboardService } from "./../services/leaderboard.service";
import { LightingService } from "./../services/views/ligthing.service";
import { RenderService } from "../services/game-handler/render.service";
import { RestApiProxyService } from "./../services/rest-api-proxy.service";
import { UserService } from "./../services/user.service";

@NgModule({
  imports: [AppRoutingModule, BrowserModule, FormsModule, MaterialModule],
  declarations: [ModifierDirective, AppComponent, DifficultyComponent,
    DisplayComponent, LeaderboardComponent, UsernameComponent],
  providers: [GameStatusService, LeaderboardService, LightingService,
    RenderService, RestApiProxyService, UserService],
  bootstrap: [AppComponent]
})

export class AppModule { }
