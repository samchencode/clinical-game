import { generateRandomString } from '@/lib/utils';
import type { IAction } from "@/lib/Store/Store";

interface IEventParameters {
  action: IAction;
  delayMs: number;
  repeat?: number;
}

interface IEvent extends IEventParameters {
  eventId: string;
  timerId?: NodeJS.Timeout | number;
}

function EventFactory(params: IEventParameters): IEvent {
  const eventId = generateRandomString();
  return { ...params, eventId }
}

export type { IEvent, IEventParameters }
export default EventFactory;