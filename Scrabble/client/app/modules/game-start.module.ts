import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from '@angular/forms';
import { RouteModule } from "./routing-app.module";

import { AppComponent } from "./../components/app.component";
import { GameInitiationComponent } from "./../components/game-initiation.component";
import { SocketService } from "./../services/socket-service";

import { MaterialModule } from "@angular/material";
import { BoardComponent } from "./../components/board.component";
import { EaselComponent } from "./../components/easel.component";
import { ChatroomComponent } from "./../components/chatroom.component";
import { InformationPanelComponent } from "./../components/information-panel.component";
import { GameComponent } from "./../components/game-room.component";
import { WaitingRoomComponent } from "./../components/waiting-room.component";

import { BlinkDirective } from "./../directive/blink.directive";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouteModule,
        MaterialModule
    ],
    declarations: [
        AppComponent,
        GameInitiationComponent,
        GameComponent,
        BoardComponent,
        ChatroomComponent,
        EaselComponent,
        InformationPanelComponent,
        WaitingRoomComponent,
        BlinkDirective
    ],
    providers: [SocketService],
    bootstrap: [AppComponent]
})
export class GameStartModule { }
