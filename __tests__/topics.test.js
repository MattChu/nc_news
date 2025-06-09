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

describe("topics tests:", () => {
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
  describe("POST /api/topics", () => {
    test("201: accepts object with slug and description and responds with inserted topic object", async () => {
      const {
        body: { topic },
      } = await request(app)
        .post("/api/topics")
        .send({
          slug: "topic name here",
          description: "description here",
        })
        .expect(201);
      expect(Object.keys(topic).length).toBe(3);
      expect(topic.slug).toBe("topic name here");
      expect(topic.description).toBe("description here");
    });
    test("400: responds with an error if slug key is missing", async () => {
      const {
        body: { msg },
      } = await request(app)
        .post("/api/topics")
        .send({
          description: "description here",
        })
        .expect(400);
      expect(msg).toBe("bad request: request body missing a necessary key");
    });
    test("400: responds with an error if description key is missing", async () => {
      const {
        body: { msg },
      } = await request(app)
        .post("/api/topics")
        .send({
          slug: "topic name here",
        })
        .expect(400);
      expect(msg).toBe("bad request: request body missing a necessary key");
    });
    test("400: responds with an error if slug key blank", async () => {
      const {
        body: { msg },
      } = await request(app)
        .post("/api/topics")
        .send({
          slug: "",
          description: "description here",
        })
        .expect(400);
      expect(msg).toBe("bad request: request body missing a necessary key");
    });
    test("400: responds with an error if description key is blank", async () => {
      const {
        body: { msg },
      } = await request(app)
        .post("/api/topics")
        .send({
          slug: "topic name here",
          description: "",
        })
        .expect(400);
      expect(msg).toBe("bad request: request body missing a necessary key");
    });
    test("400: responds with an error if topic already exists in db", async () => {
      const {
        body: { msg },
      } = await request(app)
        .post("/api/topics")
        .send({
          slug: "paper",
          description: "paper info",
        })
        .expect(400);
      expect(msg).toBe("bad request: postgres 23505: duplicate key value violates unique constraint");
    });
  });
});
