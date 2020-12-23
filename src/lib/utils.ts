export function deepClone<T, K extends keyof T>(value: T, seen = new WeakMap<{}, any>()): T {
  if (typeof value !== "object" || Object(value) !== value) return value;
  if (seen.has(value)) return seen.get(value);

  let result: T;
  try {
    result = new (value as any).constructor();
  } catch {
    result = Object.create(Object.getPrototypeOf(value));
  }
  seen.set(value, result);

  const keys = Object.keys(value) as K[];

  for (const key of keys) {
    result[key] = deepClone(value[key], seen);
  }

  return result;
}

export const isNode = new Function(
  "try {return this===global;}catch(e){return false;}"
);

export const isBrowser = new Function(
  "try {return this===window;}catch(e){return false;}"
);

export const generateRandomString = (): string => String(Math.random()).slice(2);