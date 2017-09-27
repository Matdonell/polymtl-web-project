import { TestBed, tick, inject, fakeAsync } from "@angular/core/testing";
import { BaseRequestOptions, ConnectionBackend, Http, ResponseOptions, Response } from "@angular/http";
import { MockBackend, MockConnection } from "@angular/http/testing";

import { expect } from "chai";

import { RestApiProxyService } from "../rest-api-proxy.service";
import { UserSettingService } from "../user-setting.service";

import { Difficulty, UserSetting } from "../../models/user-setting";

describe("UserSettingService should", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{
                provide: Http,

                // Add a factory for the backend
                useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
                    return new Http(backend, defaultOptions);
                },
                deps: [ MockBackend, BaseRequestOptions ]
            },
                BaseRequestOptions,
                MockBackend,
                RestApiProxyService,
                UserSettingService
            ]
        });
    });

    // Tests for the constructor
    it("initialize the user setting service correctly",
        inject([ UserSettingService, RestApiProxyService ],
            fakeAsync((_userSettingService: UserSettingService, api: RestApiProxyService) => {
                expect(_userSettingService.userSetting.name).to.be.equal("");
                expect(_userSettingService.userSetting.difficulty).to.be.equal(Difficulty.NORMAL);
            }))
    );

    // Tests for verifyUsername
    it("verify username is valid.",
        inject([ UserSettingService, RestApiProxyService, MockBackend ],
            fakeAsync((_userSettingService: UserSettingService, api: RestApiProxyService, mockBackend: MockBackend) => {
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
            }))
    );

    it("verify username is not valid because already present in the database.",
        inject([ UserSettingService, RestApiProxyService, MockBackend ],
            fakeAsync((_userSettingService: UserSettingService, api: RestApiProxyService, mockBackend: MockBackend) => {
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
            }))
    );

    it("verify username is not valid because empty.",
        inject([ UserSettingService, RestApiProxyService, MockBackend ],
            fakeAsync((_userSettingService: UserSettingService, api: RestApiProxyService, mockBackend: MockBackend) => {
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
            }))
    );

    it("verify username is not valid because an error occured.",
        inject([ UserSettingService, RestApiProxyService, MockBackend ],
            fakeAsync((_userSettingService: UserSettingService, api: RestApiProxyService, mockBackend: MockBackend) => {
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
            }))
    );

    // Tests for the UserSetting gettter
    it("get userSetting correctly",
        inject([ UserSettingService ],
            fakeAsync((_userSettingService: UserSettingService) => {
                let _user = new UserSetting();
                _user.name = "";
                _user.difficulty = Difficulty.NORMAL;
                expect(_userSettingService.userSetting.name).to.be.equal(_user.name);
                expect(_userSettingService.userSetting.difficulty).to.be.equal(_user.difficulty);
            }))
    );

    // Tests for the UserSetting setter
    it("set UserSetting correctly",
        inject([ UserSettingService, RestApiProxyService ],
            fakeAsync((_userSettingService: UserSettingService, api: RestApiProxyService) => {
                let _user = new UserSetting();
                _userSettingService.userSetting.name = "test";
                _userSettingService.userSetting = _user;
                expect(_userSettingService.userSetting.name).to.be.equal(_user.name);
                expect(_userSettingService.userSetting.difficulty).to.be.equal(_user.difficulty);
                expect(_userSettingService.userSetting).to.be.equal(_user);
            }))
    );

    // Tests for setName
    it("set name correctly",
        inject([UserSettingService, RestApiProxyService],
            fakeAsync((_userSettingService: UserSettingService, api: RestApiProxyService) => {
                let _user = new UserSetting();
                _user.name = "Louis";
                _userSettingService.setName("Louis");
                expect(_userSettingService.userSetting.name).to.be.equal(_user.name);
            }))
    );

    // Tests for setDifficulty
    it("set Difficulty correctly",
        inject([UserSettingService, RestApiProxyService],
            fakeAsync((_userSettingService: UserSettingService, api: RestApiProxyService) => {
                let _user = new UserSetting();
                _user.difficulty = Difficulty.HARD;
                _userSettingService.setDifficulty(Difficulty.HARD);
                expect(_userSettingService.userSetting.difficulty).to.be.equal(_user.difficulty);
            }))
    );

    // Tests for getComputerName
    it("get computerName correctly in case difficulty is Normal",
        inject([UserSettingService, RestApiProxyService],
            fakeAsync((_userSettingService: UserSettingService, api: RestApiProxyService) => {
                _userSettingService.setDifficulty(Difficulty.NORMAL);
                expect(_userSettingService.getComputerName()).to.contains("CPU Normal");
            }))
    );

    it("get computerName correctly in case difficulty is Hard",
        inject([UserSettingService, RestApiProxyService],
            fakeAsync((_userSettingService: UserSettingService, api: RestApiProxyService) => {
                _userSettingService.setDifficulty(Difficulty.HARD);
                expect(_userSettingService.getComputerName()).to.contains("CPU Difficile");
            }))
    );

    // Tests for activateButtonNextLogin
    it("returns true to activate the ButtonNext on login page when the username has been filled.",
        inject([UserSettingService, RestApiProxyService],
            fakeAsync((_userSettingService: UserSettingService, api: RestApiProxyService) => {
                expect(_userSettingService.activateButtonNextLogin("test")).to.be.true;
            }))
    );

    it("returns false when the username has not been filled.",
        inject([UserSettingService, RestApiProxyService],
            fakeAsync((_userSettingService: UserSettingService, api: RestApiProxyService) => {
                expect(_userSettingService.activateButtonNextLogin("")).to.be.false;
            }))
    );
});
