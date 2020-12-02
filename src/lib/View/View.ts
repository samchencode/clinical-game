import type { IStore } from '@/lib/Store/Store';
import type { IPatient } from '@/lib/Patient/Patient';
import type { IScribe } from '@/lib/Scribe/Scribe';

interface AbstractViewModuleParameters<S> {
  store: IStore<S>;
  patient: IPatient<unknown>;
  scribe: IScribe;
  view: IViewStrategy;
}

function AbstractViewModule<S> (params: AbstractViewModuleParameters<S>) {
  params.store.subscribe((newState) => {
    const options = params.patient.getOptions();
    const lines = params.scribe.getScripts();
    params.view(options, lines);
  })
}

interface IViewVisitor {
  displayText: (s: string) => void;
  displayImage: (url: string) => void;
  displayOption: (name: string, chooseCallback: () => void) => void;
}

interface IViewable {
  view: (visitor: IViewVisitor) => void;
}

interface IViewStrategy {
  (
    options: IViewable[],
    lines: IViewable[],
  ): void;
}

export type { IViewable, IViewVisitor, IViewStrategy }