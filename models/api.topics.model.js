const db = require("../db/connection.js");

exports.fetchTopics = async () => {
  const { rows: topics } = await db.query("SELECT slug, description FROM topics;");
  return topics;
};

exports.insertTopic = async ({ slug, description }) => {
  if (!slug || !description) {
    const err = new Error("bad request: request body missing a necessary key");
    err.status = 400;
    throw err;
  }
  const { rows: topic } = await db.query("INSERT INTO topics ( slug, description) Values ($1, $2) RETURNING *;", [
    slug,
    description,
  ]);
  return topic[0];
};
