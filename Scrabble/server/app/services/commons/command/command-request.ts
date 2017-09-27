import { CommandType } from "./command-type";
import { CommandStatus } from "./command-status";

export interface ICommandRequest<T> {
    _commandStatus: CommandStatus;
    _response: T;
    _commandType: CommandType;
}
