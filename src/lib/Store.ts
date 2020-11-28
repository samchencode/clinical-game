interface IAction {
  type: string;
  payload: any;
}

interface IReducer<S> {
  (state: S, payload: any): S;
}

interface IStore<S> {
  getState: () => S;
  dispatch: (a: IAction) => void;
  subscribe: (cb: (newState: S) => void) => void;
}

function StoreModule<S>(
  initialState: S,
  reducers: { [action: string]: IReducer<S> } = {}
): IStore<S> {
  let state = initialState;

  type Subscriber = (newState: S) => void;
  let subscribers: Subscriber[] = [];

  function subscribe(callback: Subscriber) {
    subscribers.push(callback);
  }

  function _alertAllSubscribers(state: S) {
    subscribers.forEach((cb) => cb(state));
  }

  function getState() {
    return state;
  }

  function dispatch(action: IAction) {
    state = reducers[action.type](state, action.payload);
    _alertAllSubscribers(state);
  }

  return {
    getState,
    dispatch,
    subscribe,
  };
}

export default StoreModule;
export type { IStore, IReducer, IAction };
