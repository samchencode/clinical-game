import GameStoreFactory from "@/store/GameStoreFactory";
import type { IReducerMap } from "@/lib/Store";
import type { IStore } from "@/lib/Store";
import type { IGameState } from '@/store/GameState';
import EventManager from  "@/lib/EventManager/EventManager";
import type { IEventEmitter } from "@/lib/EventManager/EventManager";
import type { IEventHandler } from "@/lib/EventManager/EventHandler";


interface IGameOptions<P, S extends IGameState<P>> {
  initialPatientState: P;
  patientReducers?: IReducerMap<P>;
  eventEmitters?: IEventEmitter<S>[];
  eventHandlers?: IEventHandler<S>[];
}

interface IGame<P> {
  getStore(): IStore<IGameState<P>>
}

function AbstractGameModule<P, S extends IGameState<P>>(options: IGameOptions<P, S>): IGame<P> {
  const store = GameStoreFactory(
    options.initialPatientState,
    options.patientReducers
  );

  const eventManager = EventManager(store, options.eventEmitters, options.eventHandlers);

  function getStore() {
    return store;
  }

  return {
    getStore
  }
}

export default AbstractGameModule;
