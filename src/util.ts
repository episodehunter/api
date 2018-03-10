export function safeStringSplit(str: string | null | undefined, key: string): string[] {
  if (!str || !str.split) {
    return []
  }
  return str.split(key)
}

export function safeMap<T, R>(arr: T[], map: (arg: T) => R): R[] {
  if (Array.isArray(arr)) {
    return arr.map(v => map(v))
  }
  return []
}
