import Store from "@/lib/Store/Store";
import type { IReducerMap } from "@/lib/Store/Store";
import OptionManager from "@/core/modules/OptionManager";
import type { IGameContext, IGameState } from "@/core/Game";

let initialPatientState = {
  name: "Alex",
};

type PS = typeof initialPatientState;
type State = IGameState<PS>;
type Context = Partial<IGameContext<PS>>;

let optionsReducers: IReducerMap<State> = {
  CHANGE_NAME_TO_DEREK(state) {
    state.patient.name = "Derek";
    return state;
  },
};

let context: Context = {};
beforeEach(() => {
  context.store = Store<State>({
    initialState: {
      patient: { ...initialPatientState },
      scheduler: {
        pendingDispatch: [],
      },
      status: null,
      scripts: null,
    },
    reducers: optionsReducers,
  });
});

describe("OptionManager", () => {
  it("creates a optionManager without options", () => {
    const options = OptionManager({ context, options: [] });
    expect(options).not.toBeFalsy();
    expect(options).toHaveProperty("getOptions");
    expect(options.getOptions()).toEqual([]);
  });

  const mock = jest.fn();
  const option = {
    name: "CHANGE_NAME_TO_DEREK",
    isAvailable: (s: PS) => s.name !== "Derek",
    execute: (context: Context) => {
      mock();
      context.store.dispatch({ type: "CHANGE_NAME_TO_DEREK" });
    },
  };

  it("creates a optionManager with option: change name", () => {
    const options = OptionManager<PS>({
      context,
      options: [option],
    });
    expect(options.getOptions()[0]).toHaveProperty(
      "name",
      "CHANGE_NAME_TO_DEREK"
    );
  });

  it("dispatches action on patient.select", () => {
    mock.mockClear();
    const options = OptionManager<PS>({
      context,
      options: [option],
    });
    options.getOptions()[0].select();
    expect(mock).toBeCalledTimes(1);
  });

  it("hides options that arent available", () => {
    const myOpt = { ...option };
    myOpt.isAvailable = () => false;

    const options = OptionManager<PS>({
      context,
      options: [myOpt],
    });
    expect(options.getOptions()).toEqual([]);
  });

  it("hides options that were once available if state changes", () => {
    const options = OptionManager<PS>({
      context,
      options: [option],
    });
    options.getOptions()[0].select();
    expect(options.getOptions()).toEqual([]);
  });

  it("allows an empty array of options to replace the original", () => {
    const options = OptionManager<PS>({
      context,
      options: [option],
    });

    options.setOptions([]);
    expect(options.getOptions()).toEqual([]);
  });

  it("allows a new array of options to replace the original", (done) => {
    const options = OptionManager<PS>({
      context,
      options: [option],
    });

    const newOption = {
      name: "TEST_OPTION",
      isAvailable: () => true,
      execute: () => done(),
    };

    options.setOptions([newOption, option]);
    expect(options.getOptions()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: newOption.name }),
        expect.objectContaining({ name: option.name }),
      ])
    );

    options.getOptions()[0].execute(null);
  });

  it("should assume options are available by default", (done) => {
    const option = {
      name: "TEST_OPTION",
      execute: () => done(),
    };

    const options = OptionManager<PS>({
      context,
      options: [option],
    });

    const [ opt ] = options.getOptions();
    expect(opt).toEqual(expect.objectContaining({name: option.name}));
    opt.execute(null);
  });
});
