import { UnauthorizedError } from './custom-error'

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

export function extractUserId(user?: { sub?: string }): number | null {
  if (
    !user ||
    !user.sub ||
    typeof user.sub !== 'string' ||
    !user.sub.startsWith('auth0|')
  ) {
    return null
  }
  const id = Number(user.sub.split('auth0|')[1])
  return isNaN(id) ? null : id
}

export function assertUserId(userId: number) {
  if (!userId) {
    throw new UnauthorizedError()
  }
}
