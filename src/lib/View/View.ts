import type { IStore } from "@/lib/Store/Store";
import type { IPatient } from "@/lib/Patient/Patient";
import type { IScribe } from "@/lib/Scribe/Scribe";
import ConsoleAgent from "./Console";
import VueAgent from "./Vue";

interface ViewModuleParameters<S> {
  store: IStore<S>;
  patient: IPatient<unknown>;
  scribe: IScribe;
  agent: "console" | "vue" | IViewAgent;
  vueInstance?: any;
}

function ViewModule<S>(params: ViewModuleParameters<S>) {
  let agent: IViewAgent;

  if (params.agent === "console") {
    agent = ConsoleAgent();
  } else if (params.agent === "vue") {
    agent = VueAgent(/* May add vue instance here */);
  } else {
    agent = params.agent;
  }

  params.store.subscribe(() => {
    const visitor = agent.renderer();

    const options = params.patient.getOptions();
    const lines = params.scribe.getScripts();
    lines.forEach((l) => l.view(visitor));
    options.forEach((l) => l.view(visitor));
  });
}

interface IViewAgent {
  renderer: () => IViewableVisitor;
}

interface IViewableVisitor {
  displayText: (s: string) => void;
  displayImage: (url: string) => void;
  displayOption: (name: string, chooseCallback: () => void) => void;
  done: () => void;
}

interface IViewable {
  view: (visitor: IViewableVisitor) => void;
}

export default ViewModule;
export type { IViewable, IViewAgent, IViewableVisitor };
