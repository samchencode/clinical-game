import type { IModuleLoader } from "@/core/module/ModuleLoader";
import schedulerReducers from "./schedulerReducers";
import * as actions from "./schedulerActionTypes";
import { IEventParameters, IEvent } from "./Event";
import Event from "./Event";
import type { IGameContext } from "@/core/Game";

interface IScheduler {
  getPendingEvents: () => IEvent[];
  scheduleEvent: (params: IEventParameters) => IEvent;
  cancelEvent: (eventId: string) => void;
}

interface ISchedulerParameters {
  initialEvents?: IEventParameters[];
  context: Partial<IGameContext<unknown>>;
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

function SchedulerModule(
  {initialEvents, context}: ISchedulerParameters
): IScheduler {
  const { store } = context;

  if (initialEvents) {
    store.dispatch({
      type: actions.REGISTER_EVENT,
      payload: initialEvents.map(Event),
    });
  }

  function getPendingEvents() {
    return store.getState().scheduler.pendingDispatch;
  }

  function scheduleEvent(e: IEventParameters) {
    const event = Event(e);
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
  IScheduler,
  ISchedulerParameters
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
