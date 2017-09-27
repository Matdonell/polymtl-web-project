import { EaselComponent } from "../components/easel.component";
import { EaselManagerService } from "./easel-manager.service";
import { IScrabbleLetter } from "../models/scrabble-letter";
import { ICommand } from "./commons/command.interface";
import { CommandStatus } from "./commons/command-status";
import { CommandType } from "./commons/command-type";
import { ICommandRequest } from "./commons/command-request.interface";
import { CommandsHelper } from "./commons/commands-helper";

export class ChangeLettersCommand implements ICommand {

    private _easelManagerService: EaselManagerService;
    private _commandRequest: ICommandRequest<
    { indexOfLettersToChange: Array<number>, lettersToChange: Array<string> }>;
    private _parameters: string;

    public get commandRequest(): ICommandRequest<
        { indexOfLettersToChange: Array<number>, lettersToChange: Array<string> }> {
        return this._commandRequest;
    }

    public get parameters(): string {
        return this._parameters;
    }

    constructor(private easelComponent: EaselComponent, params: string) {

        this.throwsErrorIfParameterIsNull(easelComponent);

        this._parameters = params;
        this._commandRequest = {
            _commandType: CommandType.ExchangeCmd,
            _commandStatus: CommandStatus.Unknown,
            _response: { indexOfLettersToChange: new Array<number>(), lettersToChange: new Array<string>() }
        };

        this._easelManagerService = new EaselManagerService();
    }

    public execute() {
        let lettersInEasel = this.easelComponent.letters;
        let commandRequest = this.createExchangeEaselLettersRequest(lettersInEasel);
        this.easelComponent.changeLetters(commandRequest);
    }

    public createExchangeEaselLettersRequest(lettersInEasel: Array<IScrabbleLetter>):
        ICommandRequest<{ indexOfLettersToChange: Array<number>, lettersToChange: Array<string> }> {

        let enteredLetters = this._easelManagerService.parseStringToListOfChar(this.parameters.toUpperCase());
        if (enteredLetters === null
            || enteredLetters.length === 0
            || enteredLetters.length > lettersInEasel.length) {
            this.commandRequest._commandStatus = CommandStatus.SynthaxeError;

        } else {

            let indexOfLettersToChange = new Array<number>();
            this.commandRequest._response.lettersToChange = enteredLetters;

            let tempEaselLetters = new Array<string>();
            lettersInEasel.forEach((letter) => {
                tempEaselLetters.push(letter._alphabetLetter);
            });

            for (let index = 0; index < enteredLetters.length; ++index) {
                if (enteredLetters[index] === CommandsHelper.BLANK_VALUE) {
                    enteredLetters[index] = CommandsHelper.BLANK_WORD;
                }

                let letterIndex = tempEaselLetters.findIndex((letter: string) =>
                    letter.toUpperCase() === enteredLetters[index].toUpperCase());

                if (letterIndex === -1 || letterIndex === undefined) {
                    this.commandRequest._commandStatus = CommandStatus.NotAllowed;
                    return this.commandRequest;
                }

                tempEaselLetters[letterIndex] = "-1";
                indexOfLettersToChange.push(letterIndex);
            }

            if (indexOfLettersToChange !== null) {
                this.commandRequest._commandStatus = CommandStatus.Ok;
                this.commandRequest._response.indexOfLettersToChange = indexOfLettersToChange;
            }
        }
        return this.commandRequest;
    }

    private throwsErrorIfParameterIsNull(parameter: any) {
        if (parameter === null) {
            throw new Error("Null argument error: the parameters cannot be null");
        }
    }
}
