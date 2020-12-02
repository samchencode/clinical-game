import type { IStore } from "@/lib/Store/Store";
import type { IScheduler } from "@/lib/Scheduler/Scheduler";
import type { IPatientState } from "./Patient";

// if option is strategy then, what's context?

interface IOptionParameters<P> {
  name: string;
  isAvailable: (patientState: P) => boolean;
  execute: (
    dispatch: IStore<unknown>["dispatch"],
    scheduler: IScheduler
  ) => void;
}

interface IOption<P> extends IOptionParameters<P> {
  select: () => void;
  display: any; // TODO: make this accept a View.Visitor
}

function OptionFactory<P>(dispatch: IStore<unknown>["dispatch"], scheduler: IScheduler, params: IOptionParameters<P>): IOption<P> {
  return {
    ...params,
    select: params.execute.bind(null, dispatch, scheduler),
    display: null,
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
