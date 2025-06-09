const { insertReaction } = require("../models/api.reactions.model");
const { selectArticleById } = require("../models/api.articles.model");

const postReaction = async (req, res) => {
  const { article_id } = await selectArticleById(req.params.article_id);
  req.body.article_id = article_id;
  const postedReaction = await insertReaction(req.body);
  res.status(201).send({ postedReaction });
};

module.exports = { postReaction };
