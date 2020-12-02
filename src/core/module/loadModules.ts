import ModuleLoadHelper from './ModuleLoadHelper';
import type { IBaseGameState } from '@/core/store/BaseGameState';
import { createPatientModule } from '@/lib/Patient/Patient';
import { createSchedulerModule } from '@/lib/Scheduler/Scheduler';
import type { ISchedulerState } from '@/lib/Scheduler/Scheduler';
import type { IPatientModuleLoaderParameters, IPatientState } from '@/lib/Patient/Patient';
import { createScribeModule } from '@/lib/Scribe/Scribe';
import type { IScribeState } from '@/lib/Scribe/Scribe';

interface IGameState<P> extends IBaseGameState, IPatientState<P>, ISchedulerState, IScribeState {};

function loadModules<P> (params: {
  patient: IPatientModuleLoaderParameters<P>
}) {

  const helper = ModuleLoadHelper<IGameState<P>>();
  const PatientModule = createPatientModule(params.patient);
  const SchedulerModule = createSchedulerModule<IGameState<P>>();
  const ScribeModule = createScribeModule<IGameState<P>>();

  return {
    Patient: PatientModule.load(helper),
    Store: helper.storeBuilder.buildStore,
    Scheduler: SchedulerModule.load(helper),
    Scribe: ScribeModule.load(helper),
  }
}

export type { IGameState };
export default loadModules;