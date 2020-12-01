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
  e: IEvent
): NodeJS.Timeout | number => {
  const { action: scheduledAction, delayMs, repeat } = e;
  const timerId = setTimeout(() => {
    const updateSchedule: IAction = {
      type: repeat > 0 ? actions.REPEAT_EVENT : actions.STALE_EVENT,
    };
    if (repeat > 0) {
      updateSchedule.payload = {
        eventId: e.eventId,
        event: { ...e, timerId, repeat: repeat - 1 },
      };
    } else updateSchedule.payload = e.eventId;

    dispatch(scheduledAction);
    dispatch(updateSchedule);
  }, delayMs);
  return timerId;
};

const sideEffects = <S extends ISchedulerState>(): SideEffectMap<S> => ({
  [actions.REGISTER_EVENT](
    { dispatch },
    action: {
      payload: IEvent | IEvent[];
    } & IAction
  ) {
    const newAction = deepClone(action);
    if (Array.isArray(newAction.payload)) {
      const events = newAction.payload;
      const newEvents = events.map((e) => ({
        ...e,
        timerId: setTimeoutOnEvent(dispatch, e),
      }));
      newAction.payload = newEvents;
    } else {
      const event = newAction.payload;
      const newEvent = {
        ...event,
        timerId: setTimeoutOnEvent(dispatch, event),
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
    event.timerId = setTimeoutOnEvent(dispatch, event);
    return newAction;
  },
  [actions.CANCEL_EVENT]({ state }, { payload: eventId }) {
    const { timerId } = state.scheduler.pendingDispatch.find(
      (e) => e.eventId === eventId
    );
    isNode()
      ? global.clearTimeout(timerId as NodeJS.Timeout)
      : window.clearTimeout(timerId as number);
  },
});

const createSchedulerMiddleware = <
  S extends ISchedulerState
>(): IMiddleware<S> => (context) => (next) => (action) => {
  if (sideEffects<S>()[action.type]) {
    const mutatedAction = sideEffects<S>()[action.type](context, action);
    return next(mutatedAction || action);
  }
  return next(action);
};

export default createSchedulerMiddleware;
