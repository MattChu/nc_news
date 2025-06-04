const { fetchTopics } = require("../models/api.topics.model.js");

exports.getTopics = getTopics = async (req, res) => {
  const topics = await fetchTopics();
  res.status(200).send({ topics });
};
