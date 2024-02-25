// Handles all our Routing and the task
const express = require("express");
const Router = express.Router();


const { getRawAQ, appendRawAQ, getCorrectedAQ, appendCorrectedAQ } = require("../Controllers/Mappings");


// NOTE router is a middleware that allows you to define routes for your application
// It allows you to define different routes for different HTTP methods (such as GET, POST, etc.) and handle them separately
// The router can also handle URL parameters, query strings, and other request details, and then pass them to the appropriate route handler

//Setup Routes
Router.route("/raw-aq").get(getRawAQ); // Router calls the getRawAQ() when a GET request is received for raw air quality data from Date A to Date B
Router.route("/raw-aq").post(appendRawAQ); // Router calls the insertRawAQ() when a POST request is received to insert raw air quality data
Router.route("/corrected-aq").get(getCorrectedAQ); // Router calls the getProcessedAQ() when a GET request is received for processed air quality data from Date A to Date B
Router.route("/corrected-aq").post(appendCorrectedAQ); // Router calls the insertProcessedAQ() when a POST request is received to insert processed air quality

module.exports = Router;
