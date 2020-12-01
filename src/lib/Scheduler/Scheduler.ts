import type { IModuleLoader } from "@/core/module/ModuleLoader";
import type { IStore } from "@/lib/Store/Store";
import schedulerReducers from "./schedulerReducers";
import * as actions from "./schedulerActionTypes";
import { IEventParameters, IEvent } from "./Event";
import Event from "./Event";

interface IScheduler {
  getPendingEvents: () => IEvent[];
  scheduleEvent: (params: IEventParameters) => IEvent;
  cancelEvent: (eventId: string) => void;
}
interface ISchedulerParameters<S> {
  store: IStore<S>;
  initialEvents?: IEventParameters[];
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

function SchedulerModule<S extends ISchedulerState>(
  params: ISchedulerParameters<S>
): IScheduler {
  if (params.initialEvents) {
    params.store.dispatch({
      type: actions.REGISTER_EVENT,
      payload: params.initialEvents.map(Event),
    });
  }

  function getPendingEvents() {
    return params.store.getState().scheduler.pendingDispatch;
  }

  function scheduleEvent(e: IEventParameters) {
    const event = Event(e);
    params.store.dispatch({ type: actions.REGISTER_EVENT, payload: event });
    return event;
  }

  function cancelEvent(eventId: string) {
    params.store.dispatch({ type: actions.CANCEL_EVENT, payload: eventId });
  }

  return {
    getPendingEvents,
    scheduleEvent,
    cancelEvent,
  };
}

function createSchedulerModule<S extends ISchedulerState>(): IModuleLoader<
  IScheduler,
  ISchedulerParameters<S>
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
export type { ISchedulerState, ISchedulerParameters };
