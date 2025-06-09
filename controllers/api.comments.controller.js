const {
  selectArticleComments,
  insertComment,
  removeCommentFromDB,
  updateCommentVotes,
} = require("../models/api.comments.model.js");
const { selectArticleById } = require("../models/api.articles.model.js");

const getArticleComments = async (req, res) => {
  const { article_id } = req.params;
  const article = await selectArticleById(article_id);
  const comments = await selectArticleComments(article);
  res.status(200).send({ comments });
};

const postComment = async (req, res) => {
  const { article_id } = await selectArticleById(req.params.article_id);
  req.body.article_id = article_id;
  const postedComment = await insertComment(req.body);
  res.status(201).send({ postedComment });
};

const deleteComment = async (req, res) => {
  await removeCommentFromDB(req.params);
  res.status(204).send();
};

const patchCommentsVotes = async (req, res) => {
  req.body.comment_id = req.params.comment_id;
  const updatedComment = await updateCommentVotes(req.body);
  res.status(201).send({ updatedComment });
};

module.exports = { getArticleComments, postComment, deleteComment, patchCommentsVotes };
