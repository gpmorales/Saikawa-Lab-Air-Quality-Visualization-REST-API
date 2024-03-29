const MySql = require("mysql2/promise");
const express = require("express");
const Router = require("./Routes/Router");
const application = express();

const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const PORT = process.env.PORT || 3000;

// Swagger setup
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Saikawa Labs Air Quality Visualization API",
      version: "1.0.0",
      description:
        "An Express-based REST API that fetches and pushes airq quality data to a Google Cloud SQL instance",
    },
    servers: [
      {
        url: "/api/v1",
        description: "Development Server",
      },
    ],
  },
  apis: ["./Controllers/API.js", "./Routes/Router.js"], // Path to the API docs
};

const swaggerSpec = swaggerJsDoc(options);

// REST endpoints can ingest json bodies
application.use(express.json());
// Base URI and Router to map endpoints is init here
application.use("/api/v1", Router);
// Serve Swagger documentation
application.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
