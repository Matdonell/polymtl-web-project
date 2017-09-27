import { Room } from "../models/room";
import { CommandType } from "./commons/command/command-type";
import { CommandStatus } from "./commons/command/command-status";
import { IPlaceWordResponse } from "./commons/command/place-word-response.interface";
import { ICommandMessage } from "./commons/message/command-message.interface";
import { IRoomMessage } from "./commons/message/room-message.interface";

export class MessageHandler {

    constructor() {
        // Constructor
    }

    public createRoomMessageResponse(
        username: string,
        room: Room,
        message: string)
        : IRoomMessage {

        this.throwNullArgumentException(username);
        this.throwNullArgumentException(room);
        this.throwNullArgumentException(message);

        let missingPlayers = room.numberOfMissingPlayers();

        // Create a response for the room members
        let response: IRoomMessage = {
            _commandType: CommandType.MessageCmd,
            _username: username,
            _message: message,
            _date: new Date(),
            _roomId: room.roomId,
            _numberOfMissingPlayers: missingPlayers,
            _roomIsReady: room.isFull(),
        };
        return response;
    }

    public createPlaceWordResponse(
        username: string,
        room: Room,
        commandStatus: CommandStatus,
        data: IPlaceWordResponse
    ): ICommandMessage<IPlaceWordResponse> {

        this.throwNullArgumentException(room);
        this.throwNullArgumentException(username);
        this.throwNullArgumentException(commandStatus);
        this.throwNullArgumentException(data);

        let commandMessage: ICommandMessage<IPlaceWordResponse>;
        let message: string;

        if (commandStatus === CommandStatus.Ok) {
            message = `$: <!placer> ` + ' ' + `${data._letters.toString()}`;

        } else {
            message = `$: ${CommandStatus[commandStatus]} `
                + `<!placer> ` + ' ' + `${data._letters.toString()}`;
        }

        commandMessage = {
            _commandType: CommandType.PlaceCmd,
            _commandStatus: commandStatus,
            _username: username,
            _message: message,
            _data: data,
            _room: room,
            _date: new Date()
        };

        return commandMessage;
    }

    public createExchangeLettersResponse(
        username: string,
        room: Room,
        commandStatus: CommandStatus,
        lettersToChange: Array<string>
    ): ICommandMessage<Array<string>> {

        this.throwNullArgumentException(username);
        this.throwNullArgumentException(room);
        this.throwNullArgumentException(commandStatus);
        this.throwNullArgumentException(lettersToChange);

        let exchangeCommandResponse: ICommandMessage<Array<string>>;

        let message = (commandStatus === CommandStatus.Ok) ?
            `$: <!changer> ` + ' ' + `${lettersToChange.toString()}` :
            `$: ${CommandStatus[commandStatus]} `
            + `<!changer> ` + ' '
            + `${lettersToChange.toString()}`;

        exchangeCommandResponse = {
            _commandType: CommandType.ExchangeCmd,
            _commandStatus: commandStatus,
            _username: username,
            _message: message,
            _data: [""],
            _room: room,
            _date: new Date()
        };

        return exchangeCommandResponse;
    }

    public createCommandResponse(
        username: string,
        room: Room,
        request: {
            commandType: CommandType,
            commandStatus: CommandStatus,
            data: string
        }
    ): ICommandMessage<Array<string>> {

        this.throwNullArgumentException(username);
        this.throwNullArgumentException(room);
        this.throwNullArgumentException(request.commandType);
        this.throwNullArgumentException(request.commandStatus);

        let message = (request.commandStatus === CommandStatus.Ok) ?
            `$: <!${CommandType[request.commandType]}>` + ' '
            + `${request.data}` : `$: ${CommandStatus[request.commandStatus]} ` + ' '
            + `<${request.data}>`;

        let commandMessage: ICommandMessage<Array<string>>;

        commandMessage = {
            _commandType: request.commandType,
            _commandStatus: request.commandStatus,
            _username: username,
            _message: message,
            _data: null,
            _room: room,
            _date: new Date(),
        };

        return commandMessage;
    }

    private throwNullArgumentException(param: any) {
        if (param === null || param === undefined || param === "") {
            // TODO: Get the parameter name on compile time and insert it in the message
            throw new Error("Null argument exception: the parameters cannot be null be null.");
        }
    }
}
