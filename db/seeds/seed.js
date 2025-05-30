const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate, createRef } = require("./utils");

const seed = async ({
  topicData,
  userData,
  articleData,
  commentData,
  emojiData,
  reactionData,
  followData,
  voteData,
}) => {
  try {
    await db.query("DROP TABLE IF EXISTS topics CASCADE;");

    await db.query(
      "CREATE TABLE topics (slug VARCHAR(100) PRIMARY KEY, description VARCHAR(300), img_url VARCHAR(1000));"
    );
    await db.query("DROP TABLE IF EXISTS users CASCADE;");

    await db.query(
      "CREATE TABLE users (username VARCHAR(100) PRIMARY KEY, name VARCHAR(300) NOT NULL, avatar_url VARCHAR(1000));"
    );

    await db.query("DROP TABLE IF EXISTS articles CASCADE;");

    await db.query(
      "CREATE TABLE articles (article_id SERIAL PRIMARY KEY, title VARCHAR(300) NOT NULL, topic VARCHAR(100) NOT NULL REFERENCES topics(slug), author VARCHAR(100) NOT NULL REFERENCES users(username), body TEXT NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, votes INT NOT NULL DEFAULT 0, article_img_url VARCHAR(1000));"
    );

    await db.query("DROP TABLE IF EXISTS comments;");

    await db.query(
      "CREATE TABLE comments (comment_id SERIAL PRIMARY KEY, article_id INT NOT NULL REFERENCES articles(article_id), body TEXT NOT NULL, votes INT NOT NULL DEFAULT 0, author VARCHAR(100) NOT NULL REFERENCES users(username),created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP);"
    );

    await db.query("DROP TABLE IF EXISTS emojis CASCADE;");

    await db.query(
      "CREATE TABLE emojis (emoji_id SERIAL PRIMARY KEY, emoji VARCHAR(10) NOT NULL, CONSTRAINT UC_emojis UNIQUE (emoji));"
    );

    await db.query("DROP TABLE IF EXISTS reactions CASCADE;");

    await db.query(
      "CREATE TABLE reactions (reaction_id SERIAL PRIMARY KEY, emoji_id INT NOT NULL REFERENCES emojis(emoji_id), username VARCHAR(100) NOT NULL REFERENCES users(username), article_id INT NOT NULL REFERENCES articles(article_id), CONSTRAINT UC_reactions UNIQUE (emoji_id, username, article_id));"
    );

    await db.query("DROP TABLE IF EXISTS follows CASCADE;");

    await db.query(
      "CREATE TABLE follows (follow_id SERIAL PRIMARY KEY, username VARCHAR(100) NOT NULL REFERENCES users(username), topic VARCHAR(100) NOT NULL REFERENCES topics(slug), CONSTRAINT UC_follows UNIQUE (username, topic));"
    );

    await db.query("DROP TABLE IF EXISTS votes CASCADE;");

    await db.query(
      "CREATE TABLE votes (vote_id SERIAL PRIMARY KEY, username VARCHAR(100) NOT NULL REFERENCES users(username), article_id INT NOT NULL REFERENCES articles(article_id), vote_count INT NOT NULL, CONSTRAINT UC_votes UNIQUE (username, article_id));"
    );

    const formattedTopicData = topicData.map(({ slug, description, img_url }) => {
      return [slug, description, img_url];
    });

    await db.query(format("INSERT INTO topics (slug, description, img_url) VALUES %L ;", formattedTopicData));

    const formattedUserData = userData.map(({ username, name, avatar_url }) => {
      return [username, name, avatar_url];
    });

    await db.query(format("INSERT INTO users (username, name, avatar_url) VALUES %L ;", formattedUserData));

    const formattedArticleData = articleData.map((article) => {
      const { title, topic, author, body, votes, article_img_url } = article;
      const created_at = convertTimestampToDate(article).created_at;
      return [title, topic, author, body, created_at, votes, article_img_url];
    });

    const articles = await db.query(
      format(
        "INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;",
        formattedArticleData
      )
    );

    const articleIdLookup = createRef(articles.rows, "title", "article_id");

    const formattedCommentData = commentData.map((comment) => {
      const { article_title, body, votes, author } = comment;
      const article_id = articleIdLookup[article_title];
      const created_at = convertTimestampToDate(comment).created_at;
      return [article_id, body, votes, author, created_at];
    });

    await db.query(
      format("INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L;", formattedCommentData)
    );

    const formattedEmojiData = emojiData.map(({ emoji }) => {
      return [emoji];
    });

    await db.query(format("INSERT INTO emojis ( emoji) VALUES %L", formattedEmojiData));

    const formattedReactionData = reactionData.map(({ emoji_id, username, article_id }) => {
      return [emoji_id, username, article_id];
    });

    await db.query(format("INSERT INTO reactions ( emoji_id, username, article_id) VALUES %L", formattedReactionData));

    const formattedFollowData = followData.map(({ username, topic }) => {
      return [username, topic];
    });

    await db.query(format("INSERT INTO follows (username, topic) VALUES %L", formattedFollowData));

    const formattedVoteData = voteData.map(({ username, article_id, vote_count }) => {
      return [username, article_id, vote_count];
    });

    await db.query(format("INSERT INTO votes (username, article_id, vote_count) VALUES %L", formattedVoteData));
  } catch (err) {
    console.log("uhoj   " + err.message);
  }
};

module.exports = seed;
