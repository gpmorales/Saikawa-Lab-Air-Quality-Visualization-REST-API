# Node.js REST API for Air Quality Data

This REST API is designed to retrieve and append air quality data from/to specific sensor tables within a Google Cloud SQL database. It's deployed on Google Cloud Run for scalable and serverless execution.

## Features

- Retrieve raw and bias-corrected air quality data.
- Append new raw and bias-corrected air quality data to the database.
- Automatic table creation for new sensor data.

## Prerequisites

- Node.js installed locally for development.
- Access to a Google Cloud SQL instance.
- A Google Cloud project and Google Cloud SDK set up for deployment.

## Running Locally

Run the application locally using:


## Deploying to Google Cloud Run

Build your container and push it to Google Container Registry or Google Artifact Registry. Deploy the container to Cloud Run:


Ensure the service account used by Cloud Run has necessary roles (Cloud SQL Client, optionally Cloud SQL Instance User for IAM authentication).

## API Endpoints

- **GET /raw-aq?sensorId={sensorId}**  
  Retrieves raw air quality data for a specified sensor.

- **POST /append-raw-aq**  
  Appends new raw air quality data. Request body should contain the data in JSON format.

- **GET /corrected-aq?sensorId={sensorId}**  
  Retrieves bias-corrected air quality data for a specified sensor.

- **POST /append-corrected-aq**  
  Appends new bias-corrected air quality data. Request body should contain the data in JSON format.
