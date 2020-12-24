import loadModules from "./module/loadModules";
import type { IGameState } from "./module/loadModules";
import type {
  IScheduler,
  ISchedulerParameters,
} from "@/lib/Scheduler/Scheduler";
import createEventFactory from "@/lib/Scheduler/Event";
import createSchedulerMiddleware from "@/lib/Scheduler/schedulerMiddleware";
import type {
  IPatientModuleLoaderParameters,
  IPatientModuleParameters,
  IPatient,
} from "@/lib/Patient/Patient";
import type { IStore } from "@/lib/Store/Store";
import View from "@/lib/View/View";
import type { IView } from "@/lib/View/View";
import type { IViewModuleParameters } from "@/lib/View/View";
import ConditionalMonitor from "@/lib/Conditional/ConditionalMonitor";
import type {
  IConditionalMonitorParameters,
  IConditionalMonitor,
} from "@/lib/Conditional/ConditionalMonitor";
import type { IScribe } from "@/lib/Scribe/Scribe";
import { GameStatus } from "./store/BaseGameState";
import OptionManager from "@/lib/OptionManager";
import type {
  IOptionManagerParameters,
  IOptionManager,
} from "@/lib/OptionManager";

interface IGameOptions<P> {
  viewAgent: IViewModuleParameters<IGameState<P>>["viewAgent"];
  initialPatientState: IPatientModuleLoaderParameters<P>["initialState"];
  patientReducers?: IPatientModuleLoaderParameters<P>["reducers"];
  playerOptions?: IOptionManagerParameters<P>["options"];
  initialScheduledEvents?: ISchedulerParameters<P>["initialEvents"];
  conditionals?: IConditionalMonitorParameters<P>["conditions"];
}

interface IGameContext<P> {
  store: IStore<IGameState<P>>;
  scheduler: IScheduler<P>;
  patient: IPatient;
  scribe: IScribe;
  view: IView;
  conditional: IConditionalMonitor;
  options: IOptionManager<P>;
}

function AbstractGameModule<P>(options: IGameOptions<P>): IGameContext<P> {
  const gameContext: IGameContext<P> = {
    store: null,
    scheduler: null,
    patient: null,
    scribe: null,
    view: null,
    conditional: null,
    options: null,
  };

  const loader = loadModules<P>({
    patient: {
      initialState: options.initialPatientState,
      reducers: options.patientReducers,
    },
  });

  const { factory: eventFactory, getEventCallback } = createEventFactory(
    gameContext
  );

  gameContext.store = loader.Store({
    middleware: [createSchedulerMiddleware<IGameState<P>>(getEventCallback)],
  });

  gameContext.options = OptionManager({
    options: options.playerOptions,
    context: gameContext,
  });

  gameContext.conditional = ConditionalMonitor({
    conditions: options.conditionals,
    context: gameContext,
  });

  gameContext.scribe = loader.Scribe({ store: gameContext.store });

  gameContext.scheduler = loader.Scheduler({
    initialEvents: options.initialScheduledEvents,
    context: gameContext,
    eventFactory,
  });

  gameContext.patient = loader.Patient({
    context: gameContext,
  });

  gameContext.view = View({
    context: gameContext,
    viewAgent: options.viewAgent,
  });
  // TODO: close the view if the game loses. I should refactor this elsewhere...
  gameContext.store.subscribe((s) => {
    if (s.status === GameStatus.WON || s.status === GameStatus.LOST) {
      gameContext.view.close();
    }
  });

  return Object.create(gameContext);
}

export default AbstractGameModule;
export type { IGameContext, IGameState };
