import type { IAction } from "../Store";

interface IEventHandlerStrategy<S> {
  (state: S, dispatch: (a: IAction) => void): void;
}

interface IEventHandler<S> {
  handle: IEventHandlerStrategy<S>;
  delayMs?: number;
  type: string;
}

interface IEventHandlerContext<S> {
  executeStrategy(...args: Parameters<IEventHandlerStrategy<S>>): void;
}

function EventHandlerContextFactory<S>(
  handler: IEventHandler<S>
): IEventHandlerContext<S> {
  const { handle, delayMs } = handler;

  function executeStrategy(
    ...args: Parameters<IEventHandlerStrategy<S>>
  ): void {
    const execute = () => handle(...args);
    if (!delayMs) execute();
    else setTimeout(execute, delayMs);
  }

  return { executeStrategy };
}

export default EventHandlerContextFactory;
export type { IEventHandler, IEventHandlerContext };
