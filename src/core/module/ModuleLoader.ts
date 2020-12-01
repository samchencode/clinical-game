import type { IModuleLoadHelper } from "./ModuleLoadHelper";
import { IGameState } from "./loadModules";

interface IModuleLoader<M, P extends object> {
  load(helper: IModuleLoadHelper<IGameState<unknown>>): (params?: P) => M;
}

export type { IModuleLoader };
