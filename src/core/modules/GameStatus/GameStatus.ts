import type { IGameContext } from '@/core/Game';
import type { IModuleLoader } from "@/core/loader/ModuleLoader";
import reducers from './gameStatusReducers';
import * as actions from './gameStatusActions';


interface IGameStatus {
  hasStarted: () => boolean,
  hasEnded: () => boolean,
  start: () => void,
  end: () => void,
}

interface IGameStatusParameters {
  context: Partial<IGameContext<unknown>>
}

enum GameStatus {
  HAS_NOT_STARTED,
  IN_PROGRESS,
  ENDED,
}

interface IGameStatusState {
  status: GameStatus
}

const initialGameStatusState: IGameStatusState = {
  status: GameStatus.HAS_NOT_STARTED,
}


function GameStatusModule({ context }: IGameStatusParameters): IGameStatus {
  const { store } = context;

  return {
    hasStarted: () => store.getState().status !== GameStatus.HAS_NOT_STARTED,
    hasEnded: () => store.getState().status === GameStatus.ENDED,
    start: () => store.dispatch({ type: actions.GAME_STARTED }),
    end: () => store.dispatch({ type: actions.GAME_ENDED }),
  }
}

function createGameStatusModule(): IModuleLoader<IGameStatus, IGameStatusParameters> {
  return {
    load(helper) {
      helper.storeBuilder.registerInitialState(() => initialGameStatusState);
      helper.storeBuilder.registerReducerMap(() => reducers);
      return GameStatusModule;
    }
  }
}

export default GameStatusModule;
export { GameStatus, createGameStatusModule };
export type { IGameStatusState, IGameStatus };