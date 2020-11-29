import { IReducerMap } from "@/lib/Store";
import { GameStatus } from "./GameState";
import type { IInternalGameState } from "./GameState";
import * as actions from "./gameActionTypes";
import { deepClone } from "@/lib/utils";

const gameReducers: IReducerMap<IInternalGameState> = {
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
