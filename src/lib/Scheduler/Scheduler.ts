import type { IModuleLoader } from "@/core/module/ModuleLoader";
import schedulerReducers from "./schedulerReducers";
import * as actions from "./schedulerActionTypes";
import { IEventParameters, IEvent } from "./Event";
import type { IGameContext } from "@/core/Game";

interface IScheduler<P> {
  getPendingEvents: () => IEvent[];
  scheduleEvent: (params: IEventParameters<P>) => IEvent;
  cancelEvent: (eventId: IEvent['eventId']) => void;
}

interface ISchedulerParameters<P> {
  initialEvents?: IEventParameters<P>[];
  context: Partial<IGameContext<P>>;
  eventFactory: (params: IEventParameters<P>) => IEvent;
}

interface ISchedulerState {
  scheduler: {
    pendingDispatch: IEvent[];
  };
}

const initialSchedulerState: ISchedulerState = {
  scheduler: {
    pendingDispatch: [],
  },
};

function SchedulerModule<P>(
  {initialEvents, context, eventFactory}: ISchedulerParameters<P>
): IScheduler<P> {
  const { store } = context;

  if (initialEvents) {
    store.dispatch({
      type: actions.REGISTER_EVENT,
      payload: initialEvents.map(eventFactory),
    });
  }

  function getPendingEvents() {
    return store.getState().scheduler.pendingDispatch;
  }

  function scheduleEvent(e: IEventParameters<P>) {
    const event = eventFactory(e);
    store.dispatch({ type: actions.REGISTER_EVENT, payload: event });
    return event;
  }

  function cancelEvent(eventId: string) {
    store.dispatch({ type: actions.CANCEL_EVENT, payload: eventId });
  }

  return {
    getPendingEvents,
    scheduleEvent,
    cancelEvent,
  };
}

function createSchedulerModule<S extends ISchedulerState>(): IModuleLoader<
  IScheduler<unknown>,
  ISchedulerParameters<unknown>
> {
  return {
    load(helper) {
      helper.storeBuilder.registerInitialState(() => initialSchedulerState);
      helper.storeBuilder.registerReducerMap(() => schedulerReducers<S>());
      return SchedulerModule;
    },
  };
}

export default SchedulerModule;
export { createSchedulerModule };
export type { ISchedulerState, ISchedulerParameters, IScheduler };
