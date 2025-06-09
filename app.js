const express = require("express");
const { getEndpoints } = require("./controllers/api.controller.js");
const { getTopics, postTopic } = require("./controllers/api.topics.controller.js");
const { getUsers, getUserById } = require("./controllers/api.users.controller.js");
const {
  getArticleComments,
  postComment,
  deleteComment,
  patchCommentsVotes,
} = require("./controllers/api.comments.controller.js");
const {
  getArticles,
  getArticleById,
  patchArticleVotes,
  postArticle,
  deleteArticle,
} = require("./controllers/api.articles.controller.js");
const { postReaction } = require("./controllers/api.reactions.controller.js");

const { HandlePostgresErrors, HandleCustomErrors, HandleServerErrors } = require("./errors/errorHandling.js");

const app = express();

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/users", getUsers);

app.get("/api/users/:username", getUserById);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticleVotes);

app.post("/api/articles/", postArticle);

app.delete("/api/comments/:comment_id", deleteComment);

app.patch("/api/comments/:comment_id", patchCommentsVotes);

app.post("/api/topics", postTopic);

app.delete("/api/articles/:article_id", deleteArticle);

app.post("/api/articles/:article_id/reactions", postReaction);

app.use(HandlePostgresErrors);

app.use(HandleCustomErrors);

module.exports = app;
