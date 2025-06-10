const db = require("../db/connection.js");
const { errorIfValNotInColumn } = require("./utils.js");

const selectArticles = async ({ sort_by = "created_at", order = "DESC", topic }) => {
  const validSorts = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];

  const validOrders = ["DESC", "ASC"];

  if (!validSorts.includes(sort_by)) {
    const err = new Error("sort_by val is invalid");
    err.status = 400;
    throw err;
  }

  order = validOrders.includes(order.toUpperCase()) ? order.toUpperCase() : "DESC";

  const queryParams = [];

  let queryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.comment_id) AS INT) AS comment_count FROM articles LEFT JOIN comments USING (article_id)`;

  if (topic) {
    await errorIfValNotInColumn("topics", "slug", topic);
    queryParams.push(topic);
    queryString += ` WHERE topic = $${queryParams.length}`;
  }

  queryString += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;

  const { rows: articles } = await db.query(queryString, queryParams);

  return articles;
};

const selectArticleById = async (article_id) => {
  const { rows: article } = await db.query(
    "SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.comment_id) AS INT) AS comment_count FROM articles LEFT JOIN comments USING (article_id) WHERE articles.article_id = $1 GROUP BY articles.article_id;",
    [article_id]
  );
  if (!article.length) {
    const err = new Error("no article found with that ID");
    err.status = 404;
    throw err;
  }
  return article[0];
};

const updateArticleVotes = async ({ article_id, inc_votes }) => {
  if (!inc_votes) {
    const err = new Error("bad request: request body missing a necessary key");
    err.status = 400;
    throw err;
  }
  const { rows: updatedArticle } = await db.query(
    "UPDATE articles SET votes = (votes + $1) WHERE article_id = $2 RETURNING *;",
    [inc_votes, article_id]
  );
  return updatedArticle[0];
};

const insertArticle = async ({
  author,
  title,
  body,
  topic,
  article_img_url = "https://en.wikipedia.org/wiki/Turnip#/media/File:Turnip_2622027.jpg",
}) => {
  if (!author || !title || !body || !topic) {
    const err = new Error("bad request: request body missing a necessary key");
    err.status = 400;
    throw err;
  }
  if (
    typeof author !== "string" ||
    typeof title !== "string" ||
    typeof body !== "string" ||
    typeof topic !== "string"
  ) {
    const err = new Error("bad request: author, title, body and topic for postArticle ,must be strings");
    err.status = 400;
    throw err;
  }
  const { rows } = await db.query(
    "INSERT INTO articles (author, title, body, topic, article_img_url) VALUES ($1,$2,$3,$4,$5) RETURNING *",
    [author, title, body, topic, article_img_url]
  );
  const article_id = rows[0].article_id;
  const { rows: postedArticle } = await db.query(
    `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, articles.body, CAST(COUNT(comments.comment_id) AS INT) AS comment_count FROM articles LEFT JOIN comments USING (article_id) WHERE article_id = $1 GROUP BY articles.article_id`,
    [article_id]
  );
  return postedArticle[0];
};

const removeArticleFromDB = async ({ article_id }) => {
  const { rows: articleToDelete } = await db.query("SELECT * FROM articles WHERE article_id = $1;", [article_id]);
  if (!articleToDelete.length) {
    const err = new Error("no article found with that ID");
    err.status = 404;
    throw err;
  }
  await db.query("DELETE FROM articles WHERE article_id = $1", [article_id]);
};

module.exports = { selectArticles, selectArticleById, updateArticleVotes, insertArticle, removeArticleFromDB };
