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

  const stale = new Map(conditions.filter(c => c.once).map(c => [c, 0]));

  function _checkAll(patient: P) {
    for (const condition of conditions) {
      if (stale.get(condition) === undefined && condition.check(patient)) {
        _execute(condition);
      }
    }
  }

  function _execute(condition: IConditional<P>) {
    condition.execute(context, store.getState().patient);
    if(condition.once) stale.set(condition, 1);
  }

  _checkAll(store.getState().patient);

  store.subscribe((newState) => {
    _checkAll(newState.patient);
  });

  return {};
}

export default ConditionalMonitorModule;
export type { IConditionalMonitorParameters, IConditionalMonitor };
