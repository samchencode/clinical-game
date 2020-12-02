import loadModules from "./module/loadModules";
import type { IGameState } from "./module/loadModules";
import type { ISchedulerParameters } from "@/lib/Scheduler/Scheduler";
import createSchedulerMiddleware from "@/lib/Scheduler/schedulerMiddleware";
import type { IPatientModuleLoaderParameters } from "@/lib/Patient/Patient";

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
    middleware: [createSchedulerMiddleware<IGameState<P>>()],
  });

  const scribe = loader.Scribe({ store });

  const scheduler = loader.Scheduler({
    store,
    initialEvents: options.initialScheduledEvents,
  });

  const patient = loader.Patient({ store, scheduler });

  return {
    store,
    scheduler,
    patient,
    scribe,
  };
}

export default AbstractGameModule;
