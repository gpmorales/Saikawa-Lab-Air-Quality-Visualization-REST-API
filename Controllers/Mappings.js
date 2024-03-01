// RESTful Controller
const { GoogleCloudSQLInstance } = require("../Cloud-SQL/Connection");

const DB_USER = process.env.db_password || undefined;
const BIAS_CORRECTED_HOURLY_DB = "bias_corrected_hourly";
const BIAS_CORRECTED_DAILY_DB = "bias_corrected_daily";
const RAW_DB = "raw";


const FORMAT_TYPE = {
  DAILY : ["daily", "DAILY", "Daily"],
  HOURLY : ["hourly", "HOURLY", "Hourly"]
};


const PARTICLE_TPYE= {
  PM10: ["pm10", "PM10"],
  PM25 : ["pm25", "PM25"]
};



// TBD 
async function getRawAQ(request, response) {
  try {

    const { database, closeSQLConnection } = await GoogleCloudSQLInstance(undefined, db_password);

    // Extract query parameters
    const sensorId = request.query.sensorId;
    const timeFormat = request.query.timeFormat;
    const particleSize = request.query.particleSize
    const startDate = request.query.startDate;
    const endDate = request.query.endDate;

    // ['pm1', 'pm10', 'pm25', 'sn', 'timestamp', 'timestamp_local', 'url', 'geo.lat', 'geo.lon', 'met.rh', 'met.temp', 'model.pm.pm1', 'model.pm.pm10', 'model.pm.pm25'
    const table = RAW_DB.concat(".").concat(sensorId);
    let result;
    
    // Create QUERY from parameters
    if (FORMAT_TYPE.DAILY.includes(timeFormat)) { // TBD : If DAILY CHOOSE?????
      result = await database(table).select("*") .where('day', '>=', startDate).andWhere('day', '<=', endDate);
    } 

    else if (FORMAT_TYPE.HOURLY.includes(timeFormat)) { // TBD : DAILY FORMAT MUST be "YYYY-MM-DD HH:MM:SS" (WORKS!)
    }

    else {
      return response.status(500).json({ msg : "Invalid format type for AQ data, can only be Hourly or Daily" });
    }


    await closeSQLConnection();

    response.status(200).json(result);

  } catch (err) {
    response.status(500).json({ msg: err });
  }
}




// TODO ---> WORKS (for PM25 Daily OR PM25 Hourly DATA)
async function getCorrectedAQ(request, response) {
  try {

    const { database, closeSQLConnection } = await GoogleCloudSQLInstance(undefined, db_password);

    // Extract query parameters
    const sensorId = request.query.sensorId;
    const timeFormat = request.query.timeFormat;
    const startDate = request.query.startDate;
    const endDate = request.query.endDate;

    let table;
    let queryResult;

    // Create QUERY from parameters
    if (FORMAT_TYPE.DAILY.includes(timeFormat)) {
      table = BIAS_CORRECTED_DAILY_DB.concat(".").concat(sensorId);
      result = await database(table).select("*") .where('day', '>=', startDate).andWhere('day', '<=', endDate);
    } 

    else if (FORMAT_TYPE.HOURLY.includes(timeFormat)) {
      table = BIAS_CORRECTED_HOURLY_DB.concat(".").concat(sensorId);
      result = await database(table).select("*").where("dayhour", ">=", startDate).andWhere("dayhour", "<=", endDate);
    }

    else {
      return response.status(500).json({ msg : "Invalid format type for AQ data, can only be Hourly or Daily" });
    }

    await closeSQLConnection();

    response.status(200).json(result);

  } catch (err) {
    response.status(500).json({ msg: err });
  }
}



//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


// TBD
async function appendRawAQ(request, response) {
  try {

    console.log("Appending raw air quality data...\n");

    const iamUser = request.headers["db_password"];

    const { database, closeSQLConnection } = await GoogleCloudSQLInstance(RAW_DB, iamUser);

    // pull table name from request
    const sensorId = request.body.sensorId

    const table = RAW_DB.concat(".").concat(sensorId);

    const tableExists = await database.schema.hasTable(sensorId);


    if (!tableExists) {

      console.log("Table doesnt exist")
      
      // TBD SCHEMA
      
      // ['pm1', 'pm10', 'pm25', 'sn', 'timestamp', 'timestamp_local', 'url', 'geo.lat', 'geo.lon', 'met.rh', 'met.temp', 'model.pm.pm1', 'model.pm.pm10', 'model.pm.pm25'

      await database.schema.createTable(table, table => {
        table.timestamp("date").defaultTo(database.fn.now())
        table.string("pm10");
        table.string("pm25");
        table.double("humdity");
        table.double("temperature");
      });
    }



    // Insert new data and close db connection
    await database(table).insert(request.body);

    await closeSQLConnection();

    response.status(200).json("Added new data to " + table);

  } catch (err) {
    console.log(err)
    response.status(500).json({ msg: err });
  }
}





// TODO ---> WORKS (for PM25 Daily OR PM25 Hourly DATA)
async function appendCorrectedAQ(request, response) {
  try {

    console.log("Appending bias-corrected air quality data... \n");

    // Pull parameters from request
    const sensorId = request.query.sensorId;
    const timeFormat = request.query.timeFormat;

    let DB_NAME;

    if (FORMAT_TYPE.DAILY.includes(timeFormat)) {
      DB_NAME = BIAS_CORRECTED_DAILY_DB;
    } else if (FORMAT_TYPE.HOURLY.includes(timeFormat)) {
      DB_NAME = BIAS_CORRECTED_HOURLY_DB;
    } else {
      return response.status(500).json({ msg : "Invalid format type for AQ data, can only be Hourly or Daily" });
    }

    const iamUser = request.headers["db_password"];

    const { database, closeSQLConnection } = await GoogleCloudSQLInstance(DB_NAME, iamUser);

    const table = DB_NAME.concat(".").concat(sensorId);

    const tableExists = await database.schema.hasTable(sensorId);

    if (!tableExists) {
      if (FORMAT_TYPE.DAILY.includes(timeFormat)) {
        await database.schema.createTable(table, table => {
          table.date("day").defaultTo('2000-01-01'); // YYYY-MM-DD
          table.double("corrected_PM25");
          // table.double("corrected_PM10"); // TBD
        });
      } else {
        await database.schema.createTable(table, table => {
          table.datetime("dayhour").defaultTo(database.fn.now()) // YYYY-MM-DD HH:MM:SS
          table.double("corrected_PM25");
          // table.double("corrected_PM10"); // TBD
        });
      }
    }


    // Insert new data and close db connection
    await database(table).insert(request.body);

    await closeSQLConnection();

    response.status(200).json("Added new data to " + table)

  } catch (err) {
    console.log(err)
    response.status(500).json({ msg: err });
  }
}





module.exports = { getRawAQ, getCorrectedAQ, appendRawAQ, appendCorrectedAQ };

