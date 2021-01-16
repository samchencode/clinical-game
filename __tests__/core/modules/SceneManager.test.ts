import SceneManager from "@/core/modules/SceneManager";

describe("SceneManagerModule", () => {
  describe("#instantiation", () => {
    it("creates a new SceneManager", () => {
      const sm = SceneManager({ scenes: {}, context: null });
      expect(sm).toEqual({
        start: expect.any(Function),
        register: expect.any(Function),
      });
    });
  });

  it("allows registering of new scenes", (done) => {
    const scene = (ctx: any) => {
      done();
    };
    const sm = SceneManager({ scenes: {}, context: null });
    sm.register('test', scene)
    sm.start("test");
  });

  it("calls the function of a scene on scene.start", (done) => {
    const scene = (ctx: any) => {
      done();
    };
    const sm = SceneManager({ scenes: { test: scene }, context: null });
    sm.start("test");
  });

  it("starts the initialScene automatically", (done) => {
    const scene = (ctx: any) => {
      done();
    };
    const sm = SceneManager({
      initialScene: "test",
      scenes: { test: scene },
      context: null,
    });
  });

  it("waits for empty call stack before running initialScene", (done) => {
    const mock = jest.fn();

    const scene = (ctx: any) => {
      mock(), done();
      expect(mock).toHaveBeenCalledTimes(1);
    };
    const sm = SceneManager({
      initialScene: "test",
      scenes: { test: scene },
      context: null,
    });

    expect(mock).not.toHaveBeenCalled();
  });

  it("waits for empty call stack before starting scene", (done) => {
    const mock = jest.fn();

    const scene = (ctx: any) => {
      mock(), done();
      expect(mock).toHaveBeenCalledTimes(1);
    };
    const sm = SceneManager({
      scenes: { test: scene },
      context: null,
    });
    sm.start("test");
    expect(mock).not.toHaveBeenCalled();
  });
});
