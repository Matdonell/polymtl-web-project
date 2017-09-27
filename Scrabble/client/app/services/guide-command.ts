import { ICommand } from "./commons/command.interface";
import { ICommandRequest } from "./commons/command-request.interface";
import { IGameMessage } from "../commons/messages/game-message.interface";

import { CommandStatus } from './commons/command-status';
import { CommandType } from './commons/command-type';

import { ChatroomComponent } from "../components/chatroom.component";

export class GuideCommand implements ICommand {

    static readonly GUIDE_MESSAGE =
        "Les commandes disponibles sont: \n\n" +
        "• Pour placer un mot\n" +
        "⇨ !placer <ligne><colonne>(h|v) <mot_à_placer>\n\n" +
        "\t⌬ h: pour placer le mot horizontalement\n" +
        "\t⌬ v: pour placer le mot verticalement\n\n" +
        "• Pour échanger des lettres avec la banque de lettres\n" +
        "⇨ !changer <lettre>...\n\n" +
        "\t⌬ lettre: les lettres en minuscules à changer du chevalet (pour une lettre blanche entrez '*')\n\n" +
        "• Pour passer son tour\n" +
        "⇨ !passer\n\n" +
        "• Pour afficher ce guide\n" +
        "⇨ !aide\n\n" +
        "Sinon pour envoyer un message aux autres joueurs simplement le taper dans la boîte de communication.\n";

    private _commandRequest: ICommandRequest<string>;
    private _parameters: string;

    public get commandRequest(): ICommandRequest<string> {
        return this._commandRequest;
    }

    public get parameters(): string {
        return this._parameters;
    }

    constructor(
        private chatroomComponent: ChatroomComponent) {

        this.throwsErrorIfParameterIsNull(chatroomComponent);

        this._commandRequest = {
            _commandType: CommandType.GuideCmd,
            _commandStatus: CommandStatus.Ok,
            _response: GuideCommand.GUIDE_MESSAGE
        };
    }

    public execute() {
        let request: IGameMessage = {
            _commandType: this._commandRequest._commandType,
            _username: "Maître du Scrabble",
            _message: this._commandRequest._response,
            _date: new Date()
        };



        this.chatroomComponent.print(request);
    }

    private throwsErrorIfParameterIsNull(parameter: any) {
        if (parameter === null) {
            throw new Error("Null argument error: the parameters cannot be null");
        }
    }
}
