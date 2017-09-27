import { ICommand } from "./commons/command.interface";
import { ICommandRequest } from "./commons/command-request.interface";
import { CommandStatus } from './commons/command-status';
import { CommandType } from './commons/command-type';
import { ChatroomComponent } from "../components/chatroom.component";

export class MessageCommand implements ICommand {

    private _commandRequest: ICommandRequest<string>;
    private _parameters: string;

    public get commandRequest(): ICommandRequest<string> {
        return this._commandRequest;
    }

    public get parameters(): string {
        return this._parameters;
    }

    constructor(
        private chatroomComponent: ChatroomComponent,
        params: string) {

        this.throwsErrorIfParameterIsNull(chatroomComponent);
        this.throwsErrorIfParameterIsNull(params);
        this.throwsErrorIfParameterIsEmpty(params);

        this._parameters = params;
        this._commandRequest = {
            _commandType: CommandType.MessageCmd,
            _commandStatus: CommandStatus.Ok,
            _response: params
        };
    }

    public execute() {
        let request = {
            commandType: this._commandRequest._commandType,
            message: this._commandRequest._response
        };
        this.chatroomComponent.sendMessage(request);
    }

    private throwsErrorIfParameterIsNull(parameter: any) {
        if (parameter === null) {
            throw new Error("Null argument error: the parameters cannot be null");
        }
    }

    private throwsErrorIfParameterIsEmpty(parameter: any) {
        if (parameter === "") {
            throw new Error("Null argument error: the parameters cannot be empty");
        }
    }
}
