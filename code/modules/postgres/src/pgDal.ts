import { Pool, PoolClient } from "pg";

import { CommonEnvironment, Dal, DalDialect, DalQueryFn, DalResult, DalUpdateFn } from "@dbpath/dal";
import { composeNameAndValidators, NameAndValidator, validateChildNumber, validateChildString, validateChildValue } from "@dbpath/utils";
import { pgMeta } from "./pgMeta";

export interface PostgresEnv extends CommonEnvironment {
  host: string,
  port: number
  database: string,
}
function postgresOpen ( env: PostgresEnv ): Pool {
  if ( env.type !== 'postgres' ) throw new Error ( "Not a postgres environment" )
  const client: Pool = new Pool ( {
    user: env.username,
    host: env.host,
    database: env.database,
    password: env.password,
    port: env.port,
  } )
  return client
}
function postgresClose ( client: Pool ): void {
  client.end ()
}
const postgresDalQuery = ( pool: Pool ): DalQueryFn => async ( sql, ...params: any[] ): Promise<DalResult> => {
  const client: PoolClient = await pool.connect ()
  try {
    var res = await client.query ( sql, params )
    return ({ meta: { columns: res.fields.map ( md => ({ name: md.name }) ) }, rows: res.rows });
  } finally {
    client.release ()
  }
}

const postgresDalUpdate = ( pool: Pool ): DalUpdateFn => async ( sql, ...params: any[] ): Promise<number> => {
  const client: PoolClient = await pool.connect ()
  try {
    var res = await client.query ( sql, params )
    return 1
  } finally {
    client.release ()
  }
}


export function postgresDal ( env: PostgresEnv ): Dal {
  const pool = postgresOpen ( env )
  return {
    query: postgresDalQuery ( pool ),
    update: postgresDalUpdate ( pool ),
    close: () => postgresClose ( pool ),
    metaData: pgMeta ( pool, 'public' )
  }
}

export const postgresEnvValidator: NameAndValidator<PostgresEnv> = composeNameAndValidators<PostgresEnv> (
  validateChildValue ( 'type', 'postgres' ),
  validateChildString ( 'username', true ),
  validateChildString ( 'password', true ),
  validateChildString ( 'schema' ),
  validateChildNumber ( 'port' ),
  validateChildString ( 'host' ),
  validateChildString ( 'database' )
)

export const postgresDalDialect: DalDialect = {
  limitFn: ( pageNum: number, pageSize: number, s: string[] ) => {
    const offset = (pageNum - 1) * pageSize
    return [ ...s, `LIMIT ${pageSize} OFFSET ${offset}` ]
  },
  safeQuery: 'SELECT 1'
}

