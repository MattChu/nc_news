const db = require("../db/connection.js");

exports.fetchArticles = async () => {
  const { rows: articles } = await db.query(
    "SELECT articles.author, articles.title, article_id, topic, articles.created_at, articles.votes, article_img_url, CAST(COUNT(comments) AS INT) AS comment_count FROM articles LEFT JOIN comments USING (article_id) GROUP BY article_id ORDER BY articles.created_at DESC;"
  );
  return articles;
};

exports.fetchArticleById = async (article_id) => {
  const { rows: article } = await db.query(
    "SELECT author, title, article_id, body, topic, created_at, votes, article_img_url FROM articles WHERE article_id = $1;",
    [article_id]
  );
  return article[0];
};

exports.fetchArticleComments = async (article_id) => {
  const { rows: comments } = await db.query(
    "SELECT comment_id, votes, created_at, author, body, article_id FROM comments WHERE article_id = $1;",
    [article_id]
  );
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
