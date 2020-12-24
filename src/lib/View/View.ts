import type { IStore } from "@/lib/Store/Store";
import type { IPatient } from "@/lib/Patient/Patient";
import type { IScribe } from "@/lib/Scribe/Scribe";
import ConsoleAgent from "./Console";
import VueAgent from "./Vue";

interface IViewModuleParameters<S> {
  store: IStore<S>;
  patient: IPatient<unknown>;
  scribe: IScribe;
  viewAgent: "console" | "vue" | IViewAgent;
  vueInstance?: any;
}

interface IView {
  close: () => void,
}

function ViewModule<S>(params: IViewModuleParameters<S>): IView {
  let agent: IViewAgent;

  if (params.viewAgent === null) {
    return { close: () => {} };
  } else if (params.viewAgent === "console") {
    agent = ConsoleAgent();
  } else if (params.viewAgent === "vue") {
    agent = VueAgent(/* May add vue instance here */);
  } else {
    agent = params.viewAgent;
  }

  params.store.subscribe((newState) => {
    const visitor = agent.renderer();

    const options = params.patient.getOptions();
    const lines = params.scribe.getScripts();
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
