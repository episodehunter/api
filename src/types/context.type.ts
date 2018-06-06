import * as Knex from 'knex'

export type Context = {
  db: Knex
  userId: string | null
}

export type Db = Knex
export type DbTransaction = Knex.Transaction
