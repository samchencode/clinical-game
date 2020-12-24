import type { IExecutable, WithPatientAndContext } from '@/lib/Executable';
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
}

function ConditionalMonitorModule<P>({
  context,
  conditions = [],
}: IConditionalMonitorParameters<P>): IConditionalMonitor {
  const { store } = context;

  function _checkAll(patient: P) {
    for (const condition of conditions) {
      if (condition.check(patient)) {
        condition.execute(patient, context);
      }
    }
  }

  _checkAll(store.getState().patient);

  store.subscribe((newState) => {
    _checkAll(newState.patient);
  });

  return {};
}

export default ConditionalMonitorModule;
export type { IConditionalMonitorParameters, IConditionalMonitor };
