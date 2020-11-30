import type { IReducerMap } from "@/lib/Store/Store";
import type { IStore } from "@/lib/Store/Store";
import type { IGameState } from '@/core/store/GameState';
import loadModules from './load/loadModules';

interface IGameOptions<P, S extends IGameState<P>> {
  initialPatientState: P;
  patientReducers?: IReducerMap<P>;
  eventEmitters?: [any?];
  eventHandlers?: [any?];
}

interface IGame<P> {
  getStore(): IStore<IGameState<P>>
}

function AbstractGameModule<P, S extends IGameState<P>>(options: IGameOptions<P, S>): IGame<P> {
  
  const loader = loadModules<P>({
    patient: {
      initialState: options.initialPatientState,
      reducers: options.patientReducers
    }
  })

  const store = loader.Store();

  function getStore() {
    return store;
  }

  return {
    getStore
  }
}

export default AbstractGameModule;
