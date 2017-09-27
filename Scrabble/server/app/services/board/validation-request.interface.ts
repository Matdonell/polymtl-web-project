import { Letter } from "../../models/letter";

import { Player } from "../../models/player";

export interface IValidationRequest {
    _firstRowNumber: number;
    _columnIndex: number;
    _letters: Array<Letter>;
    _player: Player;
}
