import ModuleLoadHelper from './ModuleLoadHelper';
import type { IModuleLoadHelper } from './ModuleLoadHelper';
import type { IBaseGameState } from '@/core/store/BaseGameState';
import createPatientModule from '@/lib/Patient';
import { createEventModule } from '@/lib/EventManager/EventManager';
import type { IPatientModuleLoaderParameters, IPatientState } from '@/lib/Patient';

interface IGameState<P> extends IBaseGameState, IPatientState<P> {};

interface IModuleLoader<M> {
  load(helper: IModuleLoadHelper<IGameState<unknown>>): (...args: any) => M;
}

function loadModules<P> (params: {
  patient: IPatientModuleLoaderParameters<P>
}) {

  const helper = ModuleLoadHelper<IGameState<P>>();
  const PatientModule = createPatientModule(params.patient);
  const EventModule = createEventModule<IGameState<P>>();

  return {
    Patient: PatientModule.load(helper),
    Store: helper.storeBuilder.buildStore,
    Event: EventModule.load(helper),
  }
}

export type { IModuleLoader, IGameState };
export default loadModules;