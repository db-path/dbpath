import { OracleEnv } from "./oracleEnv";
import { oracleDal } from "./oracleDal";
import { DalResult, DatabaseMetaData } from "@dbpath/dal";
import { sampleMeta } from "@dbpath/fixtures";
import { deepSort, ignoreError, ignoreErrorK } from "@dbpath/utils";

const inCi = process.env[ 'CI' ] === 'true'

const env: OracleEnv = { type: 'postgres', username: "phil", password: "phil", connection: "localhost/xepdb1", schema: 'PHIL' };


describe ( 'oracleDal', () => {
  it ( "should create tables, insert to the them and read from them", async () => {
    if ( inCi ) return
    const dal = await oracleDal ( env );
    console.log ( 3 )
    try {
      await ignoreErrorK ( async () => await dal.update ( "drop table drivertable cascade CONSTRAINTS " ) )
      console.log ( 4 )
      await ignoreErrorK ( async () => await dal.update ( "drop table mission cascade CONSTRAINTS " ) )
      await ignoreErrorK ( async () => await dal.update ( "drop table  driver_aud cascade CONSTRAINTS " ) )
      await ignoreErrorK ( async () => await dal.update ( "drop table  mission_aud cascade CONSTRAINTS " ) )
      console.log ( 5 )

      await dal.update ( "create table drivertable (driverId int, name varchar(255))" )
      console.log ( 6 )
      await dal.update ( "create table  mission (id int, driverId int, mission varchar(255))" )
      await dal.update ( "create table  driver_aud (id int,who varchar(255), what varchar(255))" )
      await dal.update ( "create table  mission_aud (id int, who varchar(255), what varchar(255))" )
      await dal.update ( `alter table drivertable
          add primary key (driverId)` );
      await dal.update ( `alter table mission
          add primary key (id)` );
      await dal.update ( `ALTER TABLE mission
          ADD CONSTRAINT fk_mission_driver FOREIGN KEY (driverId) REFERENCES drivertable (driverId)` );
      await dal.update ( `ALTER TABLE driver_aud
          ADD CONSTRAINT fk_driver_aud_driver FOREIGN KEY (id) REFERENCES drivertable (driverId)` );
      await dal.update ( `alter table mission_aud
          add constraint fk_mission_aud_mission foreign key (id) references mission (id)` );


      await dal.update ( "insert into drivertable (driverId, name) values (:1, :2)", 1, "phil" )
      await dal.update ( "insert into drivertable (driverId, name) values (:1, :2)", 2, "joe" )
      await dal.update ( "insert into mission (id, driverId, mission) values (:1, :2, :3)", 1, 1, "m1" )
      await dal.update ( "insert into mission (id, driverId, mission) values (:1, :2, :3)", 2, 2, "m2" )
      await dal.update ( "insert into driver_aud (id, who, what) values (:1, :2, :3)", 1, "phil", "insert1" )
      await dal.update ( "insert into driver_aud (id, who, what) values (:1, :2, :3)", 2, "phil", "insert2" )
      console.log('about to insert1')
      await dal.update ( "insert into mission_aud (id, who, what) values (:1, :2, :3)", 1, "phil", "insert" )
      console.log('about to select')

      const res: DalResult = await dal.query ( "select * from drivertable" )
      console.log('selected', res)
      expect ( res.rows ).toEqual ( [
        {
          "driverid": 1,
          "name": "phil"
        },
        {
          "driverid": 2,
          "name": "joe"
        }
      ] );
      expect ( res.meta ).toEqual ( {
        "columns": [
          { "name": "driverid" },
          { "name": "name" }
        ]
      } )
    } finally {
      dal.close ()
    }

  } )

  it ( "should extract metadata", async () => {
    if ( inCi ) return

    const dal = await oracleDal ( env );
    try {
      const res: DatabaseMetaData = await dal.metaData ();
      const actual=JSON.stringify(deepSort(res),null,2  )
        .replace(/number/g, 'integer')
        .replace(/varchar2/g, 'text')
      expect ( actual ).toEqual ( JSON.stringify(deepSort(sampleMeta),null,2) )
    } finally {
      dal.close ()
    }
  } )

} )