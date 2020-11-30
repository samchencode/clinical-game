import type { IModuleLoader } from "@/core/module/loadModules";
import type { IStore } from "../Store/Store";
import EventHandlerContext from "./EventHandler";
import type { IEventHandler, IEventHandlerContext } from "./EventHandler";

interface IEventEmitter<S> {
  type: string;
  shouldEmit(state: S): boolean;
}

interface IEventManager {}
interface IEventManagerParameters<S> {
  store: IStore<S>;
  eventEmitters?: IEventEmitter<S>[];
  eventHandlers?: IEventHandler<S>[];
}

function EventManagerModule<S>({
  store,
  eventEmitters = [],
  eventHandlers = [],
}: IEventManagerParameters<S>): IEventManager {
  const handlerMap: {
    [key: string]: IEventHandlerContext<S>[];
  } = {};
  const emitters = eventEmitters.slice();

  eventHandlers.forEach((h) => {
    const context = EventHandlerContext(h);
    if (handlerMap[h.type]) handlerMap[h.type].push(context);
    else handlerMap[h.type] = [context];
  });

  function _emit(eventType: string, newState: S) {
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
export type { IEventEmitter, IEventManager };

const createEventModule = <S>(): IModuleLoader<IEventManager, IEventManagerParameters<S>> => ({
  load(helper) {
    // TODO: create Store.events here
    return EventManagerModule;
  },
});

export { createEventModule };
