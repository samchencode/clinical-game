import type { IModuleLoader } from "@/core/module/ModuleLoader";
import type { IReducerMap, IReducer, IStore } from "@/lib/Store/Store";
import type { IScheduler } from "@/lib/Scheduler/Scheduler";
import type { IOption, IOptionParameters } from "./OptionsManager";
import OptionsManager from "./OptionsManager";
import { deepClone } from "../utils";

interface IPatient<P> {
  getOptions: () => IOption<P>[];
}

interface IPatientState<P> {
  patient: P;
}

interface IPatientModuleParameters<P, S extends IPatientState<P>> {
  store: IStore<S>;
  scheduler: IScheduler;
  options?: IOptionParameters<P>[];
}

interface IPatientModuleLoaderParameters<P> {
  initialState: P;
  reducers: IReducerMap<P>;
}

function PatientModule<P, S extends IPatientState<P>>({
  store,
  scheduler,
  options: optionParams = [],
}: IPatientModuleParameters<P, S>): IPatient<P> {
  const optionsManager = OptionsManager<P, S>({
    dispatch: store.dispatch,
    scheduler,
    options: optionParams,
  });

  return { getOptions: optionsManager.getOptions.bind(null, store) };
}

const _makePatientStateReducers = <P>(
  reducers: IReducerMap<P> = {}
): IReducerMap<IPatientState<P>> =>
  Object.entries(reducers).reduce<IReducerMap<IPatientState<P>>>(
    (ag, [actionType, patientReducer]) => {
      const gameStateReducer: IReducer<IPatientState<P>> = (s, p) =>
        Object.assign(deepClone(s), {
          patient: patientReducer(s.patient, p),
        });
      return { ...ag, [actionType]: gameStateReducer };
    },
    {}
  );

function createPatientModule<P, S extends IPatientState<P>>(
  params: IPatientModuleLoaderParameters<P>
): IModuleLoader<IPatient<P>, IPatientModuleParameters<P, S>> {
  return {
    load(helper) {
      helper.storeBuilder.registerInitialState(() => ({
        patient: params.initialState,
      }));

      helper.storeBuilder.registerReducerMap(() =>
        _makePatientStateReducers(params.reducers)
      );
      return PatientModule;
    },
  };
}

export default PatientModule;
export { createPatientModule };
export type { IPatientModuleLoaderParameters, IPatientState, IPatient };
