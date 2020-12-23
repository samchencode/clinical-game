import Game from "@/core/Game";
import type { IViewAgent, IViewableVisitor } from "@/lib/View/View";

describe("Abstract Game Bridge", () => {
  it("instantiates empty Game context", () => {
    const game = Game({
      viewAgent: null,
      initialPatientState: 0,
    });
    expect(game).toBeInstanceOf(Object);
  });

  it("accepts patientState and reducers to initialize gameState", () => {
    const game = Game({
      viewAgent: null,
      initialPatientState: 0,
      patientReducers: {
        ADD: (state: number, payload: number) => state + payload,
      },
    });

    expect(game.store.getState().patient).toBe(0);
  });

  it("accepts a scheduled event and run an action after timer", (done) => {
    const game = Game({
      viewAgent: null,
      initialPatientState: 0,
      patientReducers: {
        DONE: (s) => !done() && s,
      },
      initialScheduledEvents: [{ action: { type: "DONE" }, delayMs: 0 }],
    });
  });

  it("accepts possible options to choose from", () => {
    const game = Game({
      viewAgent: null,
      initialPatientState: 0,
      patientOptions: [
        {
          name: "TEST_OPTION",
          isAvailable: (s) => false,
          execute: () => {},
        },
      ],
    });
  });

  it("exposes available options", () => {
    const game = Game({
      viewAgent: null,
      initialPatientState: 0,
      patientOptions: [
        {
          name: "UNAVAILABLE_OPTION",
          isAvailable: (s) => false,
          execute: () => {},
        },
        {
          name: "AVAILABLE_OPTION",
          isAvailable: (s) => true,
          execute: () => {},
        },
      ],
    });

    expect(game.patient.getOptions()).toEqual(
      expect.arrayContaining([
        expect.not.objectContaining({ name: "UNAVAILABLE_OPTION" }),
      ])
    );
    expect(game.patient.getOptions()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "AVAILABLE_OPTION" }),
      ])
    );
  });

  it("accepts and runs conditionals", (done) => {
    const game = Game({
      viewAgent: null,
      initialPatientState: 0,
      conditionals: [
        {
          check: (s) => s.patient === 0,
          invoke: () => {
            done();
          },
        },
      ],
    });
  });

  it("allows custom viewAgents", () => {
    const mockViewableVisitor: IViewableVisitor = {
      displayText: jest.fn(),
      displayImage: jest.fn(),
      displayOption: jest.fn(),
    };

    const mockViewAgent: IViewAgent = {
      renderer: jest.fn(() => mockViewableVisitor),
      done: jest.fn(),
      close: jest.fn(),
    };

    const game = Game({ viewAgent: mockViewAgent, initialPatientState: 0 });

    expect(mockViewableVisitor.displayText).not.toHaveBeenCalled();
    game.scribe.text('Hello World');
    expect(mockViewableVisitor.displayText).toHaveBeenCalledTimes(1);
    expect(mockViewableVisitor.displayText).toHaveBeenCalledWith('Hello World');
  });
});
