// import { expect } from "chai";
// import { TimerService } from "./timer-service";

// let timerService: TimerService;
// const FIVE_MINUTES = 300;
// const ONE_MINUTE = 60;
// describe("TimerService properties validation", () => {

//     beforeEach(() => {
//         timerService = new TimerService();
//     });

//     it("Timer attributes should be initialized correctly", () => {
//         expect(timerService.seconds).to.be.equal(0);
//         expect(timerService.minutes).to.be.equal(5);
//     });


//     it("Timer attributes should be correct after 60 ticks", done => {
//         for (let i = 0; i < ONE_MINUTE; ++i) {
//             timerService.updateClock();
//         }
//         expect(timerService.seconds).to.be.equal(0);
//         expect(timerService.minutes).to.be.equal(4);

//         timerService.updateClock();

//         expect(timerService.seconds).to.be.equal(59);
//         expect(timerService.minutes).to.be.equal(3);
//         done();
//     });

//     it("Timer attributes should be set to 0 after 300 ticks", done => {
//         for (let i = 0; i < FIVE_MINUTES; ++i) {
//             timerService.updateClock();
//         }
//         expect(timerService.seconds).to.be.equal(0);
//         expect(timerService.minutes).to.be.equal(0);
//         done();
//     });

//     it("allow a player to play when he still have time", () => {
//         // timerService.minutes = 1;
//         // timerService.seconds = 0;
//         // expect(timerService.timerIsRunning()).to.be.true;
//         // timerService.minutes = 0;
//         // timerService.seconds = 15;
//         // expect(timerService.timerIsRunning()).to.be.true;
//         // timerService.minutes = 3;
//         // timerService.seconds = 9;
//         // expect(timerService.timerIsRunning()).to.be.true;
//     });
//     it("prevent a player to play if time is done", () => {
//         // timerService.minutes = 0;
//         // timerService.seconds = 0;
//         expect(timerService.timerIsRunning()).to.be.false;
//     });
// });
