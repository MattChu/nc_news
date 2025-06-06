const db = require("../db/connection.js");
const { errorIfValNotInColumn } = require("./utils.js");

exports.selectArticles = async ({ sort_by = "created_at", order = "DESC", topic }) => {
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
    err.status = 404;
    throw err;
  }

  order = validOrders.includes(order) ? order : "DESC";

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

exports.selectArticleById = async (article_id) => {
  const { rows: article } = await db.query(
    "SELECT author, title, article_id, body, topic, created_at, votes, article_img_url FROM articles WHERE article_id = $1;",
    [article_id]
  );
  if (!article.length) {
    const err = new Error("no article found with that ID");
    err.status = 404;
    throw err;
  }
  return article[0];
};

exports.selectArticleComments = async ({ article_id }) => {
  const { rows: comments } = await db.query(
    "SELECT comment_id, votes, created_at, author, body, article_id FROM comments WHERE article_id = $1;",
    [article_id]
  );
  if (!comments.length) {
    const err = new Error("no comments found for that article");
    err.status = 404;
    throw err;
  }
  return comments;
};

exports.insertComment = async ({ article_id, username, body }) => {
  const { rows: postedComment } = await db.query(
    "INSERT INTO comments (article_id, author, body) Values ( $1, $2, $3) RETURNING *;",
    [article_id, username, body]
  );
  return postedComment[0];
};

exports.updateArticleVotes = async ({ article_id, inc_votes }) => {
  const { rows: updatedArticle } = await db.query(
    "UPDATE articles SET votes = (votes + $1) WHERE article_id = $2 RETURNING *;",
    [inc_votes, article_id]
  );
  return updatedArticle[0];
};
