import type { IGameContext } from "@/core/Game";
import ConsoleAgent from "./Console";
import VueAgent from "./Vue";

interface IViewModuleParameters<S> {
  context: IGameContext<unknown>;
  viewAgent: "console" | "vue" | IViewAgent;
  vueInstance?: any;
}

interface IView {
  close: () => void,
}

function ViewModule<S>({ viewAgent, context, vueInstance }: IViewModuleParameters<S>): IView {
  let agent: IViewAgent;

  if (viewAgent === null) {
    return { close: () => {} };
  } else if (viewAgent === "console") {
    agent = ConsoleAgent();
  } else if (viewAgent === "vue") {
    agent = VueAgent(/* May add vue instance here */);
  } else {
    agent = viewAgent;
  }

  context.store.subscribe(() => {
    const visitor = agent.renderer();

    const options = context.options.getOptions();
    const lines = context.scribe.getScripts();
    lines.forEach((l) => l.view(visitor));
    options.forEach((l) => l.view(visitor));

    agent.done();
  });

  return { close: () => agent.close() };
}

interface IViewAgent {
  renderer: () => IViewableVisitor;
  done: () => void;
  close: () => void;
}

interface IViewableVisitor {
  displayText: (s: string) => void;
  displayImage: (url: string) => void;
  displayOption: (name: string, chooseCallback: () => void) => void;
}

interface IViewable {
  view: (visitor: IViewableVisitor) => void;
}

export default ViewModule;
export type { IViewable, IViewAgent, IViewableVisitor, IViewModuleParameters, IView };
