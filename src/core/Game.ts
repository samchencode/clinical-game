import loadModules from "./module/loadModules";
import type { IGameState } from "./module/loadModules";
import type { ISchedulerParameters } from "@/lib/Scheduler/Scheduler";
import createSchedulerMiddleware from "@/lib/Scheduler/schedulerMiddleware";
import type {
  IPatientModuleLoaderParameters,
  IPatientModuleParameters,
} from "@/lib/Patient/Patient";
import View from "@/lib/View/View";
import type { IViewModuleParameters } from "@/lib/View/View";
import ConditionalMonitor from "@/lib/Conditional/ConditionalMonitor";
import type { IConditionalMonitorParameters } from "@/lib/Conditional/ConditionalMonitor";
import { GameStatus } from "./store/BaseGameState";

interface IGameOptions<P> {
  viewAgent: IViewModuleParameters<IGameState<P>>["viewAgent"];
  initialPatientState: IPatientModuleLoaderParameters<P>["initialState"];
  patientReducers?: IPatientModuleLoaderParameters<P>["reducers"];
  patientOptions?: IPatientModuleParameters<P, IGameState<P>>["options"];
  initialScheduledEvents?: ISchedulerParameters<IGameState<P>>["initialEvents"];
  conditionals?: IConditionalMonitorParameters<IGameState<P>>["conditions"];
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

  const conditional = ConditionalMonitor({
    store,
    conditions: options.conditionals,
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
  // TODO: close the view if the game loses. I should refactor this elsewhere...
  store.subscribe((s) => {
    if (s.status === GameStatus.WON || s.status === GameStatus.LOST) {
      view.close();
    }
  });

  return {
    store,
    scheduler,
    patient,
    scribe,
    view,
    conditional,
  };
}

export default AbstractGameModule;
