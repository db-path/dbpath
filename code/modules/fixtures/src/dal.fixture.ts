export const sampleMeta = {
  "tables": {
    "driver_aud": {
      "columns": {
        "id": {
          "type": "integer"
        },
        "what": {
          "type": "text"
        },
        "who": {
          "type": "text"
        }
      },
      pk: [],
      "fk": {
        "fk_driver_aud_driver": {
          "column": "id",
          "raw": "FOREIGN KEY (id) REFERENCES drivertable(driverid)",
          "refColumn": "driverid",
          "refTable": "drivertable"
        }
      }
    },
    "drivertable": {
      "columns": {
        "driverid": {
          "type": "integer"
        },
        "name": {
          "type": "text"
        }
      },
      pk: [ { name: "driverid", type: "integer" } ],
      "fk": {
        "fk_driver_aud_driver": {
          "column": "driverid",
          "raw": "FOREIGN KEY (id) REFERENCES drivertable(driverid) reversed",
          "refColumn": "id",
          "refTable": "driver_aud"
        },
        "fk_mission_driver": {
          "column": "driverid",
          "raw": "FOREIGN KEY (driverid) REFERENCES drivertable(driverid) reversed",
          "refColumn": "driverid",
          "refTable": "mission"
        }
      }
    },
    "mission": {
      pk: [ { name: "id", type: "integer" } ],
      "columns": {
        "driverid": {
          "type": "integer"
        },
        "id": {
          "type": "integer"
        },
        "mission": {
          "type": "text"
        }
      },
      "fk": {
        "fk_mission_aud_mission": {
          "column": "id",
          "raw": "FOREIGN KEY (id) REFERENCES mission(id) reversed",
          "refColumn": "id",
          "refTable": "mission_aud"
        },
        "fk_mission_driver": {
          "column": "driverid",
          "raw": "FOREIGN KEY (driverid) REFERENCES drivertable(driverid)",
          "refColumn": "driverid",
          "refTable": "drivertable"
        }
      }
    },
    "mission_aud": {
      pk: [],
      "columns": {
        "id": {
          "type": "integer"
        },
        "what": {
          "type": "text"
        },
        "who": {
          "type": "text"
        }
      },
      "fk": {
        "fk_mission_aud_mission": {
          "column": "id",
          "raw": "FOREIGN KEY (id) REFERENCES mission(id)",
          "refColumn": "id",
          "refTable": "mission"
        }
      }
    }
  }
};
