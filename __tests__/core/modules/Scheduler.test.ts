import Scheduler from "@/lib/Scheduler/Scheduler";
import type { ISchedulerState } from "@/lib/Scheduler/Scheduler";
import type { IEventParameters } from "@/lib/Scheduler/Event";
import Store from "@/lib/Store/Store";
import type { IStore, IReducerMap } from "@/lib/Store/Store";
import schedulerReducers from "@/lib/Scheduler/schedulerReducers";
import createSchedulerMiddleware from "@/lib/Scheduler/schedulerMiddleware";
import type { IGameContext, IGameState } from "@/core/Game";
import createLoggerMiddleware from "@/lib/loggerMiddleware";

jest.useFakeTimers();

type State = IGameState<unknown>;
type Context = Partial<IGameContext<unknown>>;

let store: IStore<State>;
let context: Context;

const initialState: State = {
  scheduler: {
    pendingDispatch: [],
  },
} as State;

const reducers = schedulerReducers() as IReducerMap<State>;

const storeParams = {
  initialState,
  reducers,
  middleware: [
    createSchedulerMiddleware(),
    // createLoggerMiddleware({ logActions: true }),
  ],
};

beforeEach(() => {
  store = Store<IGameState<unknown>>(storeParams);
  context = { store };
  jest.clearAllMocks();
});

describe("SchedulerModule", () => {
  it("creates a scheduler module instance", () => {
    const scheduler = Scheduler({ store, context });
    expect(scheduler).not.toBeFalsy();
  });

  it("accepts initial events on instantiation and writes to store", () => {
    const initialEvents: IEventParameters[] = [
      { delayMs: 0, action: { type: "TEST" } },
      { delayMs: 0, action: { type: "TEST" } },
    ];

    Scheduler({ store, initialEvents, context });
    expect(store.getState().scheduler.pendingDispatch.length).toBe(2);
    expect(store.getState().scheduler.pendingDispatch[0].action.type).toBe(
      "TEST"
    );
  });

  it("dispatches actions after a delay and removes events on execution", (done) => {
    const initialEvents: IEventParameters[] = [
      { delayMs: 250, action: { type: "TEST" } },
    ];

    store = Store<State>({
      ...storeParams,
      reducers: {
        ...reducers,
        TEST: (s) => !done() && s,
      },
    });

    Scheduler({ store, initialEvents, context });
    expect(store.getState().scheduler.pendingDispatch[0].timerId).toBeDefined();

    jest.runAllTimers();
    expect(setTimeout).toBeCalledTimes(1);
  });

  it("dispatches repeating actions", () => {
    store = Store<State>({
      ...storeParams,
      reducers: {
        ...reducers,
        TEST: (s) => s,
      },
    });

    Scheduler({
      store,
      initialEvents: [{ delayMs: 250, action: { type: "TEST" }, repeat: 1 }],
      context,
    });

    expect(setTimeout).toBeCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 250);
    jest.runOnlyPendingTimers();
    expect(setTimeout).toBeCalledTimes(2);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 250);
  });

  it("allows scheduling events after creation", (done) => {
    const store = Store<ISchedulerState>({
      ...storeParams,
      reducers: {
        ...reducers,
        TEST: (s) => !done() && s,
      },
    });

    const s = Scheduler({ store, context });
    s.scheduleEvent({ delayMs: 250, action: { type: "TEST" } });
    jest.runAllTimers();
  });

  it("allows canceling events after scheduling", () => {
    const s = Scheduler({ store, context });
    const event = s.scheduleEvent({ delayMs: 250, action: { type: "TEST" } });
    s.cancelEvent(event.eventId);
    expect(s.getPendingEvents()).not.toContain(expect.anything());
  });
});
