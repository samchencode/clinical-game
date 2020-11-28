export function deepClone<T, K extends keyof T> (value: T): T {
  if(typeof value !== 'object') return value;

  const keys = Object.getOwnPropertyNames(value) as K[];

  let result: { [key in K]: T[K] } = Array.isArray(value)
  ? Array()
  : Object.create({});

  for( const key of keys ) {
     result[key] = deepClone(value[key])
  }
  return result as T;
}