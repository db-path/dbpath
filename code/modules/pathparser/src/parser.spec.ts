import { sampleMeta } from "@dbpath/dal";
import { EnvSummary, findAllFieldsNames, findFieldNameFromSquareBrackets, findTableName, findTablePartAndFieldPart, parsePath, tableParser } from "./parser";
import { hasErrors } from "@dbpath/utils";

const summary: EnvSummary = {
  tables: {
    driver: { tableName: 'drivertable' }
  }
}
describe ( "pathParser", () => {

  describe ( "findTableName", () => {
    it ( "should return name (found from summary if needed) or error", () => {
      const parse = findTableName ( sampleMeta, summary );
      expect ( parse ( "driver" ) ).toEqual ( "drivertable" )
      expect ( parse ( "mission" ) ).toEqual ( "mission" )
      expect ( parse ( "notIn" ) ).toEqual ( [ "Table notIn not found. Legal names are driver_aud,drivertable,mission,mission_aud" ] )
    } )
  } )
  describe ( "findTablePartAndFieldPart", () => {
    it ( "should find findTablePartAndFieldPart", () => {
      expect ( findTablePartAndFieldPart ( "driver[a,b,c]" ) ).toEqual ( { table: "driver", fields: "a,b,c" } )
      expect ( findTablePartAndFieldPart ( "driver" ) ).toEqual ( { table: "driver", fields: undefined } )
    } )
  } )
  describe ( "fields", () => {
    it ( "findAllFieldsNames", () => {
      expect ( findAllFieldsNames ( sampleMeta ) ( "drivertable" ) ).toEqual ( [ "driverid", "name" ] )
      expect ( findAllFieldsNames ( sampleMeta ) ( "mission" ) ).toEqual ( [ "driverid", "id", "mission" ] )
    } )

    it ( "findFieldNameFromSquareBrackets", () => {
      expect ( findFieldNameFromSquareBrackets ( sampleMeta, summary ) ( "drivertable" ) ( "driverid,name" ) ).toEqual ( { fields: [ "driverid", "name" ] } )
      expect ( () => findFieldNameFromSquareBrackets ( sampleMeta, summary ) ( "notin" ) ( "driverid,name" ) ).toThrow ( 'FindFieldName: Table notin not found in meta' )
    } )
  } )

  describe ( "tableParser", () => {
    it ( "should part a simple path", () => {
      expect ( tableParser ( sampleMeta, summary ) ( "driver" ) ).toEqual ( {
        "fields": [ "driverid", "name" ],
        "fullTable": "drivertable",
        "table": "driver"
      } )
      expect ( tableParser ( sampleMeta, summary ) ( "mission" ) ).toEqual ( {
        "fields": [ "driverid", "id", "mission" ],
        "fullTable": "mission",
        "table": "mission"
      } )
    } )
    it ( "should parse a path with fields", () => {
      expect ( tableParser ( sampleMeta, summary ) ( "driver[name]" ) ).toEqual ( {
        "fields": [ "name" ],
        "fullTable": "drivertable",
        "table": "driver"
      } )
    } )
    it ( "should parse a path with fields and !table", () => {
      expect ( tableParser ( sampleMeta, summary ) ( "driver!drivertable[name]" ) ).toEqual ( {
        "fields": [ "name" ],
        "fullTable": "drivertable",
        "table": "driver"
      } )
    } )
    it ( "should only parse a path with fields and !table if legal table", () => {
      expect ( tableParser ( sampleMeta, summary ) ( "driver!notlegal[name]" ) ).toEqual ( {} )
    } )
    it ( "should only parse a path with fields and !table if legal summary", () => {
      expect ( tableParser ( sampleMeta, summary ) ( "d!drivertable[name]" ) ).toEqual ( {} )
    } )
  } )
} )