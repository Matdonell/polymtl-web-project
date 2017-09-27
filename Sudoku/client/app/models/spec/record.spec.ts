import { Difficulty } from "../user-setting";
import { Record } from "../record";
import { Time } from "../time";

import { expect } from "chai";

describe("Records tests", () => {
    let record: Record;
    let time: Time;
    let difficulty: Difficulty;

    before(() => {
        time = new Time();
        time.seconds = 10;

        difficulty = Difficulty.HARD;
    });

    it("should create a record object", () => {
        record = new Record("George", difficulty, time);
        expect(record).to.be.an.instanceOf(Record, "is not an instance of record");
        expect(record.difficulty).to.equal(Difficulty.HARD, "is not an instance of Difficulty");
        expect(record.username).to.equal("George", "username is not george");
        expect(record.time.seconds).to.equal(10, "time isn't correctly initialized");
    });

    it("should set the time of a record object", () => {
        record = new Record("Clooney", difficulty, time);
        let time1 = new Time(); time1.seconds = 15;
        record.time = time1;

        expect(record.time.seconds).to.not.equal(10, "did not change the time");
        expect(record.time.seconds).to.equal(15, "did not correctly set the time");
    });

    it("should set the username of a record object", () => {
        record = new Record("Clooney", difficulty, time);
        record.username = "Benedict";
        expect(record.username).to.not.equal("Clooney", "did not change the username");
        expect(record.username).to.equal("Benedict", "did not correctly set the username");
    });

    it("should set the difficulty of a record object", () => {
        record = new Record("Cucumber", difficulty, time);
        record.difficulty = Difficulty.NORMAL;
        expect(record.difficulty).to.not.equal(Difficulty.HARD, "did not change the difficulty");
        expect(record.difficulty).to.equal(Difficulty.NORMAL, "did not correctly set the difficulty");
    });
});
