import { IViewStrategy, IViewVisitor } from './View';

function ConsoleViewVisitor(): IViewVisitor {
  return null
}

const usesConsole: IViewStrategy = (options, lines) => {
  // holds an instance of ConsoleViewVisitor probably...
  const visitor = ConsoleViewVisitor();
}