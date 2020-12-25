import ModuleLoadHelper from './ModuleLoadHelper';
import type { IBaseGameState } from '@/core/store/BaseGameState';
import createBaseGameStore from '@/core/store/gameStore';
import { createPatientModule } from '@/core/modules/Patient/Patient';
import { createSchedulerModule } from '@/core/modules/Scheduler/Scheduler';
import type { ISchedulerState } from '@/core/modules/Scheduler/Scheduler';
import type { IPatientModuleLoaderParameters, IPatientState } from '@/core/modules/Patient/Patient';
import { createScribeModule } from '@/core/modules/Scribe/Scribe';
import type { IScribeState } from '@/core/modules/Scribe/Scribe';

interface IGameState<P> extends IBaseGameState, IPatientState<P>, ISchedulerState, IScribeState {};

function loadModules<P> (params: {
  patient: IPatientModuleLoaderParameters<P>
}) {

  const helper = ModuleLoadHelper<IGameState<P>>();

  createBaseGameStore(helper.storeBuilder);
  
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