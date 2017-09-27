import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";

import { Router } from "@angular/router";

import { Subscription } from "rxjs/Subscription";
import { SocketService } from "../services/socket-service";
import { SocketEventType } from "../commons/socket-eventType";
import { IRoomMessage } from "../commons/messages/room-message.interface";

@Component({
    moduleId: module.id,
    selector: "waiting-room-selector",
    templateUrl: "../../assets/templates/waiting-room.html",
    styleUrls: ["./../../assets/stylesheets/waiting-room.css"]
})
export class WaitingRoomComponent implements OnInit, OnDestroy {
    public _numberOfPlayerMissing: Array<number>;
    public _numberOfPlayerConnected: Array<number>;
    public _username: String;
    private _onJoinedRoomSubscription: Subscription;
    private _onCancelationSubscription: Subscription;

    // public get numberOfPlayerMissing(): number {
    //     return this._numberOfPlayerMissing;
    // }

    constructor(
        private router: Router,
        private socketService: SocketService) {
        this._numberOfPlayerMissing = Array(this.socketService.missingPlayers).fill(4);
    }

    ngOnInit() {
        if (this.socketService.player.username === "") {
            this.router.navigate(["/"]);
        }
        this.socketService.subscribeToChannelEvent(SocketEventType.CONNECT_ERROR)
            .subscribe(this.onConnectionError);
        this._onJoinedRoomSubscription = this.onJoinedRoom();
        this._onCancelationSubscription = this.onCancelation();
        this._username = this.socketService.player.username;
        this._numberOfPlayerConnected
            = new Array<number>(this.socketService.player.numberOfPlayers - this.socketService.missingPlayers);
    }

    ngOnDestroy() {
        // unsubscribe to all the listening events
        // this._onJoinedRoomSubscription.unsubscribe();
        // this._onCancelationSubscription.unsubscribe();
    }

    // A callback function when the server is not reachable.
    public onConnectionError() {
        // TODO: message derreur a afficher
    }

    // A callback when the player join a room
    private onJoinedRoom(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.JOIN_ROOM)
            .subscribe((roomMessage: IRoomMessage) => {

                if (roomMessage._roomIsReady) {

                    this.router.navigate(["/game-room"]);
                } else {
                    this._numberOfPlayerMissing.pop();
                    this._numberOfPlayerConnected.push(1);
                }
            });
    }

    // A callback when the player join a room
    private onCancelation(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.PLAYER_LEFT_ROOM)
            .subscribe((roomMessage: IRoomMessage) => {

                if (!roomMessage._roomIsReady && roomMessage._username !== this.socketService.player.username) {
                    this._numberOfPlayerMissing.push(1);
                    this._numberOfPlayerConnected.pop();
                }
            });
    }

    public cancelGame() {
        this.socketService.emitMessage(SocketEventType.CANCEL, {
            username: this.socketService.player.username
        });
        this.router.navigate(["/"]);
    }

    @HostListener("window:keydown.Escape", ['$event'])
    keyboardEventHandler(event: KeyboardEvent) {
        this.cancelGame();
    }
}
