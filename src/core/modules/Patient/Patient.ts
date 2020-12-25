import type { IModuleLoader } from "@/core/loader/ModuleLoader";
import type { IGameContext } from "@/core/Game";
import patientReducers from "./patientReducers";
import * as actions from "./patientActions";

type DeepPartial<T> = Partial<{ [P in keyof T]: DeepPartial<T[P]> }>;
interface IPatient<P> {
  setState: (newState: DeepPartial<P>) => void;
  getState: () => P;
}

interface IPatientState<P> {
  patient: P;
}

interface IPatientParameters<P> {
  context: Partial<IGameContext<P>>;
}

interface IPatientModuleLoaderParameters<P> {
  initialState: P;
}

function PatientModule<P>({ context }: IPatientParameters<P>): IPatient<P> {
  return {
    setState: (newState) =>
      context.store.dispatch({
        type: actions.SET_PATIENT_STATE,
        payload: newState,
      }),
    getState: () => context.store.getState().patient,
  };
}

function createPatientModule<P>(
  params: IPatientModuleLoaderParameters<P>
): IModuleLoader<IPatient<P>, IPatientParameters<P>> {
  return {
    load(helper) {
      helper.storeBuilder.registerInitialState(() => ({
        patient: params.initialState,
      }));

      helper.storeBuilder.registerReducerMap(() => patientReducers<P>());
      return PatientModule;
    },
  };
}

export default PatientModule;
export { createPatientModule };
export type {
  IPatientModuleLoaderParameters,
  IPatientParameters,
  IPatientState,
  IPatient,
};
