import { IViewStrategy, IViewVisitor } from './View';

function VueViewVisitor(): IViewVisitor {
  return null;
}

const usesVue: IViewStrategy = (options, lines) => {
  // holds an instance of VueViewVisitor probably...
  const visitor = VueViewVisitor();
}
