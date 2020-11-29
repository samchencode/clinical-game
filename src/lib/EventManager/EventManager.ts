import type { IStore } from "../Store";
import EventHandlerContext from './EventHandler';
import type { IEventHandler, IEventHandlerContext } from './EventHandler';

interface IEventEmitter<S> {
  type: string;
  shouldEmit(state: S): boolean;
}

interface IEventManager<S> {}

function EventManagerModule<S>(
  store: IStore<S>,
  emitters: IEventEmitter<S>[],
  handlers: IEventHandler<S>[],
): IEventManager<S> {
  const handlerMap: {
    [key: string]: IEventHandlerContext<S>[];
  } = {};

  handlers.forEach(h => {
    const context = EventHandlerContext(h);
    if(handlerMap[h.eventType]) handlerMap[h.eventType].push(context);
    else handlerMap[h.eventType] = [context];
  })

  function _emit(eventType: IEventEmitter<S>["type"], newState: S) {
    if (!handlerMap.hasOwnProperty(eventType)) return;

    handlerMap[eventType].forEach((h) =>
      h.executeStrategy(newState, store.dispatch)
    );
  }

  store.subscribe((newState: S) => {
    emitters
      .filter((e) => e.shouldEmit(newState))
      .forEach((e) => _emit(e.type, newState));
  });

  return {};
}

export default EventManagerModule;
