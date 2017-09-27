import { UserService } from "./../user.service";
import { Difficulty } from "./../../models/difficulty";
import { RestApiProxyService } from "./../rest-api-proxy.service";
import {
    Http, ResponseOptions,
    Response,
    BaseRequestOptions,
    ConnectionBackend
} from "@angular/http";

import { MockBackend, MockConnection } from "@angular/http/testing";
import { expect } from "chai";
import { TestBed, tick, inject, fakeAsync } from "@angular/core/testing";

describe("UserSettingService should", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{
                provide: Http,

                // Add a factory for the backend
                useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
                    return new Http(backend, defaultOptions);
                },
                deps: [MockBackend, BaseRequestOptions]
            },
                UserService,
                RestApiProxyService,
                MockBackend,
                BaseRequestOptions
            ]
        });
    });


    // Tests for the constructor
    it("initialize the user setting service correctly",
        inject([UserService, RestApiProxyService],
            fakeAsync((_userSettingService: UserService, api: RestApiProxyService) => {
                expect(_userSettingService.username).to.be.equal("");
                expect(_userSettingService.difficulty).to.be.equal(Difficulty.NORMAL);
            })));

    // Tests for verifyUsername
    it("verify username is valid.",
        inject([UserService, RestApiProxyService, MockBackend],
            fakeAsync((_userSettingService: UserService, api: RestApiProxyService, mockBackend: MockBackend) => {
                mockBackend.connections.subscribe((connection: MockConnection) => {
                    // Send the fake data to the caller
                    connection.mockRespond(new Response(new ResponseOptions({ body: true, status: 200 })));
                });
                let retour: boolean;
                _userSettingService.verifyUsername("test").then(result => {
                    retour = result;
                });

                tick();
                expect(retour).to.be.true;
            })));

    it("verify username is not valid because already present in the database.",
        inject([UserService, RestApiProxyService, MockBackend],
            fakeAsync((_userSettingService: UserService, api: RestApiProxyService, mockBackend: MockBackend) => {
                mockBackend.connections.subscribe((connection: MockConnection) => {
                    // Send the fake data to the caller
                    connection.mockRespond(new Response(new ResponseOptions({ body: false, status: 400 })));
                });
                let retour: boolean;
                _userSettingService.verifyUsername("blabla").then(result => {
                    retour = result;
                });

                tick();
                expect(retour).to.be.false;
            })));

    it("verify username is not valid because empty.",
        inject([UserService, RestApiProxyService, MockBackend],
            fakeAsync((_userSettingService: UserService, api: RestApiProxyService, mockBackend: MockBackend) => {
                mockBackend.connections.subscribe((connection: MockConnection) => {
                    // Send the fake data to the caller
                    connection.mockRespond(new Response(new ResponseOptions({ body: false, status: 400 })));
                });
                let retour: boolean;
                _userSettingService.verifyUsername("").then(result => {
                    retour = result;
                });

                tick();
                expect(retour).to.be.false;
            })));

    it("verify username is not valid because an error occured.",
        inject([UserService, RestApiProxyService, MockBackend],
            fakeAsync((_userSettingService: UserService, api: RestApiProxyService, mockBackend: MockBackend) => {
                mockBackend.connections.subscribe((connection: MockConnection) => {
                    // Send the fake data to the caller
                    connection.mockRespond(new Response(new ResponseOptions({ body: false, status: 503 })));
                });
                let retour: boolean;
                _userSettingService.verifyUsername("")
                    .then(result => {
                        retour = result;
                    })
                    .catch(error => {
                        retour = false;
                    });

                tick();
                expect(retour).to.be.false;
            })));

    // Tests for getComputerName
    it("get computerName correctly in case difficulty is Normal",
        inject([UserService, RestApiProxyService],
            fakeAsync((_userSettingService: UserService, api: RestApiProxyService) => {
                _userSettingService.difficulty = Difficulty.NORMAL;
                expect(_userSettingService.getComputerName()).to.contains("CPU Normal");
            })));

    it("get computerName correctly in case difficulty is Hard",
        inject([UserService, RestApiProxyService],
            fakeAsync((_userSettingService: UserService, api: RestApiProxyService) => {
                _userSettingService.difficulty = Difficulty.HARD;
                expect(_userSettingService.getComputerName()).to.contains("CPU Difficile");
            })));

    // Tests for activateButtonNextLogin
    it("returns true to activate the ButtonNext on login page when the username has been filled.",
        inject([UserService, RestApiProxyService],
            fakeAsync((_userSettingService: UserService, api: RestApiProxyService) => {
                expect(_userSettingService.activateButtonNextLogin("test")).to.be.true;
            })));

    it("returns false when the username has not been filled.",
        inject([UserService, RestApiProxyService],
            fakeAsync((_userSettingService: UserService, api: RestApiProxyService) => {
                expect(_userSettingService.activateButtonNextLogin("")).to.be.false;
            })));
});
