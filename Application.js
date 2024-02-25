const MySql = require("mysql2/promise");
const express = require("express");
const Router = require("./Routes/Router")
const application = express();

const PORT = process.env.PORT || 3000;

// REST endpoints can ingest json bodies
application.use(express.json())

// Base URI and Router to map endpoints is init here
application.use("/api/v1", Router);



// Starts application
function StartServer() {
  try {

    application.listen(PORT, () => {
      console.log("Listening to Port " + PORT + " ...\n");
    });

  } catch (err) {
    console.log(err);
  }

}


StartServer();
