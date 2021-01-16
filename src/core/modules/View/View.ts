import type { IGameContext } from "@/core/Game";
import VueAgent from "./Vue/Vue";

interface IViewParameters<S> {
  context: IGameContext<unknown>;
  viewAgent: "vue" | IViewAgent;
}

interface IView {
  close: () => void,
}

function ViewModule<S>({ viewAgent, context }: IViewParameters<S>): IView {
  let agent: IViewAgent;

  if (viewAgent === null) {
    return { close: () => {} };
  } else if (viewAgent === "vue") {
    agent = VueAgent();
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
export type { IViewable, IViewAgent, IViewableVisitor, IViewParameters, IView };
