import { initialBaseGameState } from "./BaseGameState";
import type { IBaseGameState } from "./BaseGameState";
import reducers from "./gameReducers";
import type { IStoreBuilder } from "@/lib/Store/StoreBuilder";

function createBaseGameStore<S extends IBaseGameState>(
  storeBuilder: IStoreBuilder<S>
): void {
  storeBuilder.registerInitialState(() => initialBaseGameState);
  storeBuilder.registerReducerMap(() => reducers);
  return null;
}

export default createBaseGameStore;
