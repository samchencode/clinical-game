import type { IModuleLoader } from "@/core/module/ModuleLoader";
import type { IReducerMap, IReducer, IStore } from "@/lib/Store/Store";
import type { IOption, IOptionParameters } from "./OptionsManager";
import OptionsManager from "./OptionsManager";
import { deepClone } from "../utils";
import type { IGameContext } from "@/core/Game";

interface IPatient<P> {
  getOptions: () => IOption<P>[];
}

interface IPatientState<P> {
  patient: P;
}

interface IPatientModuleParameters<P> {
  context: Partial<IGameContext<P>>;
  options?: IOptionParameters<P>[];
}

interface IPatientModuleLoaderParameters<P> {
  initialState: P;
  reducers: IReducerMap<P>;
}

function PatientModule<P>({
  options: optionParams = [],
  context,
}: IPatientModuleParameters<P>): IPatient<P> {
  const optionsManager = OptionsManager<P>({
    context,
    options: optionParams,
  });

  return {
    getOptions: optionsManager.getOptions.bind(
      null,
      context.store.getState().patient
    ),
  };
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
): IModuleLoader<IPatient<P>, IPatientModuleParameters<P>> {
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
