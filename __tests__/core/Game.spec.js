"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Game_1 = require("@/core/Game");
describe("Abstract Game Bridge", function () {
    it("instantiates empty Game context", function () {
        var game = Game_1.default({
            initialPatientState: 0,
            viewAgent: null,
        });
        expect(game).toBeInstanceOf(Object);
    });
    it("accepts patientState and reducers to initialize gameState", function () {
        var game = Game_1.default({
            viewAgent: null,
            initialPatientState: 0,
            patientReducers: {
                ADD: function (state, payload) { return state + payload; },
            },
        });
        expect(game.store.getState().patient).toBe(0);
    });
    it("accepts a scheduled event and run an action after timer", function (done) {
        var game = Game_1.default({
            viewAgent: null,
            initialPatientState: 0,
            patientReducers: {
                DONE: function (s) { return !done() && s; }
            },
            initialScheduledEvents: [{ action: { type: "DONE" }, delayMs: 0 }]
        });
    });
    // TODO: game accepts possible options to choose from
    // TODO: game exposes available options
    // TODO: game allows input user option
    // TODO: gamestate exposes text prompts and methods for adding them
});
