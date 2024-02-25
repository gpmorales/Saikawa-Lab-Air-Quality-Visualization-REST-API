// RESTful Controller
const { GoogleCloudSQLInstance } = require("../Cloud-SQL/Connection");

const BIAS_CORRECTED_DB = "bias_corrected";
const RAW_DB = "raw";



// TODO
async function getRawAQ(request, response) {
  try {

    const { database, closeSQLConnection } = await GoogleCloudSQLInstance();

    const sensorId = request.query.sensorId;
    console.log(sensorId);

    const table = RAW_DB.concat(".").concat(sensorId);

    const result = await database(table).select("*");
      //.where('id', '>', 0)
      //.andWhere('id', '<', 10);

    await closeSQLConnection();

    response.status(200).json(result);

  } catch (err) {
    response.status(500).json({ msg: err });
  }
}




// TODO
async function getCorrectedAQ(request, response) {
  try {

    const { database, closeSQLConnection } = await GoogleCloudSQLInstance();

    // TODO - pull from request
    const sensorId = request.query.sensorId;

    const table = BIAS_CORRECTED_DB.concat(".").concat(sensorId);

    const result = await database(table).select("*");
      //.where('id', '>', 0)
      //.andWhere('id', '<', 10);

    await closeSQLConnection();

    response.status(200).json(result);

  } catch (err) {
    response.status(500).json({ msg: err });
  }
}



//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


// TODO
async function appendRawAQ(request, response) {
  try {

    console.log("Appending raw air quality data...\n");

    const { database, closeSQLConnection } = await GoogleCloudSQLInstance(RAW_DB);

    // pull table name from request
    const sensorId = request.query.sensorId
    const table = RAW_DB.concat(".").concat(sensorId);

    const tableExists = await database.schema.hasTable(sensorId);

    if (!tableExists) {
      console.log("Table doesnt exist")

      await database.schema.createTable(table, table => {
        table.timestamp("date").defaultTo(database.fn.now())
        table.string("pm10");
        table.string("pm25");
        table.double("humdity");
        table.double("temperature");
      });
    }



    // TODO CLEAN / PARSE csv data here
    const sampleData = request.body;



    // Insert new data and close db connection
    await database(table).insert(sampleData);

    await closeSQLConnection();

    response.status(200).json("Added new data to " + table);

  } catch (err) {
    console.log(err)
    response.status(500).json({ msg: err });
  }
}





// TODO
async function appendCorrectedAQ(request, response) {
  try {

    console.log("Appending bias-corrected air quality data... \n");

    const { database, closeSQLConnection } = await GoogleCloudSQLInstance(BIAS_CORRECTED_DB);

    // pull table name from request
    const sensorId = request.query.sensorId
    const table = BIAS_CORRECTED_DB.concat(".").concat(sensorId);

    const tableExists = await database.schema.hasTable(sensorId);

    if (!tableExists) {
      console.log("Table doesnt exist")

      await database.schema.createTable(table, table => {
        table.timestamp("date").defaultTo(database.fn.now())
        table.string("pm10");
        table.string("pm25");
        table.double("humdity");
        table.double("temperature");
      });
    }



    // TODO CLEAN / PARSE csv data here
    const sampleData = request.body;



    // Insert new data and close db connection
    await database(table).insert(sampleData);

    await closeSQLConnection();

    response.status(200).json("Added new data to " + table)

  } catch (err) {
    console.log(err)
    response.status(500).json({ msg: err });
  }
}





module.exports = { getRawAQ, getCorrectedAQ, appendRawAQ, appendCorrectedAQ };
