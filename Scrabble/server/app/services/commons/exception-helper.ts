export class ExceptionHelper {

    public static throwNullArgumentException(param: any) {
        if (param === null) {
            throw new Error("Null argument exception: the parameter cannot be null");
        }
    }

    public static throwOutOfRangeException(minValue: number, maxValue: number, param: number) {
        if (param < minValue) {
            throw new RangeError("Out of range exception: the parameter cannot be less than" + " " + minValue);
        } else if (param > maxValue) {
            throw new RangeError("Out of range exception: the parameter cannot be greater than" + " " + maxValue);
        }
    }
}
