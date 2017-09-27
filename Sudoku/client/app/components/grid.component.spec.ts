import { CUSTOM_ELEMENTS_SCHEMA, Injectable } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BaseRequestOptions, ConnectionBackend, Http, HttpModule, Response, ResponseOptions } from "@angular/http";
import { Router } from "@angular/router";
import { async, ComponentFixture, fakeAsync, inject, TestBed } from "@angular/core/testing";
import { MockBackend, MockConnection } from "@angular/http/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { assert, expect } from "chai";

import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";

import { GridManagerService } from "../services/grid-manager.service";
import { PuzzleEventManagerService } from "../services/puzzle-event-manager.service";
import { RestApiProxyService } from "../services/rest-api-proxy.service";
import { StopwatchService } from "../services/stopwatch.service";
import { UserSettingService } from "../services/user-setting.service";

import { FAKE_PUZZLE_FEED, INITIAL_PUZZLE_SEED } from "./../services/mock-data";
import { GridComponent } from "./grid.component";
import { Puzzle } from "../models/puzzle";

// Mock the REST API Service to give a fake result after a request.
@Injectable()
class MockRestApiService extends RestApiProxyService {
    protected _urlApi: "http://localhost:3002/api/";

    getNewPuzzle(): Observable<Puzzle> {
        return Observable.of(new Puzzle(FAKE_PUZZLE_FEED));
    }
}

describe("GridComponent", () => {

    let comp: GridComponent;
    let fixture: ComponentFixture<GridComponent>;

    const FAKE_INITIAL_PUZZLE = new Puzzle(INITIAL_PUZZLE_SEED);
    const FAKE_PUZZLE = new Puzzle(FAKE_PUZZLE_FEED);

    beforeEach(async (() => {
        TestBed.configureTestingModule({
            declarations: [ GridComponent ], // declare the test component
            schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
            imports: [ FormsModule, HttpModule, RouterTestingModule ],
            providers: [
                {   // Import the necessary providers
                    provide: Http, Router,
                    // Add a factory for the backend
                    useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
                        return new Http(backend, defaultOptions);
                    },
                    deps: [ MockBackend, BaseRequestOptions ]
                },
                { provide: RestApiProxyService, useClass: MockRestApiService },
                { provide: GridManagerService, PuzzleEventManagerService },
                MockBackend,
                MockRestApiService,
                BaseRequestOptions,
                UserSettingService,
                StopwatchService
            ]
        })
            .compileComponents();
    }));

    beforeEach(inject([RestApiProxyService, MockBackend],
        fakeAsync((restApiProxyService: RestApiProxyService, mockBackend: MockBackend) => {
            mockBackend.connections.subscribe((connection: MockConnection) => {
                // Send a fake data to the caller
                connection.mockRespond(new Response(new ResponseOptions({ body: FAKE_PUZZLE_FEED })));
            });
            fixture = TestBed.createComponent(GridComponent);
            comp = fixture.componentInstance;
        }))
    );

    // //Testing the method InitializeCurrentGrid by giving an empty grid.
    it("initializeCurrentGrid should throw a null argument error", () => {
        comp._puzzle = null;
        assert.throws(() => comp.initializeCurrentGrid(), Error, "The initial grid cannot be null");
    });

    // Testing the method InitializeCurrentGrid by using a valid grid.
    it("initializeCurrentGrid should reset the current grid",
        inject([ GridManagerService ], (gridManagerService: GridManagerService) => {

            // Must be completed
            comp._puzzle = FAKE_PUZZLE;
            comp.initializeCurrentGrid();

            // Check the expected result
            expect(comp._puzzle).to.deep.equal(FAKE_INITIAL_PUZZLE);
        })
    );

    it("validateInputValue, should throw a null argument error", () => {
        assert.throws(() => comp.validateInputValue(null), Error, "No event source is provided.");
    });
});
