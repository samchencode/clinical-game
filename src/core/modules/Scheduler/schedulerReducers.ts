import type { ISchedulerState } from "./Scheduler";
import type { IEvent } from "./Event";
import type { IReducerMap } from "@/lib/Store/Store";
import { deepClone } from "@/lib/utils";
import * as actions from "./schedulerActionTypes";

const schedulerReducers = <S extends ISchedulerState>(): IReducerMap<S> => ({
  [actions.REGISTER_EVENT](state, events: IEvent | IEvent[]) {
    const newState = deepClone(state);
    if (Array.isArray(events)) {
      newState.scheduler.pendingDispatch.push(...events);
    } else {
      newState.scheduler.pendingDispatch.push(events);
    }
    return newState;
  },
  [actions.STALE_EVENT](state, eventId) {
    const eventIdx = state.scheduler.pendingDispatch.findIndex(
      (e) => e.eventId === eventId
    );
    const newState = deepClone(state);
    newState.scheduler.pendingDispatch.splice(eventIdx, 1);
    return newState;
  },
  [actions.REPEAT_EVENT](state, { eventId, event }) {
    const eventIdx = state.scheduler.pendingDispatch.findIndex(
      (e) => e.eventId === eventId
    );
    const newState = deepClone(state);
    newState.scheduler.pendingDispatch.splice(eventIdx, 1, event);
    return newState;
  },
  [actions.CANCEL_EVENT](state, eventId) {
    return this[actions.STALE_EVENT](state, eventId);
  },
});

export default schedulerReducers;
