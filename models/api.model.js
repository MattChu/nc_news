const db = require("../db/connection.js");
const endpoints = require("../endpoints.json");

exports.fetchEndpoints = () => {
  return endpoints;
};
