import { ISchedulerState, IEvent } from './Scheduler';
import { IReducerMap } from '@/lib/Store/Store';
import { deepClone } from '@/lib/utils';
import * as actions from './schedulerActionTypes';

const schedulerReducers = <S extends ISchedulerState>(): IReducerMap<S> => ({
  [actions.REGISTER_EVENT](state, events: IEvent | IEvent[]) {
    const newState = deepClone(state);

    if(Array.isArray(events)) {
      newState.scheduler.pendingDispatch.push(...events);
    } else {
      newState.scheduler.pendingDispatch.push(events);
    }
    
    return newState;
  },
  [actions.STALE_EVENT](state, timerId) {
    const eventIdx = state.scheduler.pendingDispatch.findIndex(e => e.timerId === timerId)
    const newState = deepClone(state);
    newState.scheduler.pendingDispatch.splice(eventIdx, 1);
    return newState
  },
  [actions.CANCEL_EVENT](state, timerId) {
    const eventIdx = state.scheduler.pendingDispatch.findIndex(e => e.timerId === timerId)
    const newState = deepClone(state);
    newState.scheduler.pendingDispatch.splice(eventIdx, 1);
    return newState
  }
});

export default schedulerReducers;