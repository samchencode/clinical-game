function isCircular(obj: any) {
  let isCircular: boolean = false;
  try {
    JSON.stringify(obj)
  } catch(e) {
    if(e.message.match(/(cyclic|circular)/i)) {
      isCircular = true;
    }
  }
  return isCircular;
}

export function deepClone<T, K extends keyof T>(value: T): T {
  if (typeof value !== "object") return value;
  if (value === null) return value;

  // FIXME: Objects with circular references are not cloned
  if (isCircular(value)) return value;

  const keys = Object.getOwnPropertyNames(value) as K[];

  let result: { [key in K]: T[K] } = Array.isArray(value)
    ? Array()
    : Object.create({});

  for (const key of keys) {
    result[key] = deepClone(value[key]);
  }

  return result as T;
}

export const isNode = new Function(
  "try {return this===global;}catch(e){return false;}"
);

export const isBrowser = new Function(
  "try {return this===window;}catch(e){return false;}"
);

export const generateRandomString = (): string => String(Math.random()).slice(2);