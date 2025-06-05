const db = require("../db/connection.js");

exports.removeCommentFromDB = async ({ comment_id }) => {
  const { rows: commentToDelete } = await db.query("SELECT * FROM comments WHERE comment_id = $1;", [comment_id]);
  if (!commentToDelete.length) {
    const err = new Error("no comment found with that Id");
    err.status = 404;
    throw err;
  }
  await db.query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [comment_id]);
};
