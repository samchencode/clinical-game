import Scheduler from "@/lib/Scheduler/Scheduler";
import type { ISchedulerState } from "@/lib/Scheduler/Scheduler";
import type { IEventParameters } from '@/lib/Scheduler/Event';
import Store from "@/lib/Store/Store";
import type { IStore } from "@/lib/Store/Store";
import schedulerReducers from "@/lib/Scheduler/schedulerReducers";
import createSchedulerMiddleware from "@/lib/Scheduler/schedulerMiddleware";
import createLoggerMiddleware from '@/lib/loggerMiddleware';

jest.useFakeTimers();

let store: IStore<ISchedulerState>;
const initialState: ISchedulerState = {
  scheduler: {
    pendingDispatch: [],
  },
};
const reducers = schedulerReducers();
const storeParams = { initialState, reducers, middleware: [
  createSchedulerMiddleware(),
  // createLoggerMiddleware({ logActions: true }),
] };

beforeEach(() => {
  store = Store<ISchedulerState>(storeParams);
  jest.clearAllMocks();
});

describe("SchedulerModule", () => {
  it("creates a scheduler module instance", () => {
    const scheduler = Scheduler({ store });
    expect(scheduler).not.toBeFalsy();
  });

  it("accepts initial events on instantiation and writes to store", () => {
    const initialEvents: IEventParameters[] = [
      { delayMs: 0, action: { type: "TEST" } },
      { delayMs: 0, action: { type: "TEST" } },
    ];

    Scheduler({ store, initialEvents });
    expect(store.getState().scheduler.pendingDispatch.length).toBe(2);
    expect(store.getState().scheduler.pendingDispatch[0].action.type).toBe(
      "TEST"
    );
  });

  it("dispatches actions after a delay and removes events on execution", (done) => {
    const initialEvents: IEventParameters[] = [
      { delayMs: 250, action: { type: "TEST" } },
    ];

    store = Store<ISchedulerState> ({
      ...storeParams,
      reducers: {
        ...reducers,
        TEST: (s) => !done() && s
      },
    });

    Scheduler({ store, initialEvents });
    expect(store.getState().scheduler.pendingDispatch[0].timerId).toBeDefined();

    jest.runAllTimers();
    expect(setTimeout).toBeCalledTimes(1);
  });

  it("dispatches repeating actions", () => {
    store = Store<ISchedulerState> ({
      ...storeParams,
      reducers: {
        ...reducers,
        TEST: (s) => s
      },
    });

    Scheduler({ store, initialEvents: [
      { delayMs: 250, action: { type: "TEST" }, repeat: 1 },
    ]});

    expect(setTimeout).toBeCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 250);
    jest.runOnlyPendingTimers();
    expect(setTimeout).toBeCalledTimes(2);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 250);
  })

  it("allows scheduling events after creation", (done) => {
    const store = Store<ISchedulerState> ({
      ...storeParams,
      reducers: {
        ...reducers,
        TEST: (s) => !done() && s
      },
    });

    const s = Scheduler({ store });
    s.scheduleEvent({ delayMs: 250, action: { type: "TEST" } });
    jest.runAllTimers();
  })

  it("allows canceling events after scheduling", () => {
    const s = Scheduler({ store });
    const event = s.scheduleEvent({ delayMs: 250, action: { type: "TEST" } });
    s.cancelEvent(event.eventId);
    expect(s.getPendingEvents()).not.toContain(expect.anything());
  })
});
