import * as Knex from 'knex'

export type Context = {
  db: Knex
}

export type Db = Knex
export type DbTransaction = Knex.Transaction
