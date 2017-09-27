import { IGameMessage } from "./game-message.interface";
import { CommandStatus } from "./../../services/commons/command-status";

export interface ICommandMessage<T> extends IGameMessage {
    _commandStatus: CommandStatus;
    _data: T;
}
