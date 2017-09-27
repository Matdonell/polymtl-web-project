import { expect } from "chai";
import { ExceptionHelper } from "../commons/exception-helper";

describe("ExceptionHelper", () => {

    it("should throw a null argument exception", () => {
        let wrapper = () => ExceptionHelper.throwNullArgumentException(null);
        expect(wrapper).throw(Error, "Null argument exception: the parameter cannot be null");
    });

    it("should not throw a null argument exception", () => {
        let wrapper = () => ExceptionHelper.throwNullArgumentException("not null param");
        expect(wrapper).not.throw(Error, "Null argument exception: the parameter cannot be null");
    });

    it("should not throw an out of range exception", () => {
        let minValue = 1;
        let maxValue = 15;
        let param = (Math.random() * (maxValue - minValue)) + minValue;
        let wrapper = () => ExceptionHelper.throwOutOfRangeException(minValue, maxValue, param);
        expect(wrapper).to.not.throw(RangeError);
    });

    it("should throw an out of range exception if greater than the max value", () => {
        let minValue = 1;
        let maxValue = 15;
        let param = (Math.random() * (30)) + (maxValue + 10);
        let wrapper = () => ExceptionHelper.throwOutOfRangeException(minValue, maxValue, param);

        expect(wrapper).throw(RangeError, "Out of range exception: the parameter cannot be greater than");
    });

    it("should throw an out of range exception", () => {
        let minValue = 1;
        let maxValue = 15;
        let param = 0;
        let wrapper = () => ExceptionHelper.throwOutOfRangeException(minValue, maxValue, param);

        expect(wrapper).throw(RangeError, "Out of range exception: the parameter cannot be less than" + " " + minValue);
    });
});
