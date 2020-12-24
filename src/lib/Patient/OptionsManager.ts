import { IViewable } from "@/lib/View/View";
import type { IGameContext } from "@/core/Game";
import type { IExecutable } from "@/lib/Executable";

interface IOptionParameters<P> extends IExecutable<P> {
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

interface OptionManager<P> {
  getOptions: (patientState: P) => IOption<P>[];
}

interface OptionManagerParameters<P> {
  options: IOptionParameters<P>[];
  context: Partial<IGameContext<P>>;
}

function OptionsManager<P>({
  context,
  options: optionParams,
}: OptionManagerParameters<P>): OptionManager<P> {
  const options = optionParams.map((param) => OptionFactory(context, param));

  function getOptions(patient: P) {
    return options.filter((o) => o.isAvailable(patient));
  }

  return { getOptions };
}

export default OptionsManager;
export type { IOptionParameters, IOption };
