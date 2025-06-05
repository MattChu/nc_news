const express = require("express");
const { getEndpoints } = require("./controllers/api.controller.js");
const { getTopics } = require("./controllers/api.topics.controller.js");
const { getUsers } = require("./controllers/api.users.controller.js");
const { deleteComment } = require("./controllers/api.comments.controller.js");
const {
  getArticles,
  getArticleById,
  getArticleComments,
  postComment,
  patchArticleVotes,
} = require("./controllers/api.articles.controller.js");

const { HandlePostgresErrors, HandleCustomErrors, HandleServerErrors } = require("./errors/errorHandling.js");

const app = express();

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/users", getUsers);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticleVotes);

app.delete("/api/comments/:comment_id", deleteComment);

app.use(HandlePostgresErrors);

app.use(HandleCustomErrors);

module.exports = app;
