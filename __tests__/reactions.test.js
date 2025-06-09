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

describe("/api/articles/:article_id/reactions tests", () => {
  describe("POST /api/articles/:article_id/reactions", () => {
    test("201: Request body accepts an object with username and emoji_id, adds to reactions table, reponds with object with key postedEmoji containing the posted reaction object: reaction_id, username, article_id, emoji_id", async () => {
      const {
        body: { postedReaction },
      } = await request(app)
        .post("/api/articles/1/reactions")
        .send({ username: "butter_bridge", emoji_id: 1 })
        .expect(201);
      const { reaction_id, username, article_id, emoji_id } = postedReaction;
      expect(Object.keys(postedReaction).length).toBe(4);
      expect(typeof reaction_id).toBe("number");
      expect(emoji_id).toBe(1);
      expect(username).toBe("butter_bridge");
      expect(article_id).toBe(1);
    });
  });
});
