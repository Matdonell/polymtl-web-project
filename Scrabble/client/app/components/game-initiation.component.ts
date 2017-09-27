import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { SocketService } from "../services/socket-service";
import { SocketEventType } from "../commons/socket-eventType";
import { IRoomMessage } from "../commons/messages/room-message.interface";

@Component({
    moduleId: module.id,
    selector: "game-initiation-selector",
    templateUrl: "../../assets/templates/game-initiation.html",
    styleUrls: ["./../../assets/stylesheets/game-initiation.css"]
})

export class GameInitiationComponent implements OnInit, OnDestroy {
    public static readonly MAX_PLAYERS = 4;
    private _onConnectedSubscription: Subscription;
    private _onJoinedRoomSubscription: Subscription;
    private _onUsernameAlreadyExistSubscription: Subscription;
    private _onInvalidRequestEventSubscription: Subscription;
    private _onConnectionErrorSubscription: Subscription;
    public _username: String;
    public _numberOfPlayers: number;
    public _sortsOfGame: Array<number>;

    constructor(
        private router: Router,
        private _cdr: ChangeDetectorRef,
        public socketService: SocketService) {
            // Default constructor
    }

    ngOnInit() {
        // Subscribe to event by calling the related method and save them for unsubscription OnDestroy
        this._onConnectedSubscription = this.onConnected();
        this._onJoinedRoomSubscription = this.onJoinedRoom();
        this._onUsernameAlreadyExistSubscription = this.onUsernameAlreadyExists();
        this._onInvalidRequestEventSubscription = this.onInvalidRequest();
        this._onConnectionErrorSubscription = this.onConnectionError();
        if (this.socketService._socket && this.socketService._socket.disconnected) {
            this.socketService._socket.connect();
        }
        this._sortsOfGame = Array(GameInitiationComponent.MAX_PLAYERS).fill(0).map((x, i) => i + 1);
    }

    ngOnDestroy() {
        // this.unsubscribeToChannelEvent();
    }

    // A callback function when the client is connected to the server.
    private onConnected(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.CONNECT)
            .subscribe(() => {
                // TODO: message a afficher
            });
    }

    // A callback when the player join a room
    private onJoinedRoom(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.JOIN_ROOM)
            .subscribe((roomMessage: IRoomMessage) => {

                this.socketService.missingPlayers = roomMessage._numberOfMissingPlayers;
                if (roomMessage._roomIsReady) {
                    this.router.navigate(["/game-room"]);
                } else {
                    this.router.navigate(["/waiting-room"]);
                }
            });
    }

    // A callback function when in case of invalid request.
    private onInvalidRequest(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.INVALID_REQUEST)
            .subscribe(() => {
                // TODO: message derreur a afficher
            });
    }

    // A callback function when the username is taken.
    private onUsernameAlreadyExists(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.USERNAME_ALREADY_EXIST)
            .subscribe(() => {
                //TODO: activate div like bootstrap alert-success
                alert("This username is already taken, please choose another username.");
                this.socketService.player.username = "";
                this._cdr.detectChanges();
            });
    }

    // A callback function when the server is not reachable.
    private onConnectionError(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.CONNECT_ERROR)
            .subscribe((error) => {
                // TODO: message derreur a afficher
            });
    }

    // A callback function when the user ask for a new game.
    public sendNewGameRequest(username: string, numberOfPlayersStr: string) {

        if (username === null || numberOfPlayersStr === null) {
            throw new Error("Null argument error: All the parameters are required");
        }
        if (this.socketService.player.username === "") {
            this.socketService.player.username = username;
        } else {
            username = this.socketService.player.username;
        }

        this.socketService.player.numberOfPlayers = this._numberOfPlayers;
        this.socketService.emitMessage(
            SocketEventType.NEW_GAME_REQUEST,
            { 'username': username, 'gameType': this._numberOfPlayers });
    }
}
