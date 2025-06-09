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

describe("users tests:", () => {
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

  describe("GET /api/users/:username", () => {
    test("200: responds with object with the key of user containing the following properties username, avatar_url, name", async () => {
      const {
        body: { user },
      } = await request(app).get("/api/users/butter_bridge").expect(200);
      expect(Object.keys(user).length).toBe(3);
      expect(user.username).toBe("butter_bridge");
      expect(typeof user.name).toBe("string");
      expect(typeof user.avatar_url).toBe("string");
    });
    test("404: responds with an error if :username not in db", async () => {
      const {
        body: { msg },
      } = await request(app).get("/api/users/9001").expect(404);
      expect(msg).toBe("no user found with that username");
    });
  });
});
