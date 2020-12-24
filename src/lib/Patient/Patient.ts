import type { IModuleLoader } from "@/core/module/ModuleLoader";
import type { IReducerMap, IReducer } from "@/lib/Store/Store";
import { deepClone } from "../utils";
import type { IGameContext } from "@/core/Game";

interface IPatient {}

interface IPatientState<P> {
  patient: P;
}

interface IPatientModuleParameters<P> {
  context: Partial<IGameContext<P>>;
}

interface IPatientModuleLoaderParameters<P> {
  initialState: P;
  reducers: IReducerMap<P>;
}

function PatientModule<P>({ context }: IPatientModuleParameters<P>): IPatient {
  return {};
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

function createPatientModule<P>(
  params: IPatientModuleLoaderParameters<P>
): IModuleLoader<IPatient, IPatientModuleParameters<P>> {
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
export type {
  IPatientModuleLoaderParameters,
  IPatientModuleParameters,
  IPatientState,
  IPatient,
};
