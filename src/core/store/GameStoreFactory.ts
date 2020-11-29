import Store from "@/lib/Store";
import type { IReducerMap, IReducer, IStore } from "@/lib/Store";
import { initialGameState } from "./GameState";
import type { IGameState, IInternalGameState } from "./GameState";
import { deepClone } from "@/lib/utils";
import gameStateReducers from "./gameReducers";

function GameStoreFactory<P>(
  initialPatientState: P,
  patientReducers: IReducerMap<P> = {}
): IStore<IGameState<P>> {
  const initialState: IGameState<P> = {
    patient: initialPatientState,
    ...initialGameState,
  };

  function _addPatientReducers<P>(
    gameStateReducers: IReducerMap<IInternalGameState>,
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
    return {
      ...(gameStateReducers as IReducerMap<IGameState<P>>),
      ...patientGameStateReducers,
    };
  }

  return Store(
    initialState,
    _addPatientReducers(gameStateReducers, patientReducers)
  );
}

export default GameStoreFactory;
