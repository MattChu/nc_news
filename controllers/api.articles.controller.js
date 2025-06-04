const {
  fetchArticles,
  fetchArticleById,
  fetchArticleComments,
  insertComment,
  updateArticleVotes,
} = require("../models/api.articles.model.js");

exports.getArticles = async (req, res) => {
  const articles = await fetchArticles();
  res.status(200).send({ articles });
};

exports.getArticleById = async (req, res) => {
  const { article_id } = req.params;
  const article = await fetchArticleById(article_id);
  res.status(200).send({ article });
};

exports.getArticleComments = async (req, res) => {
  const { article_id } = req.params;
  const comments = await fetchArticleComments(article_id);
  res.status(200).send({ comments });
};

exports.postComment = async (req, res) => {
  req.body.article_id = req.params.article_id;
  const postedComment = await insertComment(req.body);
  res.status(201).send({ postedComment });
};

exports.patchArticleVotes = async (req, res) => {
  req.body.article_id = req.params.article_id;
  const updatedArticle = await updateArticleVotes(req.body);
  res.status(201).send({ updatedArticle });
};
