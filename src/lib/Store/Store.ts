interface IAction {
  type: string;
  payload?: any;
}

interface IReducer<S> {
  (state: S, payload?: any): S;
}

interface IReducerMap<S> {
  [actionType: string]: IReducer<S>;
}

interface IMiddlewareContext<S> {
  dispatch: (a: IAction) => void;
  getState: () => S;
}

interface IMiddleware<S> {
  (context: IMiddlewareContext<S>): (
    next: (action: IAction) => IAction
  ) => (action: IAction) => IAction;
}

interface IStore<S> {
  getState: () => S;
  dispatch: (a: IAction) => void;
  subscribe: (cb: (newState: S) => void) => void;
}

interface IStoreParameters<S> {
  initialState: S;
  reducers?: IReducerMap<S>;
  middleware?: IMiddleware<S>[];
}

function StoreModule<S>({
  initialState,
  reducers = {},
  middleware = [],
}: IStoreParameters<S>): IStore<S> {
  let state = initialState;

  type Subscriber = (newState: S) => void;
  let subscribers: Subscriber[] = [];

  function subscribe(callback: Subscriber) {
    subscribers.push(callback);
  }

  function _alertAllSubscribers(state: S) {
    subscribers.forEach((cb) => cb(state));
  }

  function _composeMiddleware(
    middleware: IMiddleware<S>[]
  ): ReturnType<ReturnType<IMiddleware<S>>> {
    const context: IMiddlewareContext<S> = { dispatch, getState };
    return middleware.reduceRight<(a: IAction) => IAction>(
      (ag, v) => {
        const next = v(context);
        return next(ag);
      },
      (a) => a
    );
  }
  const _runMiddleware = _composeMiddleware(middleware);

  function getState() {
    return state;
  }

  function dispatch(a: IAction) {
    const action = _runMiddleware(a);
    if (reducers.hasOwnProperty(action.type)) {
      state = reducers[action.type](state, action.payload);
    }
    _alertAllSubscribers(state);
  }

  return {
    getState,
    dispatch,
    subscribe,
  };
}

export default StoreModule;
export type {
  IStore,
  IReducer,
  IReducerMap,
  IAction,
  IStoreParameters,
  IMiddleware,
  IMiddlewareContext,
};
