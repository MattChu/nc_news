const db = require("../db/connection.js");

exports.selectUsers = async () => {
  const { rows: users } = await db.query("SELECT * FROM users;");
  return users;
};

exports.selectUserById = async ({ username }) => {
  const { rows: user } = await db.query("SELECT * FROM users WHERE username = $1;", [username]);
  if (!user.length) {
    const err = new Error("no user found with that username");
    err.status = 404;
    throw err;
  }
  return user[0];
};
