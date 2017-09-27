import { Activity } from "./activity";

const MAX_NUMBER_OF_ACTIVITIES = 101;

export class Dashboard {
    private static _instance: Dashboard;
    private _activities: Activity[];

    public static getInstance(): Dashboard {
        if (Dashboard._instance === null || Dashboard._instance === undefined) {
            Dashboard._instance = new Dashboard();
        }
        return Dashboard._instance;
    }

    private constructor() {
        this._activities = new Array<Activity>();
    }

    get activities(): Activity[] {
        return this._activities;
    }

    public addActivity(activity: Activity) {
        this._activities.push(activity);
        if (this._activities.length === MAX_NUMBER_OF_ACTIVITIES) {
            this._activities.shift();
        }
    }
}
