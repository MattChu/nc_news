const {
  selectArticleComments,
  insertComment,
  removeCommentFromDB,
  updateCommentVotes,
} = require("../models/api.comments.model.js");
const { selectArticleById } = require("../models/api.articles.model.js");

exports.getArticleComments = async (req, res) => {
  const { article_id } = req.params;
  const article = await selectArticleById(article_id);
  const comments = await selectArticleComments(article);
  res.status(200).send({ comments });
};

exports.postComment = async (req, res) => {
  const { article_id } = await selectArticleById(req.params.article_id);
  req.body.article_id = article_id;
  const postedComment = await insertComment(req.body);
  res.status(201).send({ postedComment });
};

exports.deleteComment = async (req, res) => {
  await removeCommentFromDB(req.params);
  res.status(204).send();
};

exports.patchCommentsVotes = async (req, res) => {
  req.body.comment_id = req.params.comment_id;
  const updatedComment = await updateCommentVotes(req.body);
  res.status(201).send({ updatedComment });
};
