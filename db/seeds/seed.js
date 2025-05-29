const db = require("../connection");

const seed = async ({ topicData, userData, articleData, commentData }) => {
  await db.query("DROP TABLE IF EXISTS topics CASCADE;");
  await db.query(
    "CREATE TABLE topics (slug VARCHAR(100) PRIMARY KEY, description VARCHAR(300), img_url VARCHAR(1000))"
  );
  await db.query("DROP TABLE IF EXISTS users CASCADE;");
  await db.query(
    "CREATE TABLE users (username VARCHAR(100) PRIMARY KEY, name VARCHAR(300), avatar_url VARCHAR(1000));"
  );
  await db.query("DROP TABLE IF EXISTS articles CASCADE;");
  await db.query(
    "CREATE TABLE articles (article_id SERIAL PRIMARY KEY, title VARCHAR(300), topic VARCHAR(100) REFERENCES topics(slug), author VARCHAR(100) REFERENCES users(username), body TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, votes INT DEFAULT 0, article_img_url VARCHAR(1000));"
  );
  await db.query("DROP TABLE IF EXISTS comments;");
  await db.query(
    "CREATE TABLE comments (comment_id SERIAL PRIMARY KEY, article_id INT REFERENCES articles(article_id), body TEXT, votes INT DEFAULT 0, author VARCHAR(100) REFERENCES users(username),created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);"
  );
};
module.exports = seed;

/*
topic INT REFERENCES topics(slug), author INT REFERENCES users(username), body TEXT, votes INT DEFAULT 0, article_img_url VARCHAR(1000));"

*/
