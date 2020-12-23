import Scribe from "@/lib/Scribe/Scribe";
import type { IScribeState } from "@/lib/Scribe/Scribe";
import scribeReducers from "@/lib/Scribe/scribeReducers";
import Store from "@/lib/Store/Store";
import type { IStore } from "@/lib/Store/Store";

let store: IStore<IScribeState>;

beforeEach(() => {
  store = Store<IScribeState>({
    initialState: { scripts: [] },
    reducers: scribeReducers,
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
