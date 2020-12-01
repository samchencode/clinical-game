import type { IModuleLoader } from "@/core/module/loadModules";
import type { IReducerMap, IReducer } from "@/lib/Store/Store";
import { deepClone } from "./utils";

interface IPatientModule {}
interface IPatientModuleParameters {}
interface IPatientModuleLoaderParameters<P> {
  initialState: P;
  reducers: IReducerMap<P>;
}

interface IPatientState<P> {
  patient: P;
}

function PatientModule(params: IPatientModuleParameters = {}): IPatientModule {
  return {};
}

const _makePatientStateReducers = <P>(
  reducers: IReducerMap<P> = {}
): IReducerMap<IPatientState<P>> =>
  Object.entries(reducers).reduce((ag, [actionType, patientReducer]) => {
    const gameStateReducer: IReducer<IPatientState<P>> = (s, p) => {
      const newState = deepClone(s);
      newState.patient = patientReducer(s.patient, p);
      return newState;
    };
    return { ...ag, [actionType]: gameStateReducer };
  }, {} as IReducerMap<IPatientState<P>>);

function createPatientModule<P>(
  params: IPatientModuleLoaderParameters<P>
): IModuleLoader<IPatientModule, IPatientModuleParameters> {
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
export type { IPatientModuleLoaderParameters, IPatientState };
