import ModuleLoadHelper from './ModuleLoadHelper';
import type { IModuleLoadHelper } from './ModuleLoadHelper';
import type { IBaseGameState } from '@/core/store/BaseGameState';
import createPatientModule from '@/lib/Patient';
import type { IPatientModuleParameters, IPatientState } from '@/lib/Patient';

interface IGameState<P> extends IBaseGameState, IPatientState<P> {};

interface IModuleLoader<M> {
  load(helper: IModuleLoadHelper<IGameState<unknown>>): () => M;
}

function loadModules<P> (params: {
  patient: IPatientModuleParameters<P>
}) {

  const helper = ModuleLoadHelper<IGameState<P>>();
  const PatientModule = createPatientModule(params.patient);

  return {
    Patient: PatientModule.load(helper),
    Store: helper.storeBuilder.buildStore,
  }
}

export type { IModuleLoader, IGameState };
export default loadModules;