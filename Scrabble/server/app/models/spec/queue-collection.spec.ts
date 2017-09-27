import { expect, assert } from "chai";
import { QueueCollection } from "../queue-collection";
import { Player } from "../player";

let fakeName1 = "testname1";
let fakeName2 = "testname2";
let fakeSocketId1 = "fakeId@33md0020";
let fakeSocketId2 = "fakeId@33md4012";
let numberOfPlayers = 2;

let fakePlayer1 = new Player(fakeName1, numberOfPlayers, fakeSocketId1);
let fakePlayer2 = new Player(fakeName2, numberOfPlayers, fakeSocketId2);

let queueCollection: QueueCollection<Player>;
describe("QueueCollection", () => {

    it("should create a new QueueCollection", () => {
        queueCollection = new QueueCollection<Player>();

        expect(queueCollection).not.to.be.undefined;
        assert(queueCollection.count === 0);
    });

    it("should add a player with success", () => {
        queueCollection = new QueueCollection<Player>();
        queueCollection.enqueue(fakePlayer1);

        assert(queueCollection.count === 1);

        let addedPlayer = queueCollection.dequeue();
        assert(queueCollection.count === 0);
        expect(addedPlayer).to.deep.equals(fakePlayer1);
    });

    it("should add two players with success", () => {
        queueCollection = new QueueCollection<Player>();
        queueCollection.enqueue(fakePlayer1);
        queueCollection.enqueue(fakePlayer2);

        assert(queueCollection.count === 2);

        let addedPlayer1 = queueCollection.dequeue();
        expect(addedPlayer1).to.deep.equals(fakePlayer1);
        assert(queueCollection.count === 1);

        let addedPlayer2 = queueCollection.dequeue();
        expect(addedPlayer2).to.deep.equals(fakePlayer2);
        assert(queueCollection.count === 0);
    });

    it("should throw a null argument exception", () => {
        queueCollection = new QueueCollection<Player>();
        let callback = () => queueCollection.enqueue(null);

        expect(callback).throw(Error, "Null argument exception: the parameter should not be null");
    });

    it("should return null when the list is empty", () => {
        queueCollection = new QueueCollection<Player>();
        let nullValue = queueCollection.dequeue();
        expect(nullValue).to.be.null;
    });

    it("should dequeue the first players with success", () => {
        queueCollection = new QueueCollection<Player>();
        queueCollection.enqueue(fakePlayer1);
        queueCollection.enqueue(fakePlayer2);

        assert(queueCollection.count === 2);

        let addedPlayer1 = queueCollection.dequeue();
        expect(addedPlayer1).to.deep.equals(fakePlayer1);
        assert(queueCollection.count === 1);
    });

    it("should dequeue the all the players with success", () => {
        queueCollection = new QueueCollection<Player>();
        queueCollection.enqueue(fakePlayer1);
        queueCollection.enqueue(fakePlayer2);

        assert(queueCollection.count === 2);

        let addedPlayer1 = queueCollection.dequeue();
        expect(addedPlayer1).to.deep.equals(fakePlayer1);
        assert(queueCollection.count === 1);

        let addedPlayer2 = queueCollection.dequeue();
        expect(addedPlayer2).to.deep.equals(fakePlayer2);
        assert(queueCollection.count === 0);
    });

    it("should remove players with success", () => {
        queueCollection = new QueueCollection<Player>();
        queueCollection.enqueue(fakePlayer1);
        queueCollection.enqueue(fakePlayer2);

        assert(queueCollection.count === 2);

        let addedPlayer1 = queueCollection.remove(fakePlayer1);
        expect(addedPlayer1).to.deep.equals(fakePlayer1);
        assert(queueCollection.count === 1);

        let addedPlayer2 = queueCollection.remove(fakePlayer2);
        expect(addedPlayer2).to.deep.equals(fakePlayer2);
        assert(queueCollection.count === 0);
    });

    it("should throw a null argument exception", () => {
        queueCollection = new QueueCollection<Player>();
        queueCollection.enqueue(fakePlayer1);

        let callback = () => queueCollection.remove(null);
        expect(callback).throw(Error, "Null argument exception: the parameter should not be null");
    });

    it("should return null for unexisting value", () => {
        queueCollection = new QueueCollection<Player>();
        queueCollection.enqueue(fakePlayer1);

        let removedItem = queueCollection.remove(fakePlayer2);
        expect(removedItem).to.be.null;
    });

    it("should iterate through the collection of players with success", () => {
        queueCollection = new QueueCollection<Player>();
        let listPlayers = new Array<Player>();

        queueCollection.enqueue(fakePlayer1);
        queueCollection.enqueue(fakePlayer2);

        queueCollection.forEach((player) => {
            listPlayers.push(player);
        });

        assert(listPlayers.length === 2);
        expect(listPlayers[0]).to.deep.equals(fakePlayer1);
        expect(listPlayers[1]).to.deep.equals(fakePlayer2);
    });

    it("should find a player with success", () => {
        queueCollection = new QueueCollection<Player>();
        queueCollection.enqueue(fakePlayer1);

        let addedPlayer = queueCollection.find(fakePlayer1);
        expect(addedPlayer).to.deep.equals(fakePlayer1);
    });

    it("should throw a null argument exception", () => {
        queueCollection = new QueueCollection<Player>();
        let callback = () => queueCollection.find(null);

        expect(callback).throw(Error, "Null argument exception: the parameter should not be null");
    });

    it("should invert the order of the list", () => {
        queueCollection = new QueueCollection<Player>();
        let priorityList = new Array<Player>();

        queueCollection.enqueue(fakePlayer1);
        queueCollection.enqueue(fakePlayer2);

        // Should invert the order of the list
        priorityList = queueCollection.updateAndGetQueuePriorities();
        expect(priorityList[0]).to.deep.equals(fakePlayer2);
        expect(priorityList[1]).to.deep.equals(fakePlayer1);

        // Should invert the order of the list
        priorityList = queueCollection.updateAndGetQueuePriorities();
        expect(priorityList[0]).to.deep.equals(fakePlayer1);
        expect(priorityList[1]).to.deep.equals(fakePlayer2);
    });
});
