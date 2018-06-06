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

export function extractUserId(user?: { id?: string }): string | null {
  if (!user || typeof user.id !== 'string') {
    return null
  }
  return user.id
}

export function assertUserId(userId: string) {
  if (!userId) {
    throw new UnauthorizedError()
  }
}
