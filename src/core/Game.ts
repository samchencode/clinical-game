import type { IStore } from "@/lib/Store/Store";
import loadModules from "./module/loadModules";
import type { IGameState } from "./module/loadModules";
import type { ISchedulerParameters } from "@/lib/Scheduler/Scheduler";
import createSchedulerMiddleware from "@/lib/Scheduler/schedulerMiddleware";
import type { IPatientModuleLoaderParameters } from "@/lib/Patient";
import createLoggerMiddleware from '@/lib/loggerMiddleware';

interface IGameOptions<P> {
  initialPatientState: IPatientModuleLoaderParameters<P>["initialState"];
  patientReducers?: IPatientModuleLoaderParameters<P>["reducers"];
  initialScheduledEvents?: ISchedulerParameters<IGameState<P>>["initialEvents"];
}

interface IGame<P> {
  getStore(): IStore<IGameState<P>>;
}

function AbstractGameModule<P>(options: IGameOptions<P>): IGame<P> {
  const loader = loadModules<P>({
    patient: {
      initialState: options.initialPatientState,
      reducers: options.patientReducers,
    },
  });

  const store = loader.Store({
    middleware: [
      createSchedulerMiddleware<IGameState<P>>(),
      createLoggerMiddleware({ logActions: true }),
    ],
  });

  const patient = loader.Patient({});
  const scheduler = loader.Scheduler({
    store,
    initialEvents: options.initialScheduledEvents,
  });

  function getStore() {
    return store;
  }

  return {
    getStore,
  };
}

export default AbstractGameModule;
