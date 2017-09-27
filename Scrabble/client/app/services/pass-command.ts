import { ICommand } from "./commons/command.interface";
import { ICommandRequest } from "./commons/command-request.interface";
import { CommandStatus } from './commons/command-status';
import { CommandType } from './commons/command-type';
import { GameComponent } from "../components/game-room.component";

export class PassCommand implements ICommand {


    private _commandRequest: ICommandRequest<string>;
    private _parameters: string;

    public get commandRequest(): ICommandRequest<string> {
        return this._commandRequest;
    }

    constructor(
        private gameComponent: GameComponent) {
        this.throwsErrorIfParameterIsNull(gameComponent);

        this._parameters = "";
        this._commandRequest = {
            _commandType: CommandType.PassCmd,
            _commandStatus: CommandStatus.Ok,
            _response: this._parameters
        };
    }

    public execute() {
        let request = {
            commandType: this._commandRequest._commandType,
            commandStatus: this._commandRequest._commandStatus,
            data: this._commandRequest._response
        };
        this.gameComponent.passCurrentPlayerTurn(request);
    }

    private throwsErrorIfParameterIsNull(parameter: any) {
        if (parameter === null) {
            throw new Error("Null argument error: the parameters cannot be null");
        }
    }

}
