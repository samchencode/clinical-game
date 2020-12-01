import type { IStore } from "@/lib/Store/Store";
import loadModules from "./module/loadModules";
import type { IGameState } from "./module/loadModules";
import type { ISchedulerParameters } from "@/lib/Scheduler/Scheduler";
import createSchedulerMiddleware from "@/lib/Scheduler/schedulerMiddleware";
import type { IPatientModuleLoaderParameters } from "@/lib/Patient";

interface IGameOptions<P> {
  initialPatientState: IPatientModuleLoaderParameters<P>["initialState"];
  patientReducers?: IPatientModuleLoaderParameters<P>["reducers"];
  initialScheduledEvents?: ISchedulerParameters<IGameState<P>>["initialEvents"];
}

function AbstractGameModule<P>(options: IGameOptions<P>) {
  const loader = loadModules<P>({
    patient: {
      initialState: options.initialPatientState,
      reducers: options.patientReducers,
    },
  });

  const store = loader.Store({
    middleware: [
      createSchedulerMiddleware<IGameState<P>>(),
    ],
  });

  const patient = loader.Patient({});
  const scheduler = loader.Scheduler({
    store,
    initialEvents: options.initialScheduledEvents,
  });

  return {
    store: {
      getState: store.getState,
      dispatch: store.dispatch,
      subscribe: store.subscribe,
    },
    scheduler: {
      schedule: scheduler.scheduleEvent,
      cancel: scheduler.cancelEvent,
      getPendingEvents: scheduler.getPendingEvents,
    }
  };
}

export default AbstractGameModule;

