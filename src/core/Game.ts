import loadModules from "./module/loadModules";
import type { IGameState } from "./module/loadModules";
import type { ISchedulerParameters } from "@/lib/Scheduler/Scheduler";
import createSchedulerMiddleware from "@/lib/Scheduler/schedulerMiddleware";
import type {
  IPatientModuleLoaderParameters,
  IPatientModuleParameters,
} from "@/lib/Patient/Patient";
import View from "@/lib/View/View";

interface IGameOptions<P> {
  initialPatientState: IPatientModuleLoaderParameters<P>["initialState"];
  patientReducers?: IPatientModuleLoaderParameters<P>["reducers"];
  patientOptions?: IPatientModuleParameters<P, IGameState<P>>["options"];
  initialScheduledEvents?: ISchedulerParameters<IGameState<P>>["initialEvents"];
  viewAgent: "vue" | "console";
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

  const patient = loader.Patient({
    store,
    scheduler,
    options: options.patientOptions,
  });

  const view = View({ patient, store, scribe, viewAgent: options.viewAgent });

  return {
    store,
    scheduler,
    patient,
    scribe,
    view,
  };
}

export default AbstractGameModule;
