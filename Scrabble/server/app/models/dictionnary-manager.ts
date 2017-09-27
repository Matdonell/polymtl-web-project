import { DICTIONNARY } from "../data/dictionnary-data";
import { ExceptionHelper } from "../services/commons/exception-helper";

export class DictionnaryManager {
    public static contains(word: String): boolean {
        ExceptionHelper.throwNullArgumentException(word);
        let wordUpperCase = word.toUpperCase();
        return DICTIONNARY.some((wordDictionnary: String) => {
            return wordDictionnary === wordUpperCase;
        });
    }
}
