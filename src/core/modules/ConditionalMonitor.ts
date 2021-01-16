import type { IExecutable, WithPatientAndContext } from '@/core/common/Executable';
import type { IGameContext } from "@/core/Game";

interface IConditionalMonitor {
  //
}

interface IConditionalMonitorParameters<P> {
  conditions: IConditional<P>[];
  context: Partial<IGameContext<P>>;
}

interface IConditional<P> extends IExecutable<P, WithPatientAndContext<P>> {
  check: (patient: P) => boolean;
  once?: boolean,
}

function ConditionalMonitorModule<P>({
  context,
  conditions = [],
}: IConditionalMonitorParameters<P>): IConditionalMonitor {
  const { store } = context;

  const stale = new Map();

  function _checkAll(patient: P) {
    for (const condition of conditions) {
      if (stale.get(condition) === undefined && condition.check(patient)) {
        _execute(condition);
      }
    }
  }

  function _execute(condition: IConditional<P>) {
    if(condition.once) stale.set(condition, 1);
    condition.execute(context, store.getState().patient);
  }

  _checkAll(store.getState().patient);

  store.subscribe((newState) => {
    _checkAll(newState.patient);
  });

  return {};
}

export default ConditionalMonitorModule;
export type { IConditionalMonitorParameters, IConditionalMonitor };
