const db = require("../db/connection.js");

exports.fetchTopics = async () => {
  const { rows: topics } = await db.query("SELECT slug, description FROM topics;");
  return topics;
};
