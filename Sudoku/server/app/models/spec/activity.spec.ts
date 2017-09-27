import { expect } from "chai";
import { Activity, Type } from "../dashboard/activity";

describe("Activity constructor should", () => {
    let _activity: Activity;
    let _date;

    it("construct an Activity correctly with a Normal Difficulty", () => {
        _date = new Date;
        _activity = new Activity(_date, Type.GRID_DEMAND, "0");
        expect(_activity.date).to.be.equal(_date);
        expect(_activity.type).to.be.equal(Type.GRID_DEMAND);
        expect(_activity.description).to.contains("Facile");
    });

    it("construct an Activity correctly with a Hard Difficulty", () => {
        _date = new Date;
        _activity = new Activity(_date, Type.GRID_GENERATION, "1");
        expect(_activity.date).to.be.equal(_date);
        expect(_activity.type).to.be.equal(Type.GRID_GENERATION);
        expect(_activity.description).to.contains("Difficile");
    });

    it("construct an Activity correctly with another description", () => {
        _date = new Date;
        _activity = new Activity(_date, Type.GRID_GENERATION, "puzzle complet");
        expect(_activity.date).to.be.equal(_date);
        expect(_activity.type).to.be.equal(Type.GRID_GENERATION);
        expect(_activity.description).to.contains("puzzle complet");
    });
});
