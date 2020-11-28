import Store from "./Store";
import type { IReducerMap, IReducer, IStore } from "./Store";
import { initialGameState } from './GameState';
import type { IGameState } from './GameState';
import { deepClone } from "./utils";
import createGameStateReducers from './gameReducers';

function GameStoreFactory<P>(
  initialPatientState: P,
  patientReducers: IReducerMap<P> = {}
): IStore<IGameState<P>> {
  const initialState: IGameState<P> = {
    patient: initialPatientState,
    ...initialGameState
  };

  const gameStateReducers = createGameStateReducers<P>();

  function _addPatientReducers<P>(
    gameStateReducers: IReducerMap<IGameState<P>>,
    patientReducers: IReducerMap<P>
  ): IReducerMap<IGameState<P>> {
    const patientGameStateReducers = Object.entries(patientReducers).reduce(
      (ag, [actionType, patientReducer]) => {
        const gameStateReducer: IReducer<IGameState<P>> = function (
          state,
          payload
        ) {
          const newState = deepClone(state);
          newState.patient = patientReducer(state.patient, payload);
          return newState;
        };
        return { ...ag, [actionType]: gameStateReducer };
      },
      {} as IReducerMap<IGameState<P>>
    );
    return { ...gameStateReducers, ...patientGameStateReducers };
  }

  return Store(
    initialState,
    _addPatientReducers(gameStateReducers, patientReducers)
  );
}

export default GameStoreFactory;
