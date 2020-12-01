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

  it("accepts a scheduled event and run an action after timer", (done) => {
    const game = Game({
      initialPatientState: 0,
      patientReducers: {
        DONE: s => !done() && s
      },
      initialScheduledEvents: [{ action: { type: "DONE" }, delayMs: 0 }]
    });
  })
  // TODO: game accepts possible options to choose from
  // TODO: game exposes available options
  // TODO: game allows input user option

  // TODO: gamestate exposes text prompts and methods for adding them
});
