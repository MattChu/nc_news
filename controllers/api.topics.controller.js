const { fetchTopics, insertTopic } = require("../models/api.topics.model.js");

exports.getTopics = async (req, res) => {
  const topics = await fetchTopics();
  res.status(200).send({ topics });
};

exports.postTopic = async (req, res) => {
  const topic = await insertTopic(req.body);
  res.status(201).send({ topic });
};
