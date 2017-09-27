export class LetterHelper {

    static readonly LEFT_ARROW_KEY_CODE = 37;
    static readonly RIGHT_ARROW_KEY_CODE = 39;
    static readonly TAB_KEY_CODE = 9;

    static readonly LETTER_A_KEY_CODE = 97;
    static readonly LETTER_B_KEY_CODE = 98;
    static readonly LETTER_C_KEY_CODE = 99;
    static readonly LETTER_D_KEY_CODE = 100;
    static readonly LETTER_E_KEY_CODE = 101;
    static readonly LETTER_F_KEY_CODE = 102;
    static readonly LETTER_G_KEY_CODE = 103;
    static readonly LETTER_H_KEY_CODE = 104;
    static readonly LETTER_I_KEY_CODE = 105;
    static readonly LETTER_J_KEY_CODE = 106;
    static readonly LETTER_K_KEY_CODE = 107;
    static readonly LETTER_L_KEY_CODE = 108;
    static readonly LETTER_M_KEY_CODE = 109;
    static readonly LETTER_N_KEY_CODE = 110;
    static readonly LETTER_O_KEY_CODE = 111;
    static readonly LETTER_P_KEY_CODE = 112;
    static readonly LETTER_Q_KEY_CODE = 113;
    static readonly LETTER_R_KEY_CODE = 114;
    static readonly LETTER_S_KEY_CODE = 115;
    static readonly LETTER_T_KEY_CODE = 116;
    static readonly LETTER_U_KEY_CODE = 117;
    static readonly LETTER_V_KEY_CODE = 118;
    static readonly LETTER_W_KEY_CODE = 119;
    static readonly LETTER_X_KEY_CODE = 120;
    static readonly LETTER_Y_KEY_CODE = 121;
    static readonly LETTER_Z_KEY_CODE = 122;

    static readonly LETTER_A_CAPITAL_KEY_CODE = 65;
    static readonly LETTER_B_CAPITAL_KEY_CODE = 66;
    static readonly LETTER_C_CAPITAL_KEY_CODE = 67;
    static readonly LETTER_D_CAPITAL_KEY_CODE = 68;
    static readonly LETTER_E_CAPITAL_KEY_CODE = 69;
    static readonly LETTER_F_CAPITAL_KEY_CODE = 70;
    static readonly LETTER_G_CAPITAL_KEY_CODE = 71;
    static readonly LETTER_H_CAPITAL_KEY_CODE = 72;
    static readonly LETTER_I_CAPITAL_KEY_CODE = 73;
    static readonly LETTER_J_CAPITAL_KEY_CODE = 74;
    static readonly LETTER_K_CAPITAL_KEY_CODE = 75;
    static readonly LETTER_L_CAPITAL_KEY_CODE = 76;
    static readonly LETTER_M_CAPITAL_KEY_CODE = 77;
    static readonly LETTER_N_CAPITAL_KEY_CODE = 78;
    static readonly LETTER_O_CAPITAL_KEY_CODE = 79;
    static readonly LETTER_P_CAPITAL_KEY_CODE = 80;
    static readonly LETTER_Q_CAPITAL_KEY_CODE = 81;
    static readonly LETTER_R_CAPITAL_KEY_CODE = 82;
    static readonly LETTER_S_CAPITAL_KEY_CODE = 83;
    static readonly LETTER_T_CAPITAL_KEY_CODE = 84;
    static readonly LETTER_U_CAPITAL_KEY_CODE = 85;
    static readonly LETTER_V_CAPITAL_KEY_CODE = 86;
    static readonly LETTER_W_CAPITAL_KEY_CODE = 87;
    static readonly LETTER_X_CAPITAL_KEY_CODE = 88;
    static readonly LETTER_Y_CAPITAL_KEY_CODE = 89;
    static readonly LETTER_Z_CAPITAL_KEY_CODE = 90;

    public static isLetterCapital(char: string): boolean {
        return (LetterHelper.LETTER_A_CAPITAL_KEY_CODE <= char.charCodeAt(0)
            && char.charCodeAt(0) <= LetterHelper.LETTER_Z_CAPITAL_KEY_CODE);
    }

    public static isLetter(char: string): boolean {
        return (char.charCodeAt(0) >= LetterHelper.LETTER_A_KEY_CODE
            && char.charCodeAt(0) <= LetterHelper.LETTER_Z_KEY_CODE);
    }
}

export const MIN_POSITION_INDEX = 0;
export const MAX_POSITION_INDEX = 6;
