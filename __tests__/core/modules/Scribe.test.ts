import Scribe from "@/core/modules/Scribe/Scribe";
import scribeReducers from "@/core/modules/Scribe/scribeReducers";
import Store from "@/lib/Store/Store";
import type { IStore, IReducerMap } from "@/lib/Store/Store";
import type { IGameContext, IGameState } from "@/core/Game";

type State = IGameState<unknown>

let store: IStore<State>;

beforeEach(() => {
  store = Store<State>({
    initialState: { scripts: [] } as State,
    reducers: scribeReducers as IReducerMap<State>,
  });
});

describe("ScribeModule", () => {
  it("creates an empty scribeModule", () => {
    const s = Scribe({ store });
  });

  it("writes scripts of different types", () => {
    const s = Scribe({ store });
    s.text("HELLO WORLD");
    s.image("//:placeimg.com/random")
    expect(s.getScripts()[0]).toHaveProperty('type', 'text');
    expect(s.getScripts()[0]).toHaveProperty('data', 'HELLO WORLD');
    expect(s.getScripts()[1]).toHaveProperty('type', 'image');
    expect(s.getScripts()[1]).toHaveProperty('data', '//:placeimg.com/random');
    expect(s.getLatestScript()).toHaveProperty('type', 'image');
    expect(s.getLatestScript()).toHaveProperty('data', '//:placeimg.com/random');
  });
});
