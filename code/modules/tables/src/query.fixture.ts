import { Table } from "./tables";
import { NameAnd } from "@db-auto/utils";
import { CleanTable, createCleanTables } from "./clean";

let string;
export const tables: NameAnd<Table> = {
// export const tables = {
  "driver": {
    "table": "DriverTable",
    "primary": { "name": "id", "type": "integer" },
    "queries": {
      "name": { "type": "string", "description": "driver name " },
      "employeeNum": { "type": "string" }
    },
    "links": {
      "mission": { "type": "one-to-many", "idHereAndThere": "driverId" },
      "audit": { "type": "one-to-many", "idHereAndThere": "driverId" }
    },
    "dataColumns": {
      "livesIn": { "type": "string" },
      "age": { "type": "integer" },
      "dateOfBirth": { "type": "date" },
      "personalCar": {},
    },
    "views": {
      "all": "*",
      "short": [ "id", "name" ]
    }
  },
  "driver_aud": {
    "primary": { "name": "driverId", "type": "integer" },
    dataColumns: { "who": {}, "action": {}, "date": {} },
    "views": {
      "all": "*",
      "short": [ "driverId", "action", "date" ]
    }
  },
  "mission": {
    "primary": "id",
    "queries": { "date": { "type": "date" } },
    "links": {
      "driver": { "type": "many-to-one", "idHereAndThere": "driverId" },
      "mission_aud": { "type": "one-to-many", "idHereAndThere": "missionId" }
    },
    "views": {
      "all": "*",
      "short": [ "id", "driverId" ]
    }
  },
  "mission_aud": {
    "primary": { "name": "missionId", "type": "integer" },
    "views": {
      "all": "*",
      "short": [ "missionId", "action", "date" ]
    }
  }
}
export const clean: NameAnd<CleanTable> = createCleanTables ( tables )