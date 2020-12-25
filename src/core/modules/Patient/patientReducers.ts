import type { IReducerMap } from '@/lib/Store/Store';
import type { IPatientState } from './Patient';
import { deepClone, deepMerge } from "../../../lib/utils";
import * as actions from './patientActions';

const patientReducers: <P>() => IReducerMap<IPatientState<P>> = () => ({
  [actions.SET_PATIENT_STATE](state, modification) {
    const clonedMod = { patient: deepClone(modification) }
    const newState = deepMerge(deepClone(state), clonedMod) as typeof state;

    return newState
  }
})

export default patientReducers