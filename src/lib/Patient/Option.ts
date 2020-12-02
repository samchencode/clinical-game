import type { IAction, IStore } from "@/lib/Store/Store";
import type { IScheduler } from "@/lib/Scheduler/Scheduler";

// if option is strategy then, what's context?

interface IOptionsMeta<P> {
  name: string;
  isAvailable: (patientState: P) => boolean;
}

interface IOptionParameters<P> extends IOptionsMeta<P> {
  execute: (
    dispatch: IStore<unknown>["dispatch"],
    scheduler: IScheduler
  ) => void;
}

interface IOption<P> extends IOptionsMeta<P> {
  select: () => void;
  display: any; // TODO: make this accept a View.Visitor
}

const createOptionFactory = (
  dispatch: IStore<unknown>["dispatch"],
  scheduler: IScheduler
) =>
  function OptionFactory<P>(params: IOptionParameters<P>): IOption<P> {
    const { isAvailable, execute, name } = params;

    const select = () => execute(dispatch, scheduler);

    return {
      name,
      select,
      isAvailable,
      display: null,
    };
  };

export default createOptionFactory;
export type { IOptionParameters, IOption };
