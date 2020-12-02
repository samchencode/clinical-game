import type { IModuleLoader } from "@/core/module/ModuleLoader";
import type { IStore } from "@/lib/Store/Store";
import * as actions from "./scribeActions";
import scribeReducer from './scribeReducers';
import { IViewable, IViewVisitor } from '@/lib/View/View';

interface IScript extends IViewable {
  type: "text" | "image";
  data: string;
}

interface IScribeState {
  scripts: Omit<IScript, "view">[];
}
const initialState: IScribeState = { scripts: [] }

interface IScribeModuleParameters<S extends IScribeState> {
  store: IStore<S>
}

interface IScribe {
  text: (s: string) => void;
  image: (url: string) => void;
  getScripts: () => IScript[];
}

function Script(data: Omit<IScript, "view">) {
  let view: (v: IViewVisitor) => void;
  if(data.type === 'text') {
    view = function(visitor) {
      visitor.displayText(data.data);
    }
  } else if (data.type === 'image') {
    view = function(visitor) {
      visitor.displayImage(data.data)
    }
  }
  return { ...data, view };
}

function ScribeModule<S extends IScribeState>({ store }: IScribeModuleParameters<S>): IScribe {
  const _writeLine = (type: string) => (data: string) =>
    store.dispatch({ type: actions.WRITE_LINE, payload: { type, data } });

  function getScripts(): IScript[] {
    const scriptData = store.getState().scripts;
    return scriptData.map(Script);
  }

  return {
    text: _writeLine("text"),
    image: _writeLine("image"),
    getScripts,
  };
}

function createScribeModule<S extends IScribeState> (): IModuleLoader<IScribe, IScribeModuleParameters<S>> {
  return {
    load: (helper) => {
      helper.storeBuilder.registerInitialState(() => initialState);
      helper.storeBuilder.registerReducerMap(() => scribeReducer);
      return ScribeModule;
    }
  }
}

export default ScribeModule;
export type { IScribeState, IScribe };
export { createScribeModule };