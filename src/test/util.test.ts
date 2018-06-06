import { safeStringSplit, extractUserId, safeMap } from '../util'

test('Split string', () => {
  // Arrange
  const str = 'action|drama'
  const key = '|'

  // Act
  const result = safeStringSplit(str, key)

  // Assert
  expect(result).toEqual(['action', 'drama'])
})

test('Do not trow for a non-string', () => {
  // Arrange
  const str = null
  const key = '|'

  // Act
  const result = safeStringSplit(str, key)

  // Assert
  expect(result).toEqual([])
})

describe('Extract user id', () => {
  test('Not login in', () => {
    // Arrange
    const user = undefined

    // Act
    const result = extractUserId(user)

    // Assert
    expect(result).toBe(null)
  })

  test('Missing id', () => {
    // Arrange
    const user = {}

    // Act
    const result = extractUserId(user)

    // Assert
    expect(result).toBe(null)
  })

  test('Id is not a string', () => {
    // Arrange
    const user = { id: 1 }

    // Act
    const result = extractUserId(user as any)

    // Assert
    expect(result).toBe(null)
  })

  test('Extract id', () => {
    // Arrange
    const user = { id: '5' }

    // Act
    const result = extractUserId(user as any)

    // Assert
    expect(result).toBe('5')
  })
})

describe('Safe map', () => {
  test('Is not an array', () => {
    // Arrange
    const arr = null

    // Act
    const result = safeMap(arr, null)

    // Assert
    expect(result).toEqual([])
  })

  test('Map over an array', () => {
    // Arrange
    const arr = ['1', '2']
    const map = v => v | 0

    // Act
    const result = safeMap(arr, map)

    // Assert
    expect(result).toEqual([1, 2])
  })
})
