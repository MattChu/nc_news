const {
  selectArticles,
  selectArticleById,
  updateArticleVotes,
  insertArticle,
} = require("../models/api.articles.model.js");

const getArticles = async (req, res) => {
  const articles = await selectArticles(req.query);
  res.status(200).send({ articles });
};

const getArticleById = async (req, res) => {
  const { article_id } = req.params;
  const article = await selectArticleById(article_id);
  res.status(200).send({ article });
};

const patchArticleVotes = async (req, res) => {
  const { article_id } = await selectArticleById(req.params.article_id);
  req.body.article_id = article_id;
  const updatedArticle = await updateArticleVotes(req.body);
  res.status(201).send({ updatedArticle });
};

const postArticle = async (req, res) => {
  const postedArticle = await insertArticle(req.body);
  res.status(201).send({ postedArticle });
};

module.exports = { getArticles, getArticleById, patchArticleVotes, postArticle };
