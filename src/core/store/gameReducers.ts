import type { IReducerMap } from "@/lib/Store/Store";
import { GameStatus } from "./BaseGameState";
import type { IBaseGameState } from "./BaseGameState";
import * as actions from "./gameActionTypes";
import { deepClone } from "@/lib/utils";

const gameReducers: IReducerMap<IBaseGameState> = {
  [actions.START_GAME](state) {
    const newState = deepClone(state);
    newState.status = GameStatus.IN_PROGRESS;
    return newState;
  },
  [actions.END_GAME](state, { win }) {
    const newState = deepClone(state);
    newState.status = win ? GameStatus.WON : GameStatus.LOST;
    return newState;
  },
  [actions.FINISH_LOADING](state) {
    const newState = deepClone(state);
    newState.status = GameStatus.PENDING_START;
    return newState;
  }
};

export default gameReducers;
