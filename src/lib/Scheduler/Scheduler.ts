import type { IModuleLoader } from "@/core/module/ModuleLoader";
import type { IStore, IAction } from "@/lib/Store/Store";
import schedulerReducers from "./schedulerReducers";
import * as actions from "./schedulerActionTypes";

interface IEvent {
  action: IAction;
  delayMs: number;
  timerId?: NodeJS.Timeout | number;
}

interface IScheduler {}
interface ISchedulerParameters<S> {
  store: IStore<S>;
  initialEvents?: IEvent[];
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

function SchedulerModule<S>(params: ISchedulerParameters<S>): IScheduler {
  if (params.initialEvents) {
    params.store.dispatch({
      type: actions.REGISTER_EVENT,
      payload: params.initialEvents,
    });
  }
  return {};
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
export type { IEvent, ISchedulerState };
