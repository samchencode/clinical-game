import type { IGameContext } from "@/core/Game";

interface IExecutable<P> {
  execute: (
    context: Partial<IGameContext<P>>,
    ...args: any
  ) => void;
}

export type { IExecutable };
