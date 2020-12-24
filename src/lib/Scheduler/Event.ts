import { generateRandomString } from "@/lib/utils";
import type { IExecutable, WithPatientAndContext } from "@/lib/Executable";
import type { IGameContext } from '@/core/Game';

interface IEventParameters<P> extends IExecutable<P, WithPatientAndContext<P>> {
  // action?: IAction;
  delayMs: number;
  repeat?: number;
}

interface IEvent extends Omit<IEventParameters<unknown>, "execute"> {
  eventId: string;
  timerId?: NodeJS.Timeout | number;
}

function createEventFactory<P>(context: Partial<IGameContext<P>>) {
  const eventCallbacks = new Map<string, () => void>();

  return {
    factory: function EventFactory({
      execute,
      delayMs,
      repeat,
    }: IEventParameters<P>): IEvent {
      const eventId = generateRandomString();
      eventCallbacks.set(eventId, () => execute(context.store.getState().patient, context));

      return { delayMs, repeat, eventId };
    },
    getEventCallback: (eventId: IEvent['eventId']) => eventCallbacks.get(eventId),
  };
}

export type { IEvent, IEventParameters };
export default createEventFactory;
