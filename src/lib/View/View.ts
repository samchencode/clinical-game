import type { IStore } from '@/lib/Store/Store';

interface AbstractViewModuleParameters<S> {
  store: IStore<S>
}

function AbstractViewModule<S> (params: AbstractViewModuleParameters<S>) {

  // const visitor // take this from abstract view

  params.store.subscribe((newState) => {
    // if store changes, call update on concrete view?
    
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

interface IViewModule {
  update: (
    options: IViewable[],
    lines: IViewable[],
  ) => void;
}

function HTMLView() {

}

export type { IViewable, IViewVisitor }