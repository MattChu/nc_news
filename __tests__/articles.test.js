const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const request = require("supertest");
const app = require("../app.js");
require("jest-sorted");

beforeEach(async () => {
  await seed(data);
});

afterAll(async () => {
  await db.end();
});

describe("articles tests:", () => {
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

  describe("POST /api/articles/", () => {
    test("201: Request body accepts an object with author, title, body, topic, aarticle_url adds article to articles table, reponds with object with key postedArticle containing the posted article with author, title, body,topic, article_img_url, article_id,votes, created_at, comment_count", async () => {
      const {
        body: { postedArticle },
      } = await request(app)
        .post("/api/articles/")
        .send({
          author: "butter_bridge",
          title: "hot new article",
          body: "this is a cool article",
          topic: "paper",
          article_img_url: "www.google.com",
        })
        .expect(201);
      const { author, title, article_id, body, topic, created_at, votes, article_img_url, comment_count } =
        postedArticle;
      expect(Object.keys(postedArticle).length).toBe(9);
      expect(author).toBe("butter_bridge");
      expect(title).toBe("hot new article");
      expect(typeof article_id).toBe("number");
      expect(body).toBe("this is a cool article");
      expect(topic).toBe("paper");
      expect(typeof created_at).toBe("string");
      expect(votes).toBe(0);
      expect(article_img_url).toBe("www.google.com");
      expect(comment_count).toBe(0);
    });
    test("400: responds with an error if req body is missing author key", async () => {
      const {
        body: { msg },
      } = await request(app)
        .post("/api/articles/")
        .send({
          title: "hot new article",
          body: "this is a cool article",
          topic: "paper",
          article_img_url: "www.google.com",
        })
        .expect(400);
      expect(msg).toBe("bad request: request body missing a necessary key");
    });
    test("400: responds with an error if req body is missing title key", async () => {
      const {
        body: { msg },
      } = await request(app)
        .post("/api/articles/")
        .send({
          author: "butter_bridge",
          body: "this is a cool article",
          topic: "paper",
          article_img_url: "www.google.com",
        })
        .expect(400);
      expect(msg).toBe("bad request: request body missing a necessary key");
    });
    test("400: responds with an error if req body is missing body", async () => {
      const {
        body: { msg },
      } = await request(app)
        .post("/api/articles/")
        .send({
          author: "butter_bridge",
          title: "hot new article",
          topic: "paper",
          article_img_url: "www.google.com",
        })
        .expect(400);
      expect(msg).toBe("bad request: request body missing a necessary key");
    });
    test("400: responds with an error if req body is missing topic key", async () => {
      const {
        body: { msg },
      } = await request(app)
        .post("/api/articles/")
        .send({
          author: "butter_bridge",
          title: "hot new article",
          body: "this is a cool article",
          article_img_url: "www.google.com",
        })
        .expect(400);
      expect(msg).toBe("bad request: request body missing a necessary key");
    });
    test("201: if articel_img_url not passed as key defaults to correct url", async () => {
      const {
        body: { postedArticle },
      } = await request(app)
        .post("/api/articles/")
        .send({
          author: "butter_bridge",
          title: "hot new article",
          body: "this is a cool article",
          topic: "paper",
        })
        .expect(201);
      expect(postedArticle.article_img_url).toBe("https://en.wikipedia.org/wiki/Turnip#/media/File:Turnip_2622027.jpg");
    });
    test("400: responds with an error if req body.username isn't matched in db", async () => {
      const {
        body: { msg },
      } = await request(app)
        .post("/api/articles/")
        .send({ author: "mr_x", title: "hot new article", body: "this is a cool article", topic: "paper" })
        .expect(400);
      expect(msg).toBe("bad request: postgres 23503: insert or update on table violates foreign key constraint");
    });
    test("400: responds with an error if req body.topic isn't matched in db", async () => {
      const {
        body: { msg },
      } = await request(app)
        .post("/api/articles/")
        .send({ author: "butter_bridge", title: "hot new article", body: "this is a cool article", topic: "mr_x" })
        .expect(400);
      expect(msg).toBe("bad request: postgres 23503: insert or update on table violates foreign key constraint");
    });
    test("400: responds with an error if req body.title is not a string", async () => {
      const {
        body: { msg },
      } = await request(app)
        .post("/api/articles/")
        .send({ author: "butter_bridge", title: 2, body: "this is a cool article", topic: "paper" })
        .expect(400);
      expect(msg).toBe("bad request: author, title, body and topic for postArticle ,must be strings");
    });
    test("400: responds with an error if req body.body is not a string", async () => {
      const {
        body: { msg },
      } = await request(app)
        .post("/api/articles/")
        .send({ author: "butter_bridge", title: "hot new article", body: 2, topic: "paper" })
        .expect(400);
      expect(msg).toBe("bad request: author, title, body and topic for postArticle ,must be strings");
    });
    test("400: responds with an error if req body.body is empty", async () => {
      const {
        body: { msg },
      } = await request(app)
        .post("/api/articles/")
        .send({ author: "butter_bridge", title: "hot new article", body: "", topic: "paper" })
        .expect(400);
      expect(msg).toBe("bad request: request body missing a necessary key");
    });
    test("400: responds with an error if req body.title is empty", async () => {
      const {
        body: { msg },
      } = await request(app)
        .post("/api/articles/")
        .send({ author: "butter_bridge", title: "", body: "a cool article", topic: "paper" })
        .expect(400);
      expect(msg).toBe("bad request: request body missing a necessary key");
    });
  });
});
