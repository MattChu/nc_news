const articlesRouter = require("express").Router();

const {
  getArticles,
  getArticleById,
  patchArticleVotes,
  postArticle,
  deleteArticle,
} = require("../controllers/api.articles.controller");
const { getArticleComments, postComment } = require("../controllers/api.comments.controller");
const { postReaction } = require("../controllers/api.reactions.controller");

articlesRouter.route("/").get(getArticles).post(postArticle);

articlesRouter.route("/:article_id").get(getArticleById).patch(patchArticleVotes).delete(deleteArticle);

articlesRouter.route("/:article_id/comments").get(getArticleComments).post(postComment);

articlesRouter.route("/:article_id/reactions").post(postReaction);

module.exports = articlesRouter;
