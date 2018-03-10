import * as Knex from 'knex'
import { config } from './config'

let knex: Knex | undefined = undefined

export function connect(): Knex {
  if (knex === undefined) {
    knex = Knex(config.db)
  }
  return knex
}
