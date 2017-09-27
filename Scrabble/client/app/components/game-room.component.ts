import { Component, OnInit, OnDestroy, Output, ViewChild, EventEmitter, HostListener } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { Subscription } from 'rxjs/Subscription';

import { SocketService } from "../services/socket-service";
import { EaselManagerService } from "../services/easel-manager.service";
import { GameRoomManagerService } from "../services/game-room-manager.service";
import { CommandsService } from "../services/commands.service";
import { CommandStatus } from "../services/commons/command-status";
import { CommandType } from "../services/commons/command-type";

import { IRoomMessage } from "../commons/messages/room-message.interface";
import { SocketEventType } from "../commons/socket-eventType";

import { EaselComponent } from "./easel.component";
import { ChatroomComponent } from "./chatroom.component";
import { BoardComponent } from "./board.component";


declare let jQuery: any;

@Component({
    moduleId: module.id,
    providers: [GameRoomManagerService, CommandsService, EaselManagerService],
    selector: "game-room-selector",
    templateUrl: "../../assets/templates/game-room.html",
    styleUrls: ["../../assets/stylesheets/game-room.css"],
})

export class GameComponent implements OnInit, OnDestroy {

    // Create an event emitter to interact with the Easel Component
    @Output() tabKeyEvent = new EventEmitter();

    @ViewChild(BoardComponent)
    private _childBoardComponent: BoardComponent;

    @ViewChild(EaselComponent)
    private _childEaselComponent: EaselComponent;

    @ViewChild(ChatroomComponent)
    private _childChatroomComponent: ChatroomComponent;

    private _inputMessage: string;
    private _isOver: boolean;
    private _connectErrorSubscription: Subscription;
    private _leavingRoomSubscription: Subscription;
    private _gameOverSubscription: Subscription;
    public _username: string;

    constructor(
        private socketService: SocketService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private gameRoomEventManagerService: GameRoomManagerService,
        private commandsService: CommandsService) {
        this._inputMessage = '';
        this._isOver = false;
    }

    ngOnInit() {
        if (this.socketService.player.username === "") {
            this.router.navigate(["/"]);
        }
        this._username = this.socketService.player.username;
        this._connectErrorSubscription = this.onConnectionError();
        this._leavingRoomSubscription = this.onLeaveRoom();
        this._gameOverSubscription = this.onGameOver();
        this.socketService.emitMessage(SocketEventType.INITIALIZE_EASEL, this.socketService.player.username);
    }

    ngOnDestroy() {
        // TODO: unsubscribe to all the event in the ngOnDestroy
        this._gameOverSubscription.unsubscribe();
    }

    public set inputMessage(s: string) {
        this._inputMessage = s;
    }

    public get inputMessage(): string {
        return this._inputMessage;
    }

    public get isOver(): boolean {
        return this._isOver;
    }

    // A callback function when the server is not reachable.
    public onConnectionError(): Subscription {
        // TODO: message derreur a afficher
        return this.socketService.subscribeToChannelEvent(SocketEventType.CONNECT_ERROR)
            .subscribe((error) => {
                console.log(error);
            });
    }

    // A callback when the player leave a room
    public onLeaveRoom(): Subscription {
        // For debug
        return this.socketService.subscribeToChannelEvent(SocketEventType.PLAYER_LEFT_ROOM)
            .subscribe((roomMessage: IRoomMessage) => {
                console.log("In Room", roomMessage);
                if (roomMessage._username === this.socketService.player.username) {
                    this.router.navigate(["/game-start"]);
                }
            });
    }

    // // A callback function when in case of invalid request.
    // private onInvalidRequest() {
    //     // TODO: message derreur a afficher
    // }

    private onGameOver(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.GAME_OVER)
            .subscribe((winner: string) => {
                this._isOver = true;
            });
    }

    // A callback fonction for the chat message submit button
    public submitMessage() {
        let commandParameters = this.commandsService.extractCommandParameters(this._inputMessage);

        // If the player try a command and it's not his turn to play, let him know
        if ((!this.socketService.isCurrentPlayer() || this.isOver)
            && commandParameters.commandType !== CommandType.MessageCmd
            && commandParameters.commandType !== CommandType.GuideCmd) {
            let message = "Veuillez attendre votre tour après "
                + this.socketService._playersPriorityQueue[0].username +
                + "pour pouvoir jouer";

            // Ask if it's necessary to send this to the server, I'm not sure we can just push it to the chatroom
            this.socketService.emitMessage(SocketEventType.INVALID_COMMAND_REQUEST, {
                commandType: CommandType.InvalidCmd,
                commandStatus: CommandStatus.NotAllowed,
                data: message
            });
        }
        else {
            this.handleInputCommand(commandParameters);
        }

        this._inputMessage = ''.toString();
    }

    public handleInputCommand(commandParameters: { commandType: CommandType, parameters: string }) {

        switch (commandParameters.commandType) {
            case CommandType.MessageCmd:
                this.commandsService
                    .invokeAndExecuteMessageCommand(
                    this._childChatroomComponent,
                    commandParameters.parameters);
                break;
            case CommandType.ExchangeCmd:
                this.commandsService
                    .invokeAndExecuteExchangeCommand(
                    this._childEaselComponent,
                    commandParameters.parameters);
                break;
            case CommandType.PlaceCmd:
                this.commandsService
                    .invokeAndExecutePlaceCommand(
                    this._childEaselComponent,
                    this._childBoardComponent,
                    commandParameters.parameters);
                break;
            case CommandType.PassCmd:
                this.commandsService
                    .invokeAndExecutePassCommand(
                    this);
                break;
            case CommandType.GuideCmd:
                this.commandsService
                    .invokeAndExecuteGuideCommand(this._childChatroomComponent);
                break;
            case CommandType.InvalidCmd:
                this.executeInvalidCommand();
                break;
            default:
                break;
        }
    }

    public passCurrentPlayerTurn(request: {
        commandType: CommandType,
        commandStatus: CommandStatus,
        data: string
    }) {
        this.socketService.emitMessage(SocketEventType.PASS_COMMAND_REQUEST, request);
    }

    public executeInvalidCommand() {

        this.socketService.emitMessage(SocketEventType.INVALID_COMMAND_REQUEST,
            {
                commandType: CommandType.InvalidCmd,
                commandStatus: CommandStatus.Invalid,
                data: this._inputMessage
            });
    }

    public onTabKeyEventFromEasel(letter: any) {
        // Give the focus to the input box
        setTimeout(function () {
            jQuery("#inputMessage").focus();
        }, 0);
    }

    public onKeyPressEventHandler(event: KeyboardEvent) {
        let keyCode = event.which;
        if (this.gameRoomEventManagerService.isTabKey(keyCode)) {
            this._childEaselComponent.getNotificationOnTabKeyPress(keyCode);
        }
    }

    public quitGame() {
        this.socketService.emitMessage(SocketEventType.PLAYER_LEFT_ROOM, {
            'username': this.socketService.player.username
        });
    }

    @HostListener("window:keydown.Escape", ['$event'])
    public restartGame() {
        if (this._isOver) {
            this.quitGame();
        }
    }
}
