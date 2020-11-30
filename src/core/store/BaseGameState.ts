enum GameStatus {
  NOT_STARTED = 0,
  IN_PROGRESS,
  WON,
  LOST,
}

interface IBaseGameState {
  status: GameStatus;
}

const initialBaseGameState: IBaseGameState = {
  status: GameStatus.NOT_STARTED,
}

export { initialBaseGameState };
export type { GameStatus, IBaseGameState };