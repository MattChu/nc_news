const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app.js");
require("jest-sorted");

/* Set up your beforeEach & afterAll functions here */
beforeEach(async () => {
  await seed(data);
});

afterAll(async () => {
  await db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", async () => {
    const {
      body: { endpoints },
    } = await request(app).get("/api").expect(200);
    expect(endpoints).toEqual(endpointsJson);
  });
});

describe("GET /api/topics", () => {
  test("200: Responds an object with the key of topics and the value of an array of topic objects. Each of which should have propertiy slug and description", async () => {
    const {
      body: { topics },
    } = await request(app).get("/api/topics").expect(200);
    expect(topics.length).not.toBe(0);
    topics.forEach((topic) => {
      expect(Object.keys(topic).length).toBe(2);
      expect(typeof topic.slug).toBe("string");
      expect(typeof topic.description).toBe("string");
    });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds an object with the key of articles and the value of an array of article objects. Each of which should have the following properties: author,title,article_id,topic,created_at,votes,article_img_url,comment_count. The array is sorted by created_at descending", async () => {
    const {
      body: { articles },
    } = await request(app).get("/api/articles").expect(200);
    expect(articles.length).not.toBe(0);
    articles.forEach((article) => {
      expect(Object.keys(article).length).toBe(8);
      expect(typeof article.author).toBe("string");
      expect(typeof article.title).toBe("string");
      expect(typeof article.article_id).toBe("number");
      expect(typeof article.topic).toBe("string");
      expect(typeof article.created_at).toBe("string");
      expect(typeof article.votes).toBe("number");
      expect(typeof article.article_img_url).toBe("string");
      expect(typeof article.comment_count).toBe("number");
    });
    expect(articles).toBeSortedBy("created_at", { descending: true });
  });
});

describe("GET /api/users", () => {
  test("200: Responds an object with the key of users and the value of an array of user objects. Each of which should have the following properties: username, name, avatar_url", async () => {
    const {
      body: { users },
    } = await request(app).get("/api/users").expect(200);
    expect(users.length).not.toBe(0);
    users.forEach((user) => {
      expect(Object.keys(user).length).toBe(3);
      expect(typeof user.username).toBe("string");
      expect(typeof user.name).toBe("string");
      expect(typeof user.avatar_url).toBe("string");
    });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds an object with the key of article and the value of an article object for :article_id, which should have the following properties: author, title, article_id, body,topic, created_at, votes, article_img_url", async () => {
    const {
      body: { article },
    } = await request(app).get("/api/articles/1").expect(200);
    expect(Object.keys(article).length).toBe(8);
    expect(typeof article.author).toBe("string");
    expect(typeof article.title).toBe("string");
    expect(article.article_id).toBe(1);
    expect(typeof article.body).toBe("string");
    expect(typeof article.topic).toBe("string");
    expect(typeof article.created_at).toBe("string");
    expect(typeof article.votes).toBe("number");
    expect(typeof article.article_img_url).toBe("string");
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds an object with the key of comments wit value of an array  containing comment objects for article with :article_id, which should have the following properties: comment_id, votes, created_at, author, body, article_id", async () => {
    const {
      body: { comments },
    } = await request(app).get("/api/articles/1/comments").expect(200);
    expect(comments.length).not.toBe(0);
    comments.forEach((comment) => {
      expect(Object.keys(comment).length).toBe(6);
      expect(typeof comment.comment_id).toBe("number");
      expect(typeof comment.votes).toBe("number");
      expect(typeof comment.created_at).toBe("string");
      expect(typeof comment.author).toBe("string");
      expect(typeof comment.body).toBe("string");
      expect(comment.article_id).toBe(1);
    });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Request body accepts an object with username and body, adds comment to table, reponds with object with key postedComment containing the posted comment object", async () => {
    const {
      body: { postedComment },
    } = await request(app)
      .post("/api/articles/1/comments")
      .send({ username: "butter_bridge", body: "this is a cool comment" })
      .expect(201);
    const { comment_id, votes, created_at, author, body, article_id } = postedComment;
    expect(Object.keys(postedComment).length).toBe(6);
    expect(typeof comment_id).toBe("number");
    expect(typeof votes).toBe("number");
    expect(typeof created_at).toBe("string");
    expect(author).toBe("butter_bridge");
    expect(body).toBe("this is a cool comment");
    expect(article_id).toBe(1);
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("201: Request body accepts an object {inc_votes: newVote} where newVote is an integer, increase or decreases votes val for article with :article_id by newvotes, returns object with updatedArticle key with the updated article object as it's value", async () => {
    const {
      body: { updatedArticle },
    } = await request(app).patch("/api/articles/1").send({ inc_votes: -10 }).expect(201);
    const { author, title, article_id, body, topic, created_at, votes, article_img_url } = updatedArticle;
    expect(Object.keys(updatedArticle).length).toBe(8);
    expect(typeof author).toBe("string");
    expect(typeof title).toBe("string");
    expect(article_id).toBe(1);
    expect(typeof body).toBe("string");
    expect(typeof topic).toBe("string");
    expect(typeof created_at).toBe("string");
    expect(typeof votes).toBe("number");
    expect(typeof article_img_url).toBe("string");
  });
});

describe.only("DELETE /api/comments/:comment_id", () => {
  test("204: Deletes comment with value :comment_id with response code 204 and no content", async () => {
    await request(app).delete("/api/comments/1").expect(204);
  });
});
