const { fetchEndpoints } = require("../models/api.model");

exports.getEndpoints = (req, res) => {
  const endpoints = fetchEndpoints();
  res.status(200).send({ endpoints });
};
