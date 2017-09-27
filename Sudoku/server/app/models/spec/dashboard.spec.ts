import { expect } from "chai";
import { Dashboard } from "../dashboard/dashboard";
import { Activity, Type } from "../dashboard/activity";
let dashboard = Dashboard.getInstance();

describe("Dashboard tests should", () => {
    let activity: Activity;

    beforeEach(() => {
        activity = new Activity(new Date, Type.GRID_DEMAND, "0");
        dashboard.activities.splice(0, dashboard.activities.length);
    });

    it(" return the same instance of the dashboard", () => {
        let dashboardClone = Dashboard.getInstance();
        expect(dashboard).to.equal(dashboardClone);
    });

    it("return all recorded activities", () => {
        dashboard.addActivity(activity);
        expect(dashboard.activities.length).to.equal(1);
    });


    it("should always keep 100 elements in the dashboard", () => {
        for (let i = 0; i < 200; i ++) {
            dashboard.addActivity(activity);
        }
        expect(dashboard.activities.length).to.equal(100);
    });



});
