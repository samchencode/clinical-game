import type { IReducerMap } from "@/lib/Store/Store";
import { GameStatus } from "./BaseGameState";
import type { IBaseGameState } from "./BaseGameState";
import * as actions from "./gameActionTypes";
import { deepClone } from "@/lib/utils";

const gameReducers: IReducerMap<IBaseGameState> = {
  [actions.GAME_START](state) {
    const newState = deepClone(state);
    newState.status = GameStatus.IN_PROGRESS;
    return newState;
  },
  [actions.GAME_END](state, { win }) {
    const newState = deepClone(state);
    newState.status = win ? GameStatus.WON : GameStatus.LOST;
    return newState;
  },
};

export default gameReducers;
