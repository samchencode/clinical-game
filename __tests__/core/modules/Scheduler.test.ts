import Scheduler from "@/lib/Scheduler/Scheduler";
import type { IEventParameters } from "@/lib/Scheduler/Event";
import Store from "@/lib/Store/Store";
import type { IStore, IReducerMap } from "@/lib/Store/Store";
import schedulerReducers from "@/lib/Scheduler/schedulerReducers";
import createSchedulerMiddleware from "@/lib/Scheduler/schedulerMiddleware";
import createEventFactory from "@/lib/Scheduler/Event";
import type { IGameContext, IGameState } from "@/core/Game";
import createLoggerMiddleware from "@/lib/loggerMiddleware";

jest.useFakeTimers();

type State = IGameState<unknown>;
type Context = Partial<IGameContext<unknown>>;

let context: Context = {};

let { factory: eventFactory, getEventCallback } = createEventFactory(
  context
);

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
    createSchedulerMiddleware(getEventCallback),
    // createLoggerMiddleware({ logActions: true, logState: true }),
  ],
};

beforeEach(() => {
  context.store = Store<IGameState<unknown>>(storeParams);
  jest.clearAllMocks();
});

describe("SchedulerModule", () => {
  const dispatchTestAction = (_: unknown, ctx: IGameContext<unknown>) =>
    ctx.store.dispatch({ type: "TEST" });

  it("creates a scheduler module instance", () => {
    const scheduler = Scheduler({ context, eventFactory });
    expect(scheduler).not.toBeFalsy();
  });

  it("accepts initial events on instantiation and writes to store", () => {
    const initialEvents: IEventParameters<unknown>[] = [
      { delayMs: 0, execute: dispatchTestAction },
      { delayMs: 0, execute: dispatchTestAction },
    ];

    Scheduler({ initialEvents, context, eventFactory });
    expect(context.store.getState().scheduler.pendingDispatch.length).toBe(2);
  });

  it("dispatches actions after a delay and removes events on execution", (done) => {
    const initialEvents: IEventParameters<unknown>[] = [
      { delayMs: 250, execute: dispatchTestAction },
    ];

    context.store = Store<State>({
      ...storeParams,
      reducers: {
        ...reducers,
        TEST: (s) => !done() && s,
      },
    });

    Scheduler({ initialEvents, context, eventFactory });
    expect(context.store.getState().scheduler.pendingDispatch[0].timerId).toBeDefined();

    jest.runAllTimers();
    expect(setTimeout).toBeCalledTimes(1);
  });

  it("dispatches repeating actions", () => {
    context.store = Store<State>({
      ...storeParams,
      reducers: {
        ...reducers,
        TEST: (s) => s,
      },
    });

    Scheduler({
      initialEvents: [{ delayMs: 250, execute: dispatchTestAction, repeat: 1 }],
      context,
      eventFactory,
    });

    expect(setTimeout).toBeCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 250);
    jest.runOnlyPendingTimers();
    expect(setTimeout).toBeCalledTimes(2);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 250);
  });

  it("allows scheduling events after creation", (done) => {
    context.store = Store<State>({
      ...storeParams,
      reducers: {
        ...reducers,
        TEST: (s) => !done() && s,
      },
    });

    const s = Scheduler({ context, eventFactory });
    s.scheduleEvent({ delayMs: 250, execute: dispatchTestAction });
    jest.runAllTimers();
  });

  it("allows canceling events after scheduling", () => {
    const s = Scheduler({ context, eventFactory });
    const event = s.scheduleEvent({
      delayMs: 250,
      execute: dispatchTestAction,
    });
    s.cancelEvent(event.eventId);
    expect(s.getPendingEvents()).not.toContain(expect.anything());
  });
});
