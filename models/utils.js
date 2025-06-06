const db = require("../db/connection");
const format = require("pg-format");

exports.errorIfValNotInColumn = async (table, column, value) => {
  const queryStr = format("SELECT * FROM %I WHERE %I = $1;", table, column);
  const dbOutput = await db.query(queryStr, [value]);
  if (dbOutput.rows.length === 0) {
    const err = new Error("value not found in column");
    err.status = 404;
    throw err;
  }
};
