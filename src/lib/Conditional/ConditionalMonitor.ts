import type { IStore } from "@/lib/Store/Store";
import type { IGameContext } from "@/core/Game";

interface IConditionalMonitor {
  //
}

interface IConditionalMonitorParameters<S> {
  store: IStore<S>;
  conditions: IConditional<S>[];
  context: IGameContext<unknown>;
}

interface IConditional<S> {
  check: (state: S) => boolean;
  execute: (state: S, dispatch: IStore<S>["dispatch"]) => void;
}

function ConditionalMonitorModule<S>({
  store,
  conditions = [],
}: IConditionalMonitorParameters<S>): IConditionalMonitor {
  function _checkAll(newState: S) {
    for (const condition of conditions) {
      if (condition.check(newState)) {
        condition.execute(newState, store.dispatch);
      }
    }
  }

  _checkAll(store.getState());

  store.subscribe((newState) => {
    _checkAll(newState);
  });

  return {};
}

export default ConditionalMonitorModule;
export type { IConditionalMonitorParameters, IConditionalMonitor };
