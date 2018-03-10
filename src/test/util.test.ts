import { safeStringSplit } from '../util'

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
