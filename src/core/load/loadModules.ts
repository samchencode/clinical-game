import ModuleLoadHelper from './ModuleLoadHelper';
import type { IModuleLoadHelper } from './ModuleLoadHelper';
import type { IBaseGameState } from '@/core/store/BaseGameState';
import createPatientModule from '@/lib/Patient';
import type { IPatientModuleParameters } from '@/lib/Patient';

interface IGameState extends IBaseGameState {};

interface ILoadable<M> {
  load(helper: IModuleLoadHelper<IGameState>): () => M;
}

function loadModules<P> (params: {
  patient: IPatientModuleParameters<P>
}) {

  const helper = ModuleLoadHelper<IGameState>();
  const PatientModule = createPatientModule(params.patient);

  return {
    Patient: PatientModule.load(helper),
  }
}

export type { ILoadable };
export default loadModules;