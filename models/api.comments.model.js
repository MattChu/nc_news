const db = require("../db/connection.js");

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
  if (!username || !body) {
    const err = new Error("bad request: request body missing a necessary key");
    err.status = 400;
    throw err;
  }
  if (typeof body !== "string") {
    const err = new Error("bad request: req.body for postComment must be type string");
    err.status = 400;
    throw err;
  }
  const { rows: postedComment } = await db.query(
    "INSERT INTO comments (article_id, author, body) Values ( $1, $2, $3) RETURNING *;",
    [article_id, username, body]
  );
  return postedComment[0];
};

exports.removeCommentFromDB = async ({ comment_id }) => {
  const { rows: commentToDelete } = await db.query("SELECT * FROM comments WHERE comment_id = $1;", [comment_id]);
  if (!commentToDelete.length) {
    const err = new Error("no comment found with that ID");
    err.status = 404;
    throw err;
  }
  await db.query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [comment_id]);
};

exports.updateCommentVotes = async ({ comment_id, inc_votes }) => {
  if (!inc_votes) {
    const err = new Error("bad request: request body missing a necessary key");
    err.status = 400;
    throw err;
  }
  const { rows: updatedComment } = await db.query(
    "UPDATE comments SET votes = (votes + $1) WHERE comment_id = $2 RETURNING *;",
    [inc_votes, comment_id]
  );
  if (!updatedComment.length) {
    const err = new Error("no comment found with that ID");
    err.status = 404;
    throw err;
  }
  return updatedComment[0];
};
