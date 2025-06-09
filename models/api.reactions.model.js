const db = require("../db/connection.js");

const insertReaction = async ({ username, emoji_id, article_id }) => {
  const { rows: postedReaction } = await db.query(
    "INSERT INTO reactions (username, emoji_id, article_id) Values ($1, $2, $3) RETURNING *",
    [username, emoji_id, article_id]
  );
  return postedReaction[0];
};

module.exports = { insertReaction };
