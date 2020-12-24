import type { ISchedulerState } from "./Scheduler";
import type {
  IMiddleware,
  IAction,
  IMiddlewareContext,
} from "@/lib/Store/Store";
import type { IEvent } from "./Event";
import * as actions from "./schedulerActionTypes";
import { isNode, deepClone } from "@/lib/utils";

interface SideEffectMap<S extends ISchedulerState> {
  [action: string]: (
    context: IMiddlewareContext<S>,
    action: IAction
  ) => typeof action | void;
}

const setTimeoutOnEvent = (
  dispatch: IMiddlewareContext<unknown>["dispatch"],
  e: IEvent,
  getEventCallback: (id: string) => () => void,
): NodeJS.Timeout | number => {
  const { /* action: scheduledAction, */ delayMs, repeat } = e;
  const timerId = setTimeout(() => {
    const updateSchedule: IAction = {
      type: repeat > 0 ? actions.REPEAT_EVENT : actions.STALE_EVENT,
    };
    if (repeat > 0) {
      updateSchedule.payload = {
        eventId: e.eventId,
        event: { ...e, timerId, repeat: repeat - 1 },
      };
    } else {
      updateSchedule.payload = e.eventId;
    }
    const cb = getEventCallback(e.eventId);
    cb();
    dispatch(updateSchedule);
  }, delayMs);
  return timerId;
};

const sideEffects = <S extends ISchedulerState>(getEventCallback: (id: string) => () => void): SideEffectMap<S> => ({
  [actions.REGISTER_EVENT](
    storeContext,
    action: {
      payload: IEvent | IEvent[];
    } & IAction
  ) {
    const newAction = deepClone(action);
    if (Array.isArray(newAction.payload)) {
      const events = newAction.payload;
      const newEvents = events.map((e) => ({
        ...e,
        timerId: setTimeoutOnEvent(storeContext.dispatch, e, getEventCallback),
      }));
      newAction.payload = newEvents;
    } else {
      const event = newAction.payload;
      const newEvent = {
        ...event,
        timerId: setTimeoutOnEvent(storeContext.dispatch, event, getEventCallback),
      };
      newAction.payload = newEvent;
    }
    return newAction;
  },
  [actions.REPEAT_EVENT](
    { dispatch },
    action: { payload: { eventId: string; event: IEvent } } & IAction
  ) {
    const newAction = deepClone(action);
    const { event } = newAction.payload;
    event.timerId = setTimeoutOnEvent(dispatch, event, getEventCallback);
    return newAction;
  },
  [actions.CANCEL_EVENT]({ getState }, { payload: eventId }) {
    const { timerId } = getState().scheduler.pendingDispatch.find(
      (e) => e.eventId === eventId
    );
    isNode()
      ? global.clearTimeout(timerId as NodeJS.Timeout)
      : window.clearTimeout(timerId as number);
  },
});

const createSchedulerMiddleware = <
  S extends ISchedulerState
>(getEventCallback: (id: string) => () => void): IMiddleware<S> => (context) => (next) => (action) => {
  const sideEffect = sideEffects<S>(getEventCallback)[action.type];
  if (sideEffect) {
    const mutatedAction = sideEffect(context, action);
    return next(mutatedAction || action);
  }
  return next(action);
};

export default createSchedulerMiddleware;
