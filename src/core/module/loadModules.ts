import ModuleLoadHelper from './ModuleLoadHelper';
import type { IBaseGameState } from '@/core/store/BaseGameState';
import { createPatientModule } from '@/lib/Patient';
import type { IPatientModuleLoaderParameters, IPatientState } from '@/lib/Patient';

interface IGameState<P> extends IBaseGameState, IPatientState<P> {};

function loadModules<P> (params: {
  patient: IPatientModuleLoaderParameters<P>
}) {

  const helper = ModuleLoadHelper<IGameState<P>>();
  const PatientModule = createPatientModule(params.patient);

  return {
    Patient: PatientModule.load(helper),
    Store: helper.storeBuilder.buildStore,
  }
}

export type { IGameState };
export default loadModules;