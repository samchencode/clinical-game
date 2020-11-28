interface Action {
  type: string;
  payload: any;
}

interface Reducer<S> {
  (state: S, payload: any): S;
}

interface Store<S> {
  getState: () => S;
  dispatch: (a: Action) => void;
  subscribe: (cb: (newState: S) => void) => void;
}

function StoreModule<S>(
  initialState: S,
  reducers: { [action: string]: Reducer<S> } = {}
): Store<S> {
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

  function dispatch(action: Action) {
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
export type { Store, Reducer, Action };
