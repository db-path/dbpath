import { ErrorsAnd, mapErrors, NameAnd } from "@db-auto/utils";
import { Link, Table } from "./tables";

export interface DbAutoQuery {
  path: string[],
  params: NameAnd<string>
}

export interface Plan {

  table: Table,
  planLink?: PlanLink

}
export interface PlanLink {
  link: Link,
  linkTo: Plan,
}

export function buildPlan ( tables: NameAnd<Table>, path: string[] ): ErrorsAnd<Plan | undefined> {
  if ( path.length === 0 ) return [ 'Cannot build plan for empty path' ]
  let table = tables[ path[ 0 ] ];
  let planLinkOrErrors = buildNextStep ( tables, path, table, 1 );
  return mapErrors ( planLinkOrErrors, planLink => ({ table, planLink }) )

}
function buildNextStep ( tables: NameAnd<Table>, path: string[], table: Table, index: number ): ErrorsAnd<PlanLink | undefined> {
  if ( index >= path.length ) return undefined;
  const p = path[ index ];
  const link: Link = table.links[ p ];
  if ( link === undefined ) return [ `Cannot find link ${p} in table ${table.table}. Full path is ${path}.  Available links are: ${Object.keys ( table.links )}` ];
  const nextTable = tables[ p ]
  if ( nextTable === undefined ) return [ `Cannot find table ${p} in tables. Path is ${path.slice ( 0, index )}. Available tables are: ${Object.keys ( tables )}` ];
  let nextPlanLinkOrErrors = buildNextStep ( tables, path, nextTable, index + 1 );
  return mapErrors ( nextPlanLinkOrErrors, planLink => ({ link, linkTo: { planLink, table: nextTable } }) );
}