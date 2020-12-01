import ModuleLoadHelper from './ModuleLoadHelper';
import type { IBaseGameState } from '@/core/store/BaseGameState';
import { createPatientModule } from '@/lib/Patient';
import { createSchedulerModule } from '@/lib/Scheduler/Scheduler';
import type { ISchedulerState } from '@/lib/Scheduler/Scheduler';
import type { IPatientModuleLoaderParameters, IPatientState } from '@/lib/Patient';

interface IGameState<P> extends IBaseGameState, IPatientState<P>, ISchedulerState {};

function loadModules<P> (params: {
  patient: IPatientModuleLoaderParameters<P>
}) {

  const helper = ModuleLoadHelper<IGameState<P>>();
  const PatientModule = createPatientModule(params.patient);
  const SchedulerModule = createSchedulerModule<IGameState<P>>();

  return {
    Patient: PatientModule.load(helper),
    Store: helper.storeBuilder.buildStore,
    Scheduler: SchedulerModule.load(helper),
  }
}

export type { IGameState };
export default loadModules;