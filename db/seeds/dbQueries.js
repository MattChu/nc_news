const db = require("../connection");

async function logQuery() {
  try {
    const result = await db.query("SELECT * FROM emojis");
    return result.rows;
  } catch (err) {
    console.error("error: ", err);
  }
}

logQuery()
  .then((data) => console.log(data))
  .then(db.end());
