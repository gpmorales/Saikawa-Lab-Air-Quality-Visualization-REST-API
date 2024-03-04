// Handles all our Routing and the task
const express = require("express");
const Router = express.Router();


const { getRawAQ, appendRawAQ, getCorrectedAQ, appendCorrectedAQ } = require("../Controllers/Mappings");


// NOTE router is a middleware that allows you to define routes for your application
// It allows you to define different routes for different HTTP methods (such as GET, POST, etc.) and handle them separately
// The router can also handle URL parameters, query strings, and other request details, and then pass them to the appropriate route handler


/**
 * @swagger
 * /raw-aq:
 *   get:
 *     summary: Retrieve raw air quality data
 *     description: Fetch raw air quality data for a specific sensor within a date range.
 *     parameters:
 *       - in: query
 *         name: sensorId
 *         required: true
 *         schema:
 *           type: string
 *         description: The sensor ID to fetch data for
 *       - in: query
 *         name: particleSize
 *         required: true
 *         schema:
 *           type: string
 *         description: The particle size to filter by (PM1, PM10, PM25)
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date of the data range
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date of the data range
 *     responses:
 *       200:
 *         description: A JSON array of raw air quality data
 *       500:
 *         description: Error message
 */
Router.route("/raw-aq").get(getRawAQ); 




/**
 * @swagger
 * /raw-aq:
 *   post:
 *     summary: Insert raw air quality data
 *     description: Append new raw air quality data for a specific sensor.
 *     parameters:
 *       - in: query
 *         name: sensorId
 *         required: true
 *         schema:
 *           type: string
 *         description: The sensor ID to append data for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               datetime:
 *                 type: string
 *                 format: date-time
 *                 description: Timestamp of the data point
 *               pm1:
 *                 type: number
 *                 description: PM1 measurement
 *               pm10:
 *                 type: number
 *                 description: PM10 measurement
 *               pm25:
 *                 type: number
 *                 description: PM25 measurement
 *     responses:
 *       200:
 *         description: Success message
 *       500:
 *         description: Error message
 */
Router.route("/raw-aq").post(appendRawAQ); 




/**
 * @swagger
 * /corrected-aq:
 *   get:
 *     summary: Retrieve corrected air quality data
 *     description: Fetch corrected air quality data for a specific sensor within a date range.
 *     parameters:
 *       - in: query
 *         name: sensorId
 *         required: true
 *         schema:
 *           type: string
 *         description: The sensor ID to fetch data for
 *       - in: query
 *         name: timeFormat
 *         required: true
 *         schema:
 *           type: string
 *         description: The time format to filter by (Daily or Hourly)
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date of the data range
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date of the data range
 *     responses:
 *       200:
 *         description: A JSON array of corrected air quality data
 *       500:
 *         description: Error message
 */
Router.route("/corrected-aq").get(getCorrectedAQ);



/**
 * @swagger
 * /corrected-aq:
 *   post:
 *     summary: Insert corrected air quality data
 *     description: Append new corrected air quality data for a specific sensor.
 *     parameters:
 *       - in: query
 *         name: sensorId
 *         required: true
 *         schema:
 *           type: string
 *         description: The sensor ID to append data for
 *       - in: query
 *         name: timeFormat
 *         required: true
 *         schema:
 *           type: string
 *         description: The format of the data being inserted (Daily or Hourly)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 corrected_PM25:
 *                   type: number
 *                   description: Corrected PM2.5 measurement
 *                 corrected_PM10:
 *                   type: number
 *                   description: Corrected PM10 measurement (if applicable)
 *               oneOf:
 *                 - properties:
 *                     day:
 *                       type: string
 *                       format: date
 *                       description: Date of the data point (for daily data)
 *                   required: ["day"]
 *                 - properties:
 *                     dayhour:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp of the data point (for hourly data)
 *                   required: ["dayhour"]
 *     responses:
 *       200:
 *         description: Success message
 *       500:
 *         description: Error message
 */
Router.route("/corrected-aq").post(appendCorrectedAQ); 



module.exports = Router;
