import { IViewable } from "@/lib/View/View";
import type { IGameContext } from "@/core/Game";
import type { IExecutable, WithContext } from "@/lib/Executable";

interface IOptionParameters<P> extends IExecutable<P, WithContext<P>> {
  name: string;
  isAvailable: (patientState: P) => boolean;
}

interface IOption<P> extends IOptionParameters<P>, IViewable {
  select: () => void;
}

function OptionFactory<P>(
  context: Partial<IGameContext<P>>,
  params: IOptionParameters<P>
): IOption<P> {
  const select = params.execute.bind(null, context);

  return {
    ...params,
    select,
    view: (visitor) => {
      visitor.displayOption(params.name, select);
    },
  };
}

interface IOptionManager<P> {
  getOptions: () => IOption<P>[];
}

interface IOptionManagerParameters<P> {
  context: Partial<IGameContext<P>>;
  options?: IOptionParameters<P>[];
}

function OptionManagerModule<P>({
  context,
  options: optionParams = [],
}: IOptionManagerParameters<P>): IOptionManager<P> {
  const options = optionParams.map((param) => OptionFactory(context, param));

  return {
    getOptions() {
      return options.filter((o) =>
        o.isAvailable(context.store.getState().patient)
      );
    },
  };
}

export default OptionManagerModule;
export type {
  IOptionParameters,
  IOption,
  IOptionManagerParameters,
  IOptionManager,
};
