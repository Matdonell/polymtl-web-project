export class RandomHelper {
    public static getNumberInRangeIncluded(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    public static getIntegerNumberInRange(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
