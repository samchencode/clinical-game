import type { IReducerMap, IStore } from "./Store";
import Store from "./Store";

interface IMixinFactory {
  (): object;
}

interface IReducerMixinFactory extends IMixinFactory {
  <S>(): IReducerMap<S>;
}

interface IStoreBuilder<S extends object> {
  registerInitialState(fn: IMixinFactory): void;
  registerReducer(fn: IReducerMixinFactory): void;
  buildStore(): IStore<S>;
}

function StoreBuilder<S extends object>(): IStoreBuilder<S> {
  const initialStateMixins: IMixinFactory[] = [];
  const reducerMixins: IReducerMixinFactory[] = [];

  function registerInitialState(fn: IMixinFactory) {
    initialStateMixins.push(fn);
  }

  function registerReducer(fn: IReducerMixinFactory) {
    reducerMixins.push(fn);
  }

  function _composeMixins<T>(mixins: IMixinFactory[]): T {
    return mixins.reduce((ag, v) => ({ ...ag, ...v() }), {} as T);
  }

  function buildStore(): IStore<S> {
    const initialState: S = _composeMixins<S>(initialStateMixins);
    const reducers: IReducerMap<S> = _composeMixins<IReducerMap<S>>(
      reducerMixins
    );
    return Store(initialState, reducers);
  }

  return {
    registerInitialState,
    registerReducer,
    buildStore,
  };
}

export default StoreBuilder;
export type { IStoreBuilder };