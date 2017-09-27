import { CommandType } from "../command/command-type";

export class IGameMessage {
    _commandType: CommandType;
    _username: string;
    _message: string;
    _date: Date;
}
