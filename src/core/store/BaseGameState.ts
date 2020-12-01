enum GameStatus {
  LOADING,
  PENDING_START,
  IN_PROGRESS,
  WON,
  LOST,
}

interface IBaseGameState {
  status: GameStatus;
}

const initialBaseGameState: IBaseGameState = {
  status: GameStatus.LOADING,
}

export { initialBaseGameState, GameStatus };
export type { IBaseGameState };