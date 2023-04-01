import { findDirectoryHoldingFileOrError } from "@dbpath/files";
import { dbPathDir } from "@dbpath/environments";
import { mapErrors } from "@dbpath/utils";
import fs from "fs";
import { configFileName } from "./cli";
import Path from "path";

export const defaultConfig = {
  "comment": {
    passwords: [ "should not be stored here. You can specify them if you have to, but it's better to use environment variables.",
      "    use  DBPATH_<environment name>_PASSWORD" ],
    "summary": [
      "dbpath admin init",
      "... edit this config file              -- to tell dbpath about how to connect to your databases",
      "dbpath admin env <environment name>    -- this will tell dbpath which environment to use (defaults to dev)",
      "dbpath metadata refresh                -- this will go to the database, read the metadata and store it",
      "  ... and you are good to go!"
    ]
  },
  "environments": {
    "samplepostgressThatWontWorkForYou-edit the config file .dbpath\dbpath.config.json": {
      "type": "postgres", "host": "localhost", "port": 5432, "database": "postgres", "schema": "public",
      "username": "phil", password: "you can set them here but it's better to use environment variables"
    },
    "sampleoracleThatWontWorkForYou-edit the config file .dbpath\dbpath.config.json": {
      "type": "oracle", "connection": "localhost/xepdb1", "schema": "PHIL", "username": "phil"
    }
  },
  "summary": {
    "comment": "You can give short or meaningful names to tables and views here",
    "tables": {
      "sampleShortName": { "tableName": "Put here the full name" }
    }
  }
}

export function initConfig ( cwd: string ) {
  let filename = Path.join ( dbPathDir, configFileName );
  fs.mkdirSync ( dbPathDir, { recursive: true } )
  fs.writeFileSync ( filename, JSON.stringify ( defaultConfig, null, 2 ) )
  return filename
}