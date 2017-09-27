interface ILetterPoint {
    letter: string;
    point: number;
}

export class Alphabet {
    static letterA: ILetterPoint = { letter: "A", point: 1 };
    static letterB: ILetterPoint = { letter: "B", point: 3 };
    static letterC: ILetterPoint = { letter: "C", point: 3 };
    static letterD: ILetterPoint = { letter: "D", point: 2 };
    static letterE: ILetterPoint = { letter: "E", point: 1 };
    static letterF: ILetterPoint = { letter: "F", point: 4 };
    static letterG: ILetterPoint = { letter: "G", point: 2 };
    static letterH: ILetterPoint = { letter: "H", point: 4 };
    static letterI: ILetterPoint = { letter: "I", point: 1 };
    static letterJ: ILetterPoint = { letter: "J", point: 8 };
    static letterK: ILetterPoint = { letter: "K", point: 10 };
    static letterL: ILetterPoint = { letter: "L", point: 1 };
    static letterM: ILetterPoint = { letter: "M", point: 2 };
    static letterN: ILetterPoint = { letter: "N", point: 1 };
    static letterO: ILetterPoint = { letter: "O", point: 1 };
    static letterP: ILetterPoint = { letter: "P", point: 3 };
    static letterQ: ILetterPoint = { letter: "Q", point: 8 };
    static letterR: ILetterPoint = { letter: "R", point: 1 };
    static letterS: ILetterPoint = { letter: "S", point: 1 };
    static letterT: ILetterPoint = { letter: "T", point: 1 };
    static letterU: ILetterPoint = { letter: "U", point: 1 };
    static letterV: ILetterPoint = { letter: "V", point: 4 };
    static letterW: ILetterPoint = { letter: "W", point: 10 };
    static letterX: ILetterPoint = { letter: "X", point: 10 };
    static letterY: ILetterPoint = { letter: "Y", point: 10 };
    static letterZ: ILetterPoint = { letter: "Z", point: 10 };
    static blank: ILetterPoint = { letter: "blank", point: 0 };
    static alphabet: Array<ILetterPoint> = [
        Alphabet.letterA,
        Alphabet.letterB,
        Alphabet.letterC,
        Alphabet.letterD,
        Alphabet.letterE,
        Alphabet.letterF,
        Alphabet.letterG,
        Alphabet.letterH,
        Alphabet.letterI,
        Alphabet.letterJ,
        Alphabet.letterK,
        Alphabet.letterL,
        Alphabet.letterM,
        Alphabet.letterN,
        Alphabet.letterO,
        Alphabet.letterP,
        Alphabet.letterQ,
        Alphabet.letterR,
        Alphabet.letterS,
        Alphabet.letterT,
        Alphabet.letterU,
        Alphabet.letterV,
        Alphabet.letterW,
        Alphabet.letterX,
        Alphabet.letterY,
        Alphabet.letterZ,
        Alphabet.blank
    ];
}
