import Store from "@/lib/Store/Store";

describe("StoreModule", () => {
  it("Instantiates an empty store", () => {
    const store = Store({ initialState: {} });

    expect(store).toHaveProperty("dispatch");
    expect(store).toHaveProperty("subscribe");
    expect(store).toHaveProperty("getState");
    expect(store.getState()).toEqual({});
  });

  it("allows initial value to be retrieved", () => {
    const store = Store({ initialState: 123 });
    expect(store.getState()).toBe(123);
  });

  it("accepts a reducer that returns a new state", () => {
    const TEST_ACTION = "TEST_ACTION";

    const store = Store({
      initialState: 123,
      reducers: {
        [TEST_ACTION]: function (state, payload) {
          return state + payload;
        },
      },
    });
  });

  it("modifies state based on reducer", () => {
    const TEST_ACTION = "TEST_ACTION";

    const store = Store({
      initialState: 123,
      reducers: {
        [TEST_ACTION]: function (state, payload) {
          return state + payload;
        },
      },
    });

    store.dispatch({
      type: TEST_ACTION,
      payload: 1,
    });

    expect(store.getState()).toBe(124);
  });

  it("calls the callback on an observer after a state change", (done) => {
    const TEST_ACTION = "TEST_ACTION";

    const store = Store({
      initialState: 123,
      reducers: {
        [TEST_ACTION]: function (state, payload) {
          return state + payload;
        },
      },
    });

    store.subscribe((newState) => {
      try {
        expect(newState).toBe(124);
        done();
      } catch (e) {
        done(e);
      }
    });

    store.dispatch({
      type: TEST_ACTION,
      payload: 1,
    });
  });

  it("keeps track of two actions and reducers", (done) => {
    const ADD = (state: number, payload: number) => state + payload;
    const SUBTRACT = (state: number, payload: number) => state - payload;

    const store = Store({ initialState: 0, reducers: { ADD, SUBTRACT } });
    expect(store.getState()).toBe(0);

    store.dispatch({ type: "ADD", payload: 1 });
    store.subscribe((newState) => {
      try {
        expect(newState).toBe(-4);
        done();
      } catch (e) {
        done(e);
      }
    });
    store.dispatch({ type: "SUBTRACT", payload: 5 });
  });

  it("doesn't change the store when an action without a reducer is run", () => {
    const store = Store({ initialState: 0, reducers: {} });
    expect(store.getState()).toBe(0);

    store.dispatch({ type: "ADD", payload: 1 });
    expect(store.getState()).toBe(0);
  });

  it("accepts middlewares", (done) => {
    const store = Store({
      initialState: 0,
      reducers: {},
      middleware: [
        () => (next) => (action) => {
          done();
          return next(action);
        },
      ],
    });
    store.dispatch({ type: "TEST" });
  });

  it("allows middleware to dispatch actions", (done) => {
    const store = Store({
      initialState: 0,
      reducers: { FOO: () => done()},
      middleware: [
        (context) => (next) => (action) => {
          if(action.type === "DISPATCH") context.dispatch({ type: "FOO" })
          return next(action);
        },
      ],
    });
    store.dispatch({ type: "DISPATCH" });
  });

  it("accepts multiple middlewares", () => {
    const cb1 = jest.fn();
    const cb2 = jest.fn();

    const store = Store({
      initialState: 0,
      reducers: {},
      middleware: [
        () => (next) => (action) => {
          cb1();
          return next(action);
        },
        () => (next) => (action) => {
          cb2();
          return next(action);
        },
      ],
    });

    store.dispatch({ type: "TEST" });
    expect(cb1).toBeCalledTimes(1);
    expect(cb2).toBeCalledTimes(1);
  });

  it("allows force updating subscribers without any state change", (done) => {
    const cb = jest.fn();
    
    const store = Store({
      initialState: 0,
      reducers: {}
    });

    store.subscribe((s) => {
      expect(s).toBe(0);
      cb(s);
      done();
    });

    expect(cb).not.toHaveBeenCalled();
    store.forceUpdate();
    expect(cb).toHaveBeenCalledTimes(1);
  })
});
