import { Component, OnInit, OnDestroy, AfterViewChecked, ElementRef, ViewChild } from "@angular/core";
import { Subscription } from "rxjs/Subscription";

import { ActivatedRoute } from "@angular/router";
import { SocketService } from "../services/socket-service";
import { SocketEventType } from "../commons/socket-eventType";
import { IGameMessage } from "../commons/messages/game-message.interface";
import { IRoomMessage } from "../commons/messages/room-message.interface";
import { ICommandMessage } from "../commons/messages/command-message.interface";
import { CommandType } from '../services/commons/command-type';

@Component({
    moduleId: module.id,
    selector: "scrabble-chatroom-selector",
    templateUrl: "../../assets/templates/chatroom.html",
    styleUrls: ["../../assets/stylesheets/chatroom.css"],
})

export class ChatroomComponent implements AfterViewChecked, OnInit, OnDestroy {
    _messageArray: Array<IGameMessage>;
    _username: string;

    private _hasNewMessages: boolean;
    private _wasClicked: boolean;
    private _scrollOnce: boolean;

    @ViewChild("scroll") private myScrollContainer: ElementRef;

    constructor(private route: ActivatedRoute, private socketService: SocketService) {
        this._messageArray = new Array<IRoomMessage>();
        this._hasNewMessages = false;
        this._wasClicked = false;
        this._scrollOnce = false;
    }

    ngOnInit(): void {
        this._messageArray = new Array<IRoomMessage>();
        this.route.params.subscribe(params => {
            this._username = params['id'];
        });

        // Subscribe to event by calling the related method and save them for unsubsciption OnDestroy
        this.onJoinedRoom();
        this.onLeaveRoom();
        this.onReceivedMessage();
        this.onCommandRequest();
    }

    ngOnDestroy() {
        // Unsubscribe all the event listeners here
    }

    public get wasClicked(): boolean {
        return this._wasClicked;
    }

    public set wasClicked(b: boolean) {
        this._wasClicked = b;
    }

    public get hasNewMessages(): boolean {
        return this._hasNewMessages;
    }

    public get messageArray(): Array<IGameMessage> {
        return this._messageArray.slice(0);
    }

    private onCommandRequest(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.COMMAND_REQUEST)
            .subscribe((response: ICommandMessage<any>) => {
                if (response !== undefined && response._message !== null) {
                    this._messageArray.push(response);
                    this._hasNewMessages = (this._username !== response._username);

                }
            });
    }

    // A callback when the player join a room
    private onJoinedRoom(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.JOIN_ROOM)
            .subscribe((response: IRoomMessage) => {
                if (response !== undefined && response._message !== null) {
                    this._messageArray.push(response);
                    this._hasNewMessages = (this._username !== response._username);

                }
            });
    }

    // A callback when the player leave a room
    private onLeaveRoom(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.PLAYER_LEFT_ROOM)
            .subscribe((response: IRoomMessage) => {
                if (response !== undefined && response._message !== null) {
                    this._messageArray.push(response);
                    this._hasNewMessages = true;

                }
            });
    }

    // A callback fonction when the player receive a message
    private onReceivedMessage(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.MESSAGE)
            .subscribe((response: any) => {
                if (response !== undefined && response._message !== null) {
                    this._username = this.socketService.player.username;
                    this._messageArray.push(response as IRoomMessage);
                    this._hasNewMessages = (this._username !== response._username);
                    this._scrollOnce = true;
                }
            });
    }

    public sendMessage(request: {
        commandType: CommandType,
        message: string
    }) {

        if (request.commandType === null
            || request.message == null) {
            throw new Error("Null argument error: the parameters cannot be null");
        }
        this.socketService.emitMessage(SocketEventType.MESSAGE, request);
    }

    public print(message: IGameMessage) {
        if (message._commandType === CommandType.GuideCmd) {
            this._messageArray.push(message);
            this._hasNewMessages = true;
            this._scrollOnce = true;
        }
    }

    // Use to add a scroller to the chatroom
    private scrollToBottom() {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) {
            console.log(err);

        }
    }

    // Use to help the user when scrolling
    ngAfterViewChecked() {
        if (!this._wasClicked && this._scrollOnce) {
            this.scrollToBottom();
            this._scrollOnce = false;
        }
        if (this._wasClicked) {
            setTimeout(() => {
                this._hasNewMessages = false;
                this._wasClicked = false;
            }, 1);
        }
    }
}
