const endpointsJson = require("../endpoints.json");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app.js");
require("jest-sorted");

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
  test("200: Responds an object with the key of topics and the value of an array of topic objects length 3. Each of which should have propertiy slug and description", async () => {
    const {
      body: { topics },
    } = await request(app).get("/api/topics").expect(200);
    expect(topics.length).toBe(3);
    topics.forEach((topic) => {
      expect(Object.keys(topic).length).toBe(2);
      expect(typeof topic.slug).toBe("string");
      expect(typeof topic.description).toBe("string");
    });
  });
});

describe("GET /api/articles", () => {
  test("200: responds an object with the key of articles and the value of an array of article objects length 13. Each of which should have the following properties: author,title,article_id,topic,created_at,votes,article_img_url,comment_count. The array is sorted by created_at descending", async () => {
    const {
      body: { articles },
    } = await request(app).get("/api/articles").expect(200);
    expect(articles.length).toBe(13);
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
  test("200: queries: endpoint accepts query sort_by which sorts the articles by that column in descending order", async () => {
    const {
      body: { articles },
    } = await request(app).get("/api/articles?sort_by=comment_count").expect(200);
    expect(articles.length).toBe(13);
    expect(articles).toBeSortedBy("comment_count", { descending: true });
  });
  test("200: queries: endpoint accepts query order that sets descending or ascending sort on created_at", async () => {
    const {
      body: { articles },
    } = await request(app).get("/api/articles?order=ASC").expect(200);
    expect(articles.length).toBe(13);
    expect(articles).toBeSortedBy("created_at", { descending: false });
  });
  test("404: queries: setting sort_by to an invalid value returns an error", async () => {
    const {
      body: { msg },
    } = await request(app).get("/api/articles?sort_by=snacks").expect(404);
    expect(msg).toBe("sort_by val is invalid");
  });
  test("200: queries: setting order to an invalid value defaults to DESC", async () => {
    const {
      body: { articles },
    } = await request(app).get("/api/articles?order=snacks").expect(200);
    expect(articles).toBeSortedBy("created_at", { descending: true });
  });
  test("200: queries: endpoint accepts query topic which filters the returns articles to that topic", async () => {
    const {
      body: { articles },
    } = await request(app).get("/api/articles?topic=mitch").expect(200);
    expect(articles.length).toBe(12);
    articles.forEach((article) => {
      expect(article.topic).toBe("mitch");
    });
  });
  test("200: queries: if there are no articles matching the query topic returns with an empty array", async () => {
    const {
      body: { articles },
    } = await request(app).get("/api/articles?topic=paper").expect(200);
    expect(articles.length).toBe(0);
  });
  test("404: queries: if the topic value is not found in the topic column responds with an error ", async () => {
    const {
      body: { msg },
    } = await request(app).get("/api/articles?topic=northcoders").expect(404);
    expect(msg).toBe("value not found in column");
  });
});

describe("GET /api/users", () => {
  test("200: responds an object with the key of users and the value of an array of user objects length 3. Each of which should have the following properties: username, name, avatar_url", async () => {
    const {
      body: { users },
    } = await request(app).get("/api/users").expect(200);
    expect(users.length).toBe(4);
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
  test("400: responds with an error if :article_id throws a postgres error", async () => {
    const {
      body: { msg },
    } = await request(app).get("/api/articles/banana").expect(400);
    expect(msg).toBe("bad request: postgres 22P02: invalid input syntax for type");
  });
  test("404: responds with an error if :article_id not in db", async () => {
    const {
      body: { msg },
    } = await request(app).get("/api/articles/9001").expect(404);
    expect(msg).toBe("no article found with that ID");
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds an object with the key of comments with value of an array length 11 containing comment objects for article with :article_id, which should have the following properties: comment_id, votes, created_at, author, body, article_id", async () => {
    const {
      body: { comments },
    } = await request(app).get("/api/articles/1/comments").expect(200);
    expect(comments.length).toBe(11);
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
  test("400: responds with an error if :article_id throws a postgres error", async () => {
    const {
      body: { msg },
    } = await request(app).get("/api/articles/banana/comments").expect(400);
    expect(msg).toBe("bad request: postgres 22P02: invalid input syntax for type");
  });
  test("404: responds with an error if :article_id not in db", async () => {
    const {
      body: { msg },
    } = await request(app).get("/api/articles/9001/comments").expect(404);
    expect(msg).toBe("no article found with that ID");
  });
  test("404: responds with an error if empty array returned i.e no comments found for article with :article_id ", async () => {
    const {
      body: { msg },
    } = await request(app).get("/api/articles/2/comments").expect(404);
    expect(msg).toBe("no comments found for that article");
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
  test("400: responds with an error if req body doesn't contain body key", async () => {
    const {
      body: { msg },
    } = await request(app).post("/api/articles/1/comments").send({ username: "butter_bridge" }).expect(400);
    expect(msg).toBe("bad request: request body missing a necessary key");
  });
  test("400: responds with an error if req body doesn't contain username key", async () => {
    const {
      body: { msg },
    } = await request(app).post("/api/articles/1/comments").send({ body: "some text" }).expect(400);
    expect(msg).toBe("bad request: request body missing a necessary key");
  });
  test("400: responds with an error if req body.username isn't matched in db", async () => {
    const {
      body: { msg },
    } = await request(app).post("/api/articles/1/comments").send({ username: 1, body: "some text" }).expect(400);
    expect(msg).toBe("bad request: postgres 23503: insert or update on table violates foreign key constraint");
  });
  test("400: responds with an error if req body.body isn't a string", async () => {
    const {
      body: { msg },
    } = await request(app).post("/api/articles/1/comments").send({ username: "butter_bridge", body: 1 }).expect(400);
    expect(msg).toBe("bad request: req.body for postComment must be type string");
  });
  test("400: responds with an error if :article_id not in db", async () => {
    const {
      body: { msg },
    } = await request(app)
      .post("/api/articles/9001/comments")
      .send({ username: "butter_bridge", body: "this is a cool comment" })
      .expect(404);
    expect(msg).toBe("no article found with that ID");
  });
  test("400: responds with an error if :article_id throws a postgres error", async () => {
    const {
      body: { msg },
    } = await request(app)
      .post("/api/articles/banana/comments")
      .send({ username: "butter_bridge", body: "this is a cool comment" })
      .expect(400);
    expect(msg).toBe("bad request: postgres 22P02: invalid input syntax for type");
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("201: request body accepts an object {inc_votes: newVote} where newVote is an integer, increase or decreases votes val for article with :article_id by newvotes, returns object with updatedArticle key with the updated article object as it's value", async () => {
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
  test("400: responds with an error if :article_id throws a postgres error", async () => {
    const {
      body: { msg },
    } = await request(app).patch("/api/articles/banana").send({ inc_votes: -10 }).expect(400);
    expect(msg).toBe("bad request: postgres 22P02: invalid input syntax for type");
  });
  test("404: responds with an error if :article_id not in db", async () => {
    const {
      body: { msg },
    } = await request(app).patch("/api/articles/9001").send({ inc_votes: -10 }).expect(404);
    expect(msg).toBe("no article found with that ID");
  });
  test("400: responds with an error if newVote is not a integer", async () => {
    const {
      body: { msg },
    } = await request(app).patch("/api/articles/1").send({ inc_votes: "help" }).expect(400);
    expect(msg).toBe("bad request: postgres 22P02: invalid input syntax for type");
  });
  test("400: responds with an error if req.body doesn't contain inc_votes", async () => {
    const {
      body: { msg },
    } = await request(app).patch("/api/articles/1").send({}).expect(400);
    expect(msg).toBe("bad request: request body missing a necessary key");
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: deletes comment with value :comment_id with response code 204 and no response content", async () => {
    await request(app).delete("/api/comments/1").expect(204);
  });
  test("400:responds with an error if the comment id is invalid", async () => {
    const {
      body: { msg },
    } = await request(app).delete("/api/comments/banana").expect(400);
    expect(msg).toBe("bad request: postgres 22P02: invalid input syntax for type");
  });
  test("404:responds with an error if the comment id not found in db", async () => {
    const {
      body: { msg },
    } = await request(app).delete("/api/comments/9001").expect(404);
    expect(msg).toBe("no comment found with that ID");
  });
});
