import type { IReducerMap } from "@/lib/Store/Store";
import type { IStore } from "@/lib/Store/Store";
import loadModules from './module/loadModules';
import type { IGameState } from './module/loadModules';

interface IGameOptions<P> {
  initialPatientState: P;
  patientReducers?: IReducerMap<P>;
  eventEmitters?: [any?];
  eventHandlers?: [any?];
}

interface IGame<P> {
  getStore(): IStore<IGameState<P>>
}

function AbstractGameModule<P>(options: IGameOptions<P>): IGame<P> {
  
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
