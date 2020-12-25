import { IViewable } from "@/lib/View/View";
import type { IGameContext } from "@/core/Game";
import type { IExecutable, WithContext } from "@/lib/Executable";

interface IOptionParameters<P> extends IExecutable<P, WithContext<P>> {
  name: string;
  isAvailable?: (patientState: P) => boolean;
}

interface IOption<P> extends IOptionParameters<P>, IViewable {
  select: () => void;
}

function OptionFactory<P>(
  context: Partial<IGameContext<P>>,
  params: IOptionParameters<P>
): IOption<P> {
  const select = params.execute.bind(null, context);
  const isAvailable = params.isAvailable || (() => true);
  
  return {
    ...params,
    select,
    isAvailable,
    view: (visitor) => {
      visitor.displayOption(params.name, select);
    },
  };
}

interface IOptionManager<P> {
  getOptions: () => IOption<P>[];
  setOptions: (params: IOptionParameters<P>[]) => void;
}

interface IOptionManagerParameters<P> {
  context: Partial<IGameContext<P>>;
  options?: IOptionParameters<P>[];
}

function OptionManagerModule<P>({
  context,
  options: optionParams = [],
}: IOptionManagerParameters<P>): IOptionManager<P> {
  const _paramsToOptions = (params: IOptionParameters<P>[]) => params.map((p) => OptionFactory(context, p));
  let options: IOption<P>[] = _paramsToOptions(optionParams); 
  


  return {
    getOptions() {
      return options.filter((o) =>
        o.isAvailable(context.store.getState().patient)
      );
    },
    setOptions(params) {
      options = _paramsToOptions(params);
      // uses store update to alert view to update
      // if more modules depend on options and modified options, add to store
      context.store.forceUpdate();
    }
  };
}

export default OptionManagerModule;
export type {
  IOptionParameters,
  IOption,
  IOptionManagerParameters,
  IOptionManager,
};
