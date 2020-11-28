import { IReducerMap } from './Store';
import { GameStatus } from './GameState';
import type { IGameState } from './GameState';
import * as actions from './gameActionTypes';
import { deepClone } from './utils';

function createGameReducers<P> (): IReducerMap<IGameState<P>> {
  return {
    [actions.GAME_START](state) {
      const newState = deepClone(state);
      newState.status = GameStatus.IN_PROGRESS;
      return newState;
    },
    [actions.GAME_END](state, { win }) {
      const newState = deepClone(state);
      newState.status = win ? GameStatus.WON : GameStatus.LOST;
      return newState;
    }
  }
}

export default createGameReducers;