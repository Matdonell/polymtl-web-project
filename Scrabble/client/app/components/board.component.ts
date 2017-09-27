import { Component, OnInit } from "@angular/core";

import { Board } from "../models/board";

import { SocketEventType } from "../commons/socket-eventType";
import { SocketService } from "../services/socket-service";
import { BoardManagerService } from "../services/board-manager.service";
import { ExceptionHelperService } from "../services/exception-helper.service";

import { IPlaceWordResponse } from "../services/commons/place-command-response.interface";
import { ICommandRequest } from "../services/commons/command-request.interface";

@Component({
    moduleId: module.id,
    selector: "scrabble-main-board-selector",
    templateUrl: "../../assets/templates/scrabble.html",
    styleUrls: ["../../assets/stylesheets/scrabble-board.css"],
    providers: [BoardManagerService, ExceptionHelperService]
})

export class BoardComponent implements OnInit {
    board: Board;

    constructor(
        private socketService: SocketService) {
    }

    ngOnInit() {
        this.onUpdateBoardEvent();
    }

    private onUpdateBoardEvent() {
        this.socketService.subscribeToChannelEvent(SocketEventType.UPDATE_BOARD)
            .subscribe((response: any) => {
                if (response !== undefined) {
                    this.board = new Board(response._squares);
                }
            });
    }

    public placeWordInBoard(commandRequest: ICommandRequest<IPlaceWordResponse>) {
        this.socketService.emitMessage(SocketEventType.PLACE_WORD_COMMAND_REQUEST, commandRequest);
    }
}
