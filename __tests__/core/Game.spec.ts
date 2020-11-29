import Game from "@/core/Game";

describe("Abstract Game Bridge", () => {
  it("instantiates empty Game context", () => {
    const game = Game({
      initialPatientState: 0,
    });
    expect(game).toBeInstanceOf(Object);
  });

  it("accepts patientState and reducers to initialize gameState", () => {
    const game = Game({
      initialPatientState: 0,
      patientReducers: {
        ADD: (state: number, payload: number) => state + payload,
      },
    });

    expect(game.getStore().getState().patient).toBe(0);
  });

  it("allows Event emitters & handlers to be specified by Event Options", () => {
    const game = Game({
      initialPatientState: 0,
      eventEmitters: [],
      eventHandlers: [],
    });
  });

  it("allows Event emission and handling", () => {
    let timesEmitted = 0;
    const event = {
      type: "TEST_EVENT",
      shouldEmit: () => ++timesEmitted === 1,
    };

    const handler = {
      handle: (state: any, dispatch: any) => dispatch({ type: "ADD1" }),
      type: "TEST_EVENT",
    };

    const game = Game({
      initialPatientState: 0,
      patientReducers: { ADD1: (s) => s + 1, DO_NOTHING: (s) => s },
      eventEmitters: [event],
      eventHandlers: [handler],
    });

    const store = game.getStore();
    expect(store.getState().patient).toBe(0);

    store.dispatch({ type: "DO_NOTHING" });
    store.dispatch({ type: "DO_NOTHING" });

    expect(store.getState().patient).toBe(1);
  });

  it("allows Events to be scheduled to run after some time", (done) => {
    let timesEmitted = 0;
    const event = {
      type: "DELAYED_EVENT",
      shouldEmit: () => ++timesEmitted === 1,
    };

    const handlerStrategy = jest.fn((s) => s);
    const handler = {
      type: "DELAYED_EVENT",
      handle: handlerStrategy,
      delayMs: 500,
    };

    const game = Game({
      initialPatientState: 0,
      patientReducers: { DO_NOTHING: (s) => s },
      eventEmitters: [event],
      eventHandlers: [handler],
    });

    game.getStore().dispatch({ type: "DO_NOTHING" });

    setTimeout(() => {
      expect(handlerStrategy).toBeCalledTimes(1);
      done();
    }, 500);
  });

  // TODO: game accepts possible options to choose from
  // TODO: game exposes available options
  // TODO: game allows input user option

  // TODO: gamestate exposes text prompts and methods for adding them
});
