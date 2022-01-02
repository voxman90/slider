import Generator from "./Generator";

const generator = new Generator();

test("The method must return an integer in an inclusive range", () => {
  expect(generator.getRandomInt(-5, 5)).toBeGreaterThanOrEqual(-5);
  expect(generator.getRandomInt(-5, 5)).toBeLessThanOrEqual(5);
  expect(generator.getRandomInt(-5, -5)).toStrictEqual(-5);
});
