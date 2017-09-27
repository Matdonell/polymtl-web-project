import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { MaterialModule } from "@angular/material";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from "./../components/app.component";
import { DifficultyComponent } from "./../components/difficulty.component";
import { GridComponent } from "./../components/grid.component";
import { UsernameComponent } from "./../components/username.component";

import { GridManagerService } from "./../services/grid-manager.service";
import { PuzzleEventManagerService } from "./../services/puzzle-event-manager.service";
import { RestApiProxyService } from "./../services/rest-api-proxy.service";
import { StopwatchService } from "./../services/stopwatch.service";
import { UserSettingService } from "./../services/user-setting.service";

@NgModule({
    imports: [
        AppRoutingModule,
        BrowserModule,
        FormsModule,
        HttpModule,
        MaterialModule
    ],
    declarations: [
        AppComponent,
        DifficultyComponent,
        GridComponent,
        UsernameComponent
    ],
    providers: [
        UserSettingService,
        RestApiProxyService
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
