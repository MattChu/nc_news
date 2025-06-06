const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const { errorIfValNotInColumn } = require("../models/utils.js");

beforeEach(async () => {
  await seed(data);
});

afterAll(async () => {
  await db.end();
});

describe.only("errorIfValNotInColumn", () => {
  test("throws error if passed valid table, column but val does not appear in the column", async () => {
    await expect(errorIfValNotInColumn("topics", "slug", "northcoders")).rejects.toThrow("value not found in column");
  });
  test("throws error if passed valid column, val, but invalid table,", async () => {
    await expect(errorIfValNotInColumn("northcoders", "slug", "paper")).rejects.toThrow(
      'relation "northcoders" does not exist'
    );
  });
  test("throws error if passed valid table, val, but invalid column,", async () => {
    await expect(errorIfValNotInColumn("topics", "northcoders", "paper")).rejects.toThrow(
      'column "northcoders" does not exist'
    );
  });
});
