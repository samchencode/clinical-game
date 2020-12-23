import type { IStore } from "@/lib/Store/Store";

interface IConditionMonitor {
  //
}

interface IConditionMonitorParams<S> {
  store: IStore<S>;
  conditions: ICondition<S>[];
}

interface ICondition<S> {
  check: (state: S) => boolean;
  invoke: (state: S, dispatch: IStore<S>["dispatch"]) => void;
}

function ConditionMonitorModule<S>(
  params: IConditionMonitorParams<S>
): IConditionMonitor {
  const { store, conditions } = params;

  function _checkAll(newState: S) {
    for(const condition of conditions) {
      if(condition.check(newState)) {
        condition.invoke(newState, store.dispatch);
      }
    }
  }

  _checkAll(store.getState())

  store.subscribe((newState) => {
    _checkAll(newState);
  })

  return {};
}

export default ConditionMonitorModule;
