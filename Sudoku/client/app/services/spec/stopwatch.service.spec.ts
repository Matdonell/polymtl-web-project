import { expect } from "chai";

import { StopwatchService } from "../stopwatch.service";

let service: StopwatchService;

describe("Stopwatch service tests", () => {

    it("seconds property should be equal to 5", () => {
        service = new StopwatchService();

        setInterval(5000, () => {
            service.updateClock();
            expect(service.seconds).to.equal(5, "seconds property is not equal to 5...");
            expect(service.minutes).to.equal(0, "minute property is not equal to 0...");
            expect(service.hours).to.equal(0, "hour property is not equal to 0...");
        });

    });

    it("minute property should be equal to 1", done => {

        service = new StopwatchService();
        setInterval(60000, () => {

            service.updateClock();
            expect(service.seconds).to.equal(0, "seconds property is not equal to 0...");
            expect(service.minutes).to.equal(1, "minute property is not equal to 1...");
            expect(service.hours).to.equal(0, "hour property is not equal to 0...");

        });
        done();

    });

    it("hour property should be equal to 1", done => {
        service = new StopwatchService();

        setInterval(3600000, () => {
            service.updateClock();
            expect(service.seconds).to.equal(0, "seconds property is not equal to 5...");
            expect(service.minutes).to.equal(0, "minute property is not equal to 0...");
            expect(service.hours).to.equal(1, "hour property is not equal to 1...");

        });
        done();

    });

    it("hour property should be equal to 0", () => {
        service = new StopwatchService();

        service.updateClock ();
        expect(service.seconds).to.equal(0, "seconds property is not equal to 5...");
        expect(service.minutes).to.equal(0, "minute property is not equal to 0...");
        expect(service.hours).to.equal(0, "hour property is not equal to 0...");
    });
});
