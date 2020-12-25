import StoreBuilder from "@/lib/Store/StoreBuilder";
import type { IReducerMap } from "@/lib/Store/Store";

describe("StoreBuilder", () => {
  it("composes stores of different types to create a final one", () => {
    interface BaseStore {
      foo: string;
    }
    const initialBase: BaseStore = { foo: "foo" };

    interface hasA {
      a: string;
    }
    const initialA: hasA = { a: "a" };

    interface hasB {
      b: string;
    }
    const initialB: hasB = { b: "b" };

    interface ComposedStore extends BaseStore, hasA, hasB {}

    const builder = StoreBuilder<ComposedStore>();
    builder.registerInitialState(() => initialBase);
    builder.registerInitialState(() => initialA);
    builder.registerInitialState(() => initialB);

    const store = builder.buildStore();
    const state = store.getState();

    expect(state).toHaveProperty("foo");
    expect(state).toHaveProperty("a");
    expect(state).toHaveProperty("b");
  });

  it("composes a store with reducers", (done) => {
    interface BaseStore {
      foo: string;
    }
    const initialBase: BaseStore = { foo: "foo" };

    const baseReducers: IReducerMap<BaseStore> = {
      FOO: (state) => {
        done();
        return state;
      },
    };

    interface ComposedStore extends BaseStore {}
    const builder = StoreBuilder<ComposedStore>();
    builder.registerInitialState(() => initialBase);
    builder.registerReducerMap(() => baseReducers);

    const store = builder.buildStore();
    store.dispatch({ type: "FOO" });
  });

  it("exposes a store module func that accepts middleware", (done) => {
    interface BaseStore {
      foo: string;
    }
    const initialBase: BaseStore = { foo: "foo" };

    const builder = StoreBuilder<BaseStore>();
    builder.registerInitialState(() => initialBase);

    const store = builder.buildStore({
      middleware: [
        () => next => action => {
          done();
          return next(action);
        },
      ]
    });;
    store.dispatch({ type: "FOO" });
  })
});
