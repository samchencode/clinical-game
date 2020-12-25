import Patient from "@/lib/Patient/Patient";
import type { IPatient } from "@/lib/Patient/Patient";
import reducers from "@/lib/Patient/patientReducers";
import Store from "@/lib/Store/Store";
import type { IGameContext, IGameState } from "@/core/Game";

describe("Patient", () => {
  describe("instantiation", () => {
    it("creates a new patient object", () => {
      const patient = Patient({ context: {} });
      expect(patient).toEqual(expect.any(Object));
      expect(patient).toHaveProperty("setState");
    });
  });

  describe("module", () => {
    let initialPatientState = {
      name: "Alex",
      age: 24,
      alive: true,
      address: { zipcode: "98000", state: "NY" },
    };

    type PS = typeof initialPatientState;
    type State = IGameState<PS>;

    let context: Partial<IGameContext<PS>> = {};
    let patient: IPatient<PS>;

    beforeEach(() => {
      const initialState = { patient: initialPatientState } as State;

      context.store = Store<State>({
        initialState,
        reducers: reducers<PS>() as any,
      });
      patient = Patient({ context });
    });

    it("gets the current patient state", () => {
      expect(patient.getState()).toEqual(initialPatientState);
    });

    it("sets the state without changing anything", () => {
      patient.setState({});
      expect(patient.getState()).toEqual(initialPatientState);
    });

    it("sets the state by specifying modifications", () => {
      patient.setState({ age: 25 });
      expect(patient.getState()).toEqual({ ...initialPatientState, age: 25 });
    });

    it("sets a deep attribute of state by specifying modifications", () => {
      patient.setState({ address: { zipcode: "00000" } });
      expect(patient.getState()).toEqual({
        name: "Alex",
        age: 24,
        alive: true,
        address: { zipcode: "00000", state: "NY" },
      });
    });
  });
});
