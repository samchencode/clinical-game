import Store from "@/lib/Store/Store";
import type { IStore } from "@/lib/Store/Store";
import ConditionalMonitor from "@/lib/Conditional/ConditionalMonitor";

describe("ConditionalMonitorModule", () => {
  let store: IStore<number>;

  beforeEach(() => {
    store = Store({
      initialState: 1,
      reducers: { ADD1: (state) => state + 1 },
    });
  });

  it("creates a new condition monitor", () => {
    const monitor = ConditionalMonitor({ store, conditions: [] });
    expect(monitor).toBeDefined();
    expect(monitor).toEqual(expect.any(Object));
  });

  it("invokes a callback if the condition is met right when store is attached", (done) => {
    const monitor = ConditionalMonitor({
      store,
      conditions: [
        {
          check: (state) => state === 1,
          invoke: (state, dispatch) => {
            done();
          },
        },
      ],
    });
  });

  it("invokes a callback if the condition is met after a change in the state", (done) => {
    const cb = jest.fn();
    ConditionalMonitor({
      store,
      conditions: [
        {
          check: (s) => s === 2,
          invoke: () => {
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
