import type { IModuleLoader } from "@/core/load/loadModules";
import type { IReducerMap } from "@/lib/Store/Store";

interface IPatientModule {}
interface IPatientModuleParameters<P> {
  initialState: P;
  reducers: IReducerMap<P>;
}

function PatientModule(): IPatientModule {
  return {};
}

function createPatientModule<P>(params: IPatientModuleParameters<P>): IModuleLoader<IPatientModule> {
  return {
    load(helper) {
      helper.storeBuilder;
      return PatientModule;
    },
  };
}

export default createPatientModule;
export type { IPatientModuleParameters };
