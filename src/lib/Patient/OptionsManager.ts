import type { IStore } from "@/lib/Store/Store";
import type { IScheduler } from "@/lib/Scheduler/Scheduler";
import type { IPatientState } from "./Patient";
import { IViewable } from '@/lib/View/View';

interface IOptionParameters<P> {
  name: string;
  isAvailable: (patientState: P) => boolean;
  execute: (
    dispatch: IStore<unknown>["dispatch"],
    scheduler: IScheduler
  ) => void;
}

interface IOption<P> extends IOptionParameters<P>, IViewable  {
  select: () => void;
}

// TODO: gameContext should include more than scheduler, scribe would also be useful
function OptionFactory<P>(dispatch: IStore<unknown>["dispatch"], scheduler: IScheduler, params: IOptionParameters<P>): IOption<P> {
  const select = params.execute.bind(null, dispatch, scheduler);
  
  return {
    ...params,
    select,
    view: (visitor) => { visitor.displayOption(params.name, select) },
  };
}

interface OptionManager<P, S extends IPatientState<P>> {
  getOptions: (store: IStore<S>) => IOption<P>[];
}

interface OptionManagerParameters<P> {
  options: IOptionParameters<P>[];
  dispatch: IStore<unknown>["dispatch"];
  scheduler: IScheduler;
}

function OptionsManager<P, S extends IPatientState<P>>({
  dispatch,
  scheduler,
  options: optionParams,
}: OptionManagerParameters<P>): OptionManager<P, S> {
  const options = optionParams.map(param => OptionFactory(dispatch, scheduler, param));

  function getOptions(store: IStore<S>) {
    return options.filter((o) => o.isAvailable(store.getState().patient));
  }

  return { getOptions };
}

export default OptionsManager;
export type { IOptionParameters, IOption };
