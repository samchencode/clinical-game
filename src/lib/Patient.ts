import type { ILoadable } from "@/core/load/loadModules";
import type { IReducerMap } from "@/lib/Store/Store";

interface IPatientModule {}
interface IPatientModuleParameters<P> {
  initialState: P;
  reducers: IReducerMap<P>;
}

function PatientModule(): IPatientModule {
  return {};
}

function createPatientModule<P>(params: IPatientModuleParameters<P>) {
  const loadable: ILoadable<IPatientModule> = {
    load(helper) {
      helper.storeBuilder;
      return PatientModule;
    },
  };
  return loadable;
}

export default createPatientModule;
export type { IPatientModuleParameters };
