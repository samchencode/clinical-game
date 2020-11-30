import StoreBuilder from '@/lib/Store/StoreBuilder';
import type { IStoreBuilder } from '@/lib/Store/StoreBuilder';

interface IModuleLoadHelper<S extends object> {
  storeBuilder: IStoreBuilder<S>;
}

function ModuleLoadHelper<S extends Object>(): IModuleLoadHelper<S> {
  const storeBuilder = StoreBuilder<S>();

  return {
    storeBuilder
  }
}

export default ModuleLoadHelper;
export type { IModuleLoadHelper };