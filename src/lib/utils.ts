export function deepClone<T, K extends keyof T>(
  value: T,
  seen = new WeakMap<{}, any>()
): T {
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

export function deepMerge<
  O1 extends { [k: string]: any },
  O2 extends { [k: string]: any }
>(obj1: O1, obj2: O2): O1 & O2 {
  let result: { [k: string]: any };
  if (obj2 instanceof Array) {
    result = [];
    const indicies = Object.keys(obj1)
      .concat(Object.keys(obj2))
      .sort()
      .filter((k, i, arr) => k !== arr[i - 1]);
    for (let idx of indicies) {
      result[idx] = (obj2 as any)[idx] || (obj1 as any)[idx];
    }
  } else {
    result = { ...obj1, ...obj2 };
  }

  const obj2SharedKeysToObjects = Object.keys(obj2)
    .filter((k) => typeof obj2[k] === "object")
    .filter((k) => typeof obj1[k] === "object");

  for (const key of obj2SharedKeysToObjects) {
    result[key] = deepMerge(obj1[key], obj2[key]);
  }

  return result as O1 & O2;
}

export const isNode = new Function(
  "try {return this===global;}catch(e){return false;}"
);

export const isBrowser = new Function(
  "try {return this===window;}catch(e){return false;}"
);

export const generateRandomString = (): string =>
  String(Math.random()).slice(2);
