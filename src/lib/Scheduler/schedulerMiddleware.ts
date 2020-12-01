import { IMiddleware, IAction, IMiddlewareContext } from "@/lib/Store/Store";
import { IEvent } from "./Scheduler";
import * as actions from "./schedulerActionTypes";
import { isNode, deepClone } from "@/lib/utils";

interface SideEffectMap {
  [action: string]: (
    dispatch: IMiddlewareContext["dispatch"],
    action: IAction
  ) => typeof action | void;
}

const setTimeoutOnEvent = (
  dispatch: IMiddlewareContext["dispatch"],
  { action: scheduledAction, delayMs }: IEvent
) => {
  let timerId: NodeJS.Timeout | number = setTimeout(() => {
    dispatch(scheduledAction);
    dispatch({
      type: actions.STALE_EVENT,
      payload: timerId,
    });
  }, delayMs);
  return timerId;
};

const sideEffects: SideEffectMap = {
  [actions.REGISTER_EVENT](
    dispatch,
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
  [actions.CANCEL_EVENT](dispatch, { payload: timerId }) {
    isNode()
      ? global.clearTimeout(timerId as NodeJS.Timeout)
      : window.clearTimeout(timerId as number);
  },
};

const schedulerMiddleware: IMiddleware = ({ dispatch }) => (next) => (
  action
) => {
  if (sideEffects[action.type]) {
    const mutatedAction = sideEffects[action.type](dispatch, action);
    return next(mutatedAction || action);
  }
  return next(action);
};

export default schedulerMiddleware;
