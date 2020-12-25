import type { IGameContext } from "@/core/Game";

type WithContext<P> = (context: Partial<IGameContext<P>>) => void;
type WithPatientAndContext<P> = WithContext<P> extends (
  ...args: infer U
) => infer R
  ? (patient: P, ...args: U) => R
  : never;

interface IExecutable<P, F extends WithContext<P> | WithPatientAndContext<P>> {
  execute: F;
}

export type { IExecutable, WithContext, WithPatientAndContext };
