import Game from "@/core/Game";

describe("Abstract Game Bridge", () => {
  it("instantiates empty Game context", () => {
    const context = Game({
      initialPatientState: 0,
    });
    expect(context).toBeInstanceOf(Object);
  });

  it("accepts patientState and reducers to initialize gameState", () => {
    const context = Game({
      initialPatientState: 0,
      patientReducers: {
        ADD: (state: number, payload: number) => state + payload,
      },
    });

    expect(context.getStore().getState().patient).toBe(0);
  });
});
