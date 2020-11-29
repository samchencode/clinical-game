import GameStoreFactory from "@/store/GameStoreFactory";
import type { IReducerMap } from "@/lib/Store";
import type { IStore } from "@/lib/Store";
import type { IGameState } from '@/store/GameState';

interface IGameOptions<P> {
  initialPatientState: P;
  patientReducers?: IReducerMap<P>;
}

interface IGame<P> {
  getStore(): IStore<IGameState<P>>
}

function AbstractGameModule<P>(options: IGameOptions<P>): IGame<P> {
  const store = GameStoreFactory(
    options.initialPatientState,
    options.patientReducers
  );

  function getStore() {
    return store;
  }

  return {
    getStore
  }
}

export default AbstractGameModule;
