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

describe("comments tests:", () => {
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
    test("200: responds with an empty array if no comments found for article with :article_id ", async () => {
      const {
        body: { comments },
      } = await request(app).get("/api/articles/2/comments").expect(200);
      expect(comments.length).toBe(0);
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
    test.only("400: responds with an error if req body.username isn't a string", async () => {
      const {
        body: { msg },
      } = await request(app).post("/api/articles/1/comments").send({ username: 1, body: "some text" }).expect(422);
      expect(msg).toBe("bad request: postgres 23503: insert or update on table violates foreign key constraint");
    });
    test.only("422: responds with an error if req body.username is valid but isn't matched in db ", async () => {
      const {
        body: { msg },
      } = await request(app)
        .post("/api/articles/1/comments")
        .send({ username: "butter", body: "some text" })
        .expect(422);
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

  describe("PATCH /api/comments/:comment_id", () => {
    test("201: request body accepts an object {inc_votes: newVote} where newVote is an integer, increase or decreases votes val for comment with :comment_id by newvotes, returns object with updatedComment key with the updated comment object as it's value", async () => {
      const {
        body: { updatedComment },
      } = await request(app).patch("/api/comments/1").send({ inc_votes: -10 }).expect(201);
      const { comment_id, votes, created_at, author, body, article_id } = updatedComment;
      expect(Object.keys(updatedComment).length).toBe(6);
      expect(comment_id).toBe(1);
      expect(typeof votes).toBe("number");
      expect(typeof created_at).toBe("string");
      expect(typeof author).toBe("string");
      expect(typeof body).toBe("string");
      expect(typeof article_id).toBe("number");
    });
    test("400: responds with an error if :comment_id throws a postgres error", async () => {
      const {
        body: { msg },
      } = await request(app).patch("/api/comments/banana").send({ inc_votes: -10 }).expect(400);
      expect(msg).toBe("bad request: postgres 22P02: invalid input syntax for type");
    });
    test("404: responds with an error if :comment_id not in db", async () => {
      const {
        body: { msg },
      } = await request(app).patch("/api/comments/9001").send({ inc_votes: -10 }).expect(404);
      expect(msg).toBe("no comment found with that ID");
    });
    test("400: responds with an error if newVote is not a integer", async () => {
      const {
        body: { msg },
      } = await request(app).patch("/api/comments/1").send({ inc_votes: "help" }).expect(400);
      expect(msg).toBe("bad request: postgres 22P02: invalid input syntax for type");
    });
    test("400: responds with an error if req.body doesn't contain inc_votes", async () => {
      const {
        body: { msg },
      } = await request(app).patch("/api/articles/1").send({}).expect(400);
      expect(msg).toBe("bad request: request body missing a necessary key");
    });
  });
});
