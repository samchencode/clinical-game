import ModuleLoadHelper from './ModuleLoadHelper';
import { createPatientModule } from '@/core/modules/Patient/Patient';
import { createSchedulerModule } from '@/core/modules/Scheduler/Scheduler';
import type { ISchedulerState } from '@/core/modules/Scheduler/Scheduler';
import type { IPatientModuleLoaderParameters, IPatientState } from '@/core/modules/Patient/Patient';
import { createScribeModule } from '@/core/modules/Scribe/Scribe';
import type { IScribeState } from '@/core/modules/Scribe/Scribe';
import { createGameStatusModule } from '@/core/modules/GameStatus/GameStatus';
import type { IGameStatusState } from '@/core/modules/GameStatus/GameStatus';

interface IGameState<P> extends IGameStatusState, IPatientState<P>, ISchedulerState, IScribeState {};

function loadModules<P> (params: {
  patient: IPatientModuleLoaderParameters<P>
}) {

  const helper = ModuleLoadHelper<IGameState<P>>();

  const PatientModule = createPatientModule(params.patient);
  const SchedulerModule = createSchedulerModule<IGameState<P>>();
  const ScribeModule = createScribeModule<IGameState<P>>();
  const GameStatusModule = createGameStatusModule();

  return {
    Patient: PatientModule.load(helper),
    Store: helper.storeBuilder.buildStore,
    Scheduler: SchedulerModule.load(helper),
    Scribe: ScribeModule.load(helper),
    GameStatus: GameStatusModule.load(helper),
  }
}

export type { IGameState };
export default loadModules;