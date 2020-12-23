import Store from "@/lib/Store/Store";
import type { IStore, IReducerMap } from "@/lib/Store/Store";
import PatientModule from "@/lib/Patient/Patient";
import type { IPatientState } from "@/lib/Patient/Patient";
import Scheduler from "@/lib/Scheduler/Scheduler";
import { ISchedulerState, IScheduler } from "@/lib/Scheduler/Scheduler";

let initialPatientState = {
  name: "Alex",
};

type PS = typeof initialPatientState;
type State = {} & IPatientState<PS> & ISchedulerState;

let patientReducers: IReducerMap<State> = {
  CHANGE_NAME_TO_DEREK(state) {
    state.patient.name = "Derek";
    return state;
  },
};

let store: IStore<State>;
let scheduler: IScheduler;
beforeEach(() => {
  store = Store<State>({
    initialState: {
      patient: { ...initialPatientState },
      scheduler: {
        pendingDispatch: [],
      },
    },
    reducers: patientReducers,
  });

  scheduler = Scheduler({ store });
});

describe("PatientModule", () => {
  it("creates a patientModule without options", () => {
    const patient = PatientModule({ store, scheduler });
    expect(patient).not.toBeFalsy();
    expect(patient).toHaveProperty("getOptions");
    expect(patient.getOptions()).toEqual([]);
  });

  const mock = jest.fn();
  const option = {
    name: "CHANGE_NAME_TO_DEREK",
    isAvailable: (s: PS) => s.name !== "Derek",
    execute: (dispatch: any, scheduler: any) => {
      mock();
      dispatch({ type: "CHANGE_NAME_TO_DEREK" });
    },
  };

  it("creates a patientModule with option: change name", () => {
    const patient = PatientModule<PS, State>({
      store,
      scheduler,
      options: [option],
    });
    expect(patient.getOptions()[0]).toHaveProperty(
      "name",
      "CHANGE_NAME_TO_DEREK"
    );
  });

  it("dispatches action on option.select", () => {
    mock.mockClear();
    const patient = PatientModule<PS, State>({
      store,
      scheduler,
      options: [option],
    });
    patient.getOptions()[0].select();
    expect(mock).toBeCalledTimes(1);
  });

  it("hides options that arent available", () => {
    const myOpt = { ...option }
    myOpt.isAvailable = () => false;

    const patient = PatientModule<PS, State>({
      store,
      scheduler,
      options: [myOpt],
    });
    expect(patient.getOptions()).toEqual([]);
  });

  it("hides options that were once available if state changes", () => {
    const patient = PatientModule<PS, State>({
      store,
      scheduler,
      options: [option],
    });
    patient.getOptions()[0].select();
    expect(patient.getOptions()).toEqual([]);
  });
});
