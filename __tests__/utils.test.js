const { convertTimestampToDate, createRef } = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("CreateRef Tests", () => {
  test("returns an object with the correct key/value pairs when passed one object", () => {
    expect(createRef([{ name: "Rose", id: "dS8rJns", secretFear: "spiders" }], "name", "id")).toEqual({
      Rose: "dS8rJns",
    });
    expect(createRef([{ name: "Rose", id: "dS8rJns", secretFear: "spiders" }], "name", "secretFear")).toEqual({
      Rose: "spiders",
    });
    expect(createRef([{ name: "Rose", id: "dS8rJns", secretFear: "spiders" }], "secretFear", "id")).toEqual({
      spiders: "dS8rJns",
    });
  });
  test("returns an object with the correct key/value pairs when passed objects employees", () => {
    const employees = [
      { name: "Rose", id: "dS8rJns", secretFear: "spiders" },
      { name: "Simon", id: "Pk34ABs", secretFear: "mice" },
      { name: "Jim", id: "lk1ff8s", secretFear: "bears" },
      { name: "David", id: "og8r0nV", secretFear: "Rose" },
    ];
    expect(createRef(employees, "name", "id")).toEqual({
      Rose: "dS8rJns",
      Simon: "Pk34ABs",
      Jim: "lk1ff8s",
      David: "og8r0nV",
    });
    expect(createRef(employees, "name", "secretFear")).toEqual({
      Rose: "spiders",
      Simon: "mice",
      Jim: "bears",
      David: "Rose",
    });
    expect(createRef(employees, "secretFear", "id")).toEqual({
      spiders: "dS8rJns",
      mice: "Pk34ABs",
      bears: "lk1ff8s",
      Rose: "og8r0nV",
    });
  });
  test("doesn't mutate input array", () => {
    const employees = [
      { name: "Rose", id: "dS8rJns", secretFear: "spiders" },
      { name: "Simon", id: "Pk34ABs", secretFear: "mice" },
      { name: "Jim", id: "lk1ff8s", secretFear: "bears" },
      { name: "David", id: "og8r0nV", secretFear: "Rose" },
    ];
    const employeesCopy = [
      { name: "Rose", id: "dS8rJns", secretFear: "spiders" },
      { name: "Simon", id: "Pk34ABs", secretFear: "mice" },
      { name: "Jim", id: "lk1ff8s", secretFear: "bears" },
      { name: "David", id: "og8r0nV", secretFear: "Rose" },
    ];
    createRef(employees, "secretFear", "id");
    employees.forEach((employee, index) => {
      for (const key in employee) {
        expect(key in employeesCopy[index]).toBe(true);
        expect(employee[key]).toBe(employeesCopy[index][key]);
      }
    });
  });
  test("returns an array of new objects", () => {
    const employees = [
      { name: "Rose", id: "dS8rJns", secretFear: "spiders" },
      { name: "Simon", id: "Pk34ABs", secretFear: "mice" },
      { name: "Jim", id: "lk1ff8s", secretFear: "bears" },
      { name: "David", id: "og8r0nV", secretFear: "Rose" },
    ];
    const output = createRef(employees);
    employees.forEach((employee, index) => {
      expect(employee).not.toBe(output[index]);
    });
  });
});
