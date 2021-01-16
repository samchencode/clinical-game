import { deepClone } from "@/lib/utils";
import type { IGameContext } from "@/core/Game";

interface ISceneManager<P> {
  start: (name: string) => Promise<void>;
  register: (name: string, scene: IScene<P>) => void;
}

interface ISceneManagerParameters<P> {
  initialScene?: string;
  scenes: { [name: string]: IScene<P> };
  context: IGameContext<P>;
}

interface IScene<P> {
  (context: IGameContext<P>): void;
}

function SceneManagerModule<P>({
  initialScene,
  scenes: inputScenes,
  context,
}: ISceneManagerParameters<P>): ISceneManager<P> {
  const scenes = deepClone(inputScenes);

  const queueExecution = () => new Promise((s) => setTimeout(s, 0));

  const start = (name: string) =>
    queueExecution().then(() => scenes[name](context));

  if (initialScene !== undefined) start(initialScene);

  return {
    start,
    register(name, scene) {
      scenes[name] = scene;
    },
  };
}

export default SceneManagerModule;
export type { ISceneManager, ISceneManagerParameters };
