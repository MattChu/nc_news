const {
  selectArticles,
  selectArticleById,
  selectArticleComments,
  insertComment,
  updateArticleVotes,
} = require("../models/api.articles.model.js");

const getArticles = async (req, res) => {
  const articles = await selectArticles();
  res.status(200).send({ articles });
};

const getArticleById = async (req, res) => {
  const { article_id } = req.params;
  const article = await selectArticleById(article_id);
  res.status(200).send({ article });
};

const getArticleComments = async (req, res) => {
  const { article_id } = req.params;
  const article = await selectArticleById(article_id);
  const comments = await selectArticleComments(article);
  res.status(200).send({ comments });
};

const postComment = async (req, res) => {
  if (!req.body.username || !req.body.body) {
    const err = new Error("bad request: request body missing a necessary key");
    err.status = 400;
    throw err;
  }
  if (typeof req.body.body !== "string") {
    const err = new Error("bad request: req.body for postComment must be type string");
    err.status = 400;
    throw err;
  }
  const { article_id } = await selectArticleById(req.params.article_id);
  req.body.article_id = article_id;
  const postedComment = await insertComment(req.body);
  res.status(201).send({ postedComment });
};

const patchArticleVotes = async (req, res) => {
  if (!req.body.inc_votes) {
    const err = new Error("bad request: request body missing a necessary key");
    err.status = 400;
    throw err;
  }
  const { article_id } = await selectArticleById(req.params.article_id);
  req.body.article_id = article_id;
  const updatedArticle = await updateArticleVotes(req.body);
  res.status(201).send({ updatedArticle });
};

module.exports = { getArticles, getArticleById, getArticleComments, postComment, patchArticleVotes };
