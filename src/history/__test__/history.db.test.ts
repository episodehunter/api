import { spy } from 'simple-spy'
import { create } from 'chain-spy'
import { getUserEpisodeHistoryPage, getGetUserEpisodeHistory } from '../history.db'

test('Set limit to max 101', async () => {
  // Arrange
  const userId = '1'
  const offset = 0
  const limit = 102
  const getUserEpisodeHistory = spy(() => Promise.resolve([]))

  // Act
  await getUserEpisodeHistoryPage(userId, offset, limit, getUserEpisodeHistory as any)

  // Assert
  expect(getUserEpisodeHistory.callCount).toBe(1)
  expect(getUserEpisodeHistory.args[0][2]).toBe(101)
})

test('Set limit to min 1', async () => {
  // Arrange
  const userId = '1'
  const offset = 0
  const limit = 0
  const getUserEpisodeHistory = spy(() => Promise.resolve([]))

  // Act
  await getUserEpisodeHistoryPage(userId, offset, limit, getUserEpisodeHistory as any)

  // Assert
  expect(getUserEpisodeHistory.callCount).toBe(1)
  expect(getUserEpisodeHistory.args[0][2]).toBe(1)
})

test('Set offset to max 100000', async () => {
  // Arrange
  const userId = '1'
  const offset = 100001
  const limit = 0
  const getUserEpisodeHistory = spy(() => Promise.resolve([]))

  // Act
  await getUserEpisodeHistoryPage(userId, offset, limit, getUserEpisodeHistory as any)

  // Assert
  expect(getUserEpisodeHistory.callCount).toBe(1)
  expect(getUserEpisodeHistory.args[0][1]).toBe(100000)
})

test('Set offset to min 0', async () => {
  // Arrange
  const userId = '1'
  const offset = -1
  const limit = 0
  const getUserEpisodeHistory = spy(() => Promise.resolve([]))

  // Act
  await getUserEpisodeHistoryPage(userId, offset, limit, getUserEpisodeHistory as any)

  // Assert
  expect(getUserEpisodeHistory.callCount).toBe(1)
  expect(getUserEpisodeHistory.args[0][1]).toBe(0)
})

test('Pass offset', async () => {
  // Arrange
  const userId = '1'
  const offset = 1
  const limit = 0
  const getUserEpisodeHistory = spy(() => Promise.resolve([]))

  // Act
  await getUserEpisodeHistoryPage(userId, offset, limit, getUserEpisodeHistory as any)

  // Assert
  expect(getUserEpisodeHistory.callCount).toBe(1)
  expect(getUserEpisodeHistory.args[0][1]).toBe(1)
})

test('Pass limit', async () => {
  // Arrange
  const userId = '1'
  const offset = 0
  const limit = 1
  const getUserEpisodeHistory = spy(() => Promise.resolve([]))

  // Act
  await getUserEpisodeHistoryPage(userId, offset, limit, getUserEpisodeHistory as any)

  // Assert
  expect(getUserEpisodeHistory.callCount).toBe(1)
  expect(getUserEpisodeHistory.args[0][2]).toBe(2)
})

test('Pass user id', async () => {
  // Arrange
  const userId = '1'
  const offset = 0
  const limit = 1
  const getUserEpisodeHistory = spy(() => Promise.resolve([]))

  // Act
  await getUserEpisodeHistoryPage(userId, offset, limit, getUserEpisodeHistory as any)

  // Assert
  expect(getUserEpisodeHistory.callCount).toBe(1)
  expect(getUserEpisodeHistory.args[0][0]).toBe('1')
})

test('Set hasNextPage to true', async () => {
  // Arrange
  const userId = '1'
  const offset = 0
  const limit = 1
  const getUserEpisodeHistory = spy(() => Promise.resolve([1, 1]))

  // Act
  const result = await getUserEpisodeHistoryPage(
    userId,
    offset,
    limit,
    getUserEpisodeHistory as any
  )

  // Assert
  expect(result.pageInfo.hasNextPage).toBe(true)
})

test('Set hasNextPage to false', async () => {
  // Arrange
  const userId = '1'
  const offset = 0
  const limit = 1
  const getUserEpisodeHistory = spy(() => Promise.resolve([1]))

  // Act
  const result = await getUserEpisodeHistoryPage(
    userId,
    offset,
    limit,
    getUserEpisodeHistory as any
  )

  // Assert
  expect(result.pageInfo.hasNextPage).toBe(false)
})

test('Pop the history when hasNextPage is true', async () => {
  // Arrange
  const userId = '1'
  const offset = 0
  const limit = 1
  const getUserEpisodeHistory = spy(() => Promise.resolve([1, 1]))

  // Act
  const result = await getUserEpisodeHistoryPage(
    userId,
    offset,
    limit,
    getUserEpisodeHistory as any
  )

  // Assert
  expect(result.episodes.length).toBe(1)
})

test('Do not pop the history when hasNextPage is false', async () => {
  // Arrange
  const userId = '1'
  const offset = 0
  const limit = 2
  const getUserEpisodeHistory = spy(() => Promise.resolve([1, 1]))

  // Act
  const result = await getUserEpisodeHistoryPage(
    userId,
    offset,
    limit,
    getUserEpisodeHistory as any
  )

  // Assert
  expect(result.episodes.length).toBe(2)
})

test('Select user episode history', () => {
  // Arrange
  const db = create()
  const userId = '1'
  const offset = 1
  const limit = 2

  // Act
  getGetUserEpisodeHistory(db)(userId, offset, limit)

  // Assert
  expect(db.__execution_log__).toMatchSnapshot()
})
