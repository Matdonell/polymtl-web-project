import { Component, OnInit, OnDestroy, EventEmitter, Input, Output } from "@angular/core";
import { Subscription } from "rxjs/Subscription";

import { IScrabbleLetter } from "../models/scrabble-letter";
import { EaselManagerService } from "../services/easel-manager.service";
import { SocketService } from "../services/socket-service";

import { LetterHelper } from "../commons/letter-helper";
import { CommandType } from "../services/commons/command-type";
import { SocketEventType } from "../commons/socket-eventType";
import { ICommandRequest } from "../services/commons/command-request.interface";

declare var jQuery: any;

@Component({
    moduleId: module.id,
    providers: [EaselManagerService],
    selector: "easel-selector",
    templateUrl: "../../assets/templates/easel.html",
    styleUrls: ["../../assets/stylesheets/easel.css"]
})

export class EaselComponent implements OnInit, OnDestroy {

    // Create an event emitter to interact with the Game room Component
    @Output() easelTabKeyEvent = new EventEmitter<IScrabbleLetter>();
    @Input() keyEventValue: any;

    private _letters: Array<IScrabbleLetter>;
    private _indexOfLettersToExchange: Array<number>;
    private _keyEventKeyCode: string;

    public get letters(): Array<IScrabbleLetter> {
        return this._letters;
    }

    public get indexOfLettersToChange(): Array<number> {
        return this._indexOfLettersToExchange;
    }

    public set indexOfLettersToChange(v: Array<number>) {
        this._indexOfLettersToExchange = v;
    }

    public get keyEvent(): string {
        return this._keyEventKeyCode;
    }

    @Input()
    public set keyEvent(v: string) {
        this._keyEventKeyCode = v;
    }

    constructor(
        private easelEventManagerService: EaselManagerService,
        private socketService: SocketService) {
        this._indexOfLettersToExchange = new Array<number>();
    }

    ngOnInit() {
        this.onExchangeLetterRequest();
        this.initializeEaselOnConnection();
        this._letters = new Array<IScrabbleLetter>();
    }

    ngOnDestroy() {
        //this._exchangeLetterSubmission.unsubscribe();
    }

    private initializeEaselOnConnection(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.INITIALIZE_EASEL)
            .subscribe((initialsLetters: Array<string>) => {
                this.socketService.player.letters = new Array<IScrabbleLetter>();
                initialsLetters.forEach((letter) => {

                    this.socketService.player.letters.push({ _alphabetLetter: letter, _imageSource: "" });
                });
                this._letters = this.socketService.player.letters;
            });
    }

    private onExchangeLetterRequest(): Subscription {
        return this.socketService.subscribeToChannelEvent(SocketEventType.UPDATE_EASEL)
            .subscribe((response: Array<string>) => {
                this.socketService.player.letters = new Array<IScrabbleLetter>();
                response.forEach((letter: string) => {
                    this.socketService.player.letters.push({ _alphabetLetter: letter, _imageSource: "" });
                });
                this._letters = this.socketService.player.letters;
            });
    }

    public onKeyDownEventHandler(
        event: KeyboardEvent,
        id: string,
        letter: IScrabbleLetter) {

        let keyCode = event.which;
        let currentInputIndex = Number(id.split('_')[1]);

        // We are checking here we are a TabKeyEvent to be able to emit an event
        // and send the selected Letter the game Component
        if (this.easelEventManagerService.isTabKey(keyCode)) {
            this.easelTabKeyEvent.emit(letter);
            this.easelEventManagerService.removeFocusFormatInEasel(this.socketService.player.letters.length);

        } else if (this.easelEventManagerService.isDirection(keyCode)) {
            let nextInputIndex = this.easelEventManagerService
                .onKeyEventUpdateCurrentCursor(this.socketService.player.letters.length, keyCode, currentInputIndex);

            this.moveCurrentLetterToTheNextPosition(keyCode, currentInputIndex, nextInputIndex);

        } else if (this.easelEventManagerService.isScrabbleLetter(keyCode)) {
            this.setFocusToNextMatchLetter(keyCode, event.key, currentInputIndex);
        }
    }

    private moveCurrentLetterToTheNextPosition(
        keyCode: number,
        currentInputIndex: number,
        nextInputIndex: number) {

        let easelMaxIndex = this.socketService.player.letters.length - 1;
        let currentLetter = this.socketService.player.letters[currentInputIndex]._alphabetLetter;

        if (keyCode === LetterHelper.RIGHT_ARROW_KEY_CODE
            && nextInputIndex === 0) {
            for (let index = easelMaxIndex; index > 0; --index) {
                this.socketService.player.letters[index]._alphabetLetter =
                    this.socketService.player.letters[index - 1]._alphabetLetter;
            }

        } else if (keyCode === LetterHelper.LEFT_ARROW_KEY_CODE
            && nextInputIndex === easelMaxIndex) {
            for (let index = 0; index < easelMaxIndex; ++index) {
                this.socketService.player.letters[index]._alphabetLetter
                    = this.socketService.player.letters[index + 1]._alphabetLetter;
            }

        } else {
            this.socketService.player.letters[currentInputIndex]._alphabetLetter
                = this.socketService.player.letters[nextInputIndex]._alphabetLetter;
        }

        this.socketService.player.letters[nextInputIndex]._alphabetLetter = currentLetter;
    }

    private setFocusToNextMatchLetter(
        keyCode: number,
        key: string,
        currentInputIndex: number) {

        if (keyCode === null || key === null || currentInputIndex === null) {
            throw new Error("Argument error: All the paramters are required.");
        }

        let foundIndex = -1;
        let isFound = false;
        let enteredLetter = key.toUpperCase();

        if (jQuery('#easelCell_' + currentInputIndex).is(":focus")) {
            for (let nextIndex = currentInputIndex + 1, index = 0;
                index < this.socketService.player.letters.length && !isFound;
                ++nextIndex, ++index) {

                nextIndex = (nextIndex < this.socketService.player.letters.length) ? nextIndex : 0;
                if (this.socketService.player.letters[nextIndex]._alphabetLetter === enteredLetter) {
                    foundIndex = nextIndex;
                    isFound = true;
                }
            }
        } else {
            foundIndex = this.socketService.player.letters.findIndex(
                (element: IScrabbleLetter) => element._alphabetLetter === enteredLetter
            );
        }

        if (foundIndex !== -1) {
            this.easelEventManagerService
                .setFocusToElementWithGivenIndex(this.socketService.player.letters.length, foundIndex);
        } else {
            this.easelEventManagerService.removeFocusFormatInEasel(this.socketService.player.letters.length);
        }
    }

    // This method is used as an event listener, waiting for an emit from the the GameComponent
    public getNotificationOnTabKeyPress(keyCode: any) {
        if (keyCode === null) {
            throw new Error("The key code cannot be null.");
        }

        let firstLetterIndex = 0;
        this.easelEventManagerService
            .setFocusToElementWithGivenIndex(this.socketService.player.letters.length, firstLetterIndex);
    }

    public changeLetters(commandRequest: ICommandRequest<
        { indexOfLettersToChange: Array<number>, lettersToChange: Array<string> }>) {
        this.indexOfLettersToChange = commandRequest._response.indexOfLettersToChange;
        let listOfLettersToChange = commandRequest._response.lettersToChange;

        let outputRequest = {
            commandType: CommandType.ExchangeCmd,
            commandStatus: commandRequest._commandStatus,
            data: listOfLettersToChange
        };

        this.socketService.emitMessage(SocketEventType.CHANGE_LETTERS_REQUEST, outputRequest);
    }
}
