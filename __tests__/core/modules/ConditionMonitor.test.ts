import Store from "@/lib/Store/Store";
import type { IStore } from "@/lib/Store/Store";
import ConditionalMonitor from "@/core/modules/ConditionalMonitor";
import type { IGameContext, IGameState } from "@/core/Game";

describe("ConditionalMonitorModule", () => {
  type State = IGameState<number>;
  let store: IStore<State>;
  let context: Partial<IGameContext<number>>;

  beforeEach(() => {
    store = Store({
      initialState: { patient: 1 } as State,
      reducers: { ADD1: (state) => ({ patient: state.patient + 1 } as State) },
    });

    context = { store };
  });

  it("creates a new condition monitor", () => {
    const monitor = ConditionalMonitor({ context, conditions: [] });
    expect(monitor).toBeDefined();
    expect(monitor).toEqual(expect.any(Object));
  });

  it("executes a callback if the condition is met right when store is attached", (done) => {
    const monitor = ConditionalMonitor({
      context,
      conditions: [
        {
          check: (patient) => patient === 1,
          execute: (patient, context) => {
            done();
          },
        },
      ],
    });
  });

  it("executes a callback if the condition is met after a change in the state", (done) => {
    const cb = jest.fn();
    ConditionalMonitor({
      context,
      conditions: [
        {
          check: (p) => p === 2,
          execute: () => {
            cb();
            done();
          },
        },
      ],
    });
    expect(cb).not.toHaveBeenCalled();
    store.dispatch({ type: "ADD1" });
    expect(cb).toHaveBeenCalledTimes(1);
  });
});
