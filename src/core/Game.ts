import loadModules from "./loader/loadModules";
import type { IGameState } from "./loader/loadModules";
import type {
  IScheduler,
  ISchedulerParameters,
} from "@/core/modules/Scheduler/Scheduler";
import createEventFactory from "@/core/modules/Scheduler/Event";
import createSchedulerMiddleware from "@/core/modules/Scheduler/schedulerMiddleware";
import type {
  IPatientModuleLoaderParameters,
  IPatient,
} from "@/core/modules/Patient/Patient";
import type { IStore } from "@/lib/Store/Store";
import View from "@/core/modules/View/View";
import type { IView } from "@/core/modules/View/View";
import type { IViewParameters } from "@/core/modules/View/View";
import ConditionalMonitor from "@/core/modules/ConditionalMonitor";
import type {
  IConditionalMonitorParameters,
  IConditionalMonitor,
} from "@/core/modules/ConditionalMonitor";
import type { IScribe } from "@/core/modules/Scribe/Scribe";
import OptionManager from "@/core/modules/OptionManager";
import type {
  IOptionManagerParameters,
  IOptionManager,
} from "@/core/modules/OptionManager";
import type { IGameStatus } from '@/core/modules/GameStatus/GameStatus';
import SceneManager from '@/core/modules/SceneManager';
import type { ISceneManager, ISceneManagerParameters } from '@/core/modules/SceneManager';

interface IGameOptions<P> {
  viewAgent: IViewParameters<IGameState<P>>["viewAgent"];
  initialPatientState: IPatientModuleLoaderParameters<P>["initialState"];
  playerOptions?: IOptionManagerParameters<P>["options"];
  initialScheduledEvents?: ISchedulerParameters<P>["initialEvents"];
  conditionals?: IConditionalMonitorParameters<P>["conditions"];
  initialScene?: ISceneManagerParameters<P>["initialScene"];
  scenes?: ISceneManagerParameters<P>["scenes"];
}

interface IGameContext<P> {
  store: IStore<IGameState<P>>;
  scheduler: IScheduler<P>;
  patient: IPatient<P>;
  scribe: IScribe;
  view: IView;
  conditional: IConditionalMonitor;
  options: IOptionManager<P>;
  status: IGameStatus;
  scene: ISceneManager<P>;
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
    status: null,
    scene: null,
  };

  const loader = loadModules<P>({
    patient: {
      initialState: options.initialPatientState,
    },
  });

  const { factory: eventFactory, getEventCallback } = createEventFactory(
    gameContext
  );

  gameContext.store = loader.Store({
    middleware: [createSchedulerMiddleware<IGameState<P>>(getEventCallback)],
  });

  gameContext.status = loader.GameStatus({ context: gameContext })

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
  gameContext.store.subscribe(() => {
    if (gameContext.status.hasEnded()) {
      gameContext.view.close();
    }
  });

  gameContext.scene = SceneManager({
    context: gameContext,
    scenes: options.scenes || {},
    initialScene: options.initialScene
  })

  return Object.create(gameContext);
}

export default AbstractGameModule;
export type { IGameContext, IGameState };
