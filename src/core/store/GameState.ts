enum GameStatus {
  NOT_STARTED = 0,
  IN_PROGRESS,
  WON,
  LOST,
}

interface IInternalGameState {
  status: GameStatus;
}

interface IGameState<P> extends IInternalGameState {
  patient: P;
}

const initialGameState: IInternalGameState = {
  status: GameStatus.NOT_STARTED,
}

export { GameStatus, initialGameState };
export type { IGameState, IInternalGameState };