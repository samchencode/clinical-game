import * as actions from './gameStatusActions';
import type { IReducerMap } from '@/lib/Store/Store';
import type { IGameStatusState } from './GameStatus';
import { GameStatus } from './GameStatus';
import { deepClone } from '@/lib/utils';

const gameStatusReducers: IReducerMap<IGameStatusState> = {
  [actions.GAME_STARTED]: (state) => {
    const newState = deepClone(state);
    newState.status = GameStatus.IN_PROGRESS
    return newState;
  },
  [actions.GAME_ENDED]: (state) => {
    const newState = deepClone(state);
    newState.status = GameStatus.ENDED
    return newState;
  }
}

export default gameStatusReducers