const db = require("../db/connection.js");

exports.fetchUsers = async () => {
  const { rows: users } = await db.query("SELECT * FROM users;");
  return users;
};
