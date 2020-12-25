import Store from "@/lib/Store/Store";
import GameStatus from "@/core/modules/GameStatus/GameStatus";
import type { IGameStatus } from "@/core/modules/GameStatus/GameStatus";
import reducers from "@/core/modules/GameStatus/gameStatusReducers";

describe("GameStatus", () => {
  const context: any = {};

  let initialState = { status: 0 };

  beforeEach(() => {
    context.store = Store({ initialState, reducers });
  });

  describe("instantiation", () => {
    it("creates a status object", () => {
      const status = GameStatus({ context });
      expect(status).toBeDefined();
      expect(status).toHaveProperty("start");
      expect(status).toHaveProperty("hasStarted");
      expect(status).toHaveProperty("end");
      expect(status).toHaveProperty("hasEnded");
    });
  });

  describe("module", () => {
    let status: IGameStatus;

    beforeEach(() => {
      status = GameStatus({ context });
    });

    it("checks if hasStarted, default false", () => {
      expect(status.hasStarted()).toBe(false);
    });

    it("checks if hasEnded, default false", () => {
      expect(status.hasEnded()).toBe(false);
    });

    it("sets hasStarted to true", () => {
      status.start()
      expect(status.hasStarted()).toBe(true);
    })

    it("sets ended and started to true when ended", () => {
      status.end()
      expect(status.hasStarted()).toBe(true);
      expect(status.hasEnded()).toBe(true);
    })
  });
});
