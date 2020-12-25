import type { IReducerMap } from '@/lib/Store/Store';
import * as actions from './scribeActions';
import type { IScribeState } from './Scribe';
import { deepClone } from '@/lib/utils';

const scribeReducers: IReducerMap<IScribeState> = {
  [actions.WRITE_LINE](state, payload) {
    const newState = deepClone(state);
    newState.scripts.push(payload);
    return newState
  }
}

export default scribeReducers;