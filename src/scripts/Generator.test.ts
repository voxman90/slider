import Generator from "./Generator";

const generator = new Generator();

test("The method must return an integer in an inclusive range", () => {
  expect(generator.getRandomInt(-5, 5)).toBeGreaterThanOrEqual(-5);
  expect(generator.getRandomInt(-5, 5)).toBeLessThanOrEqual(5);
  expect(generator.getRandomInt(-5, -5)).toStrictEqual(-5);
});

test("The method should return a number from the range (left inclusive)", () => {
  const x = -1.0001;
  const y = 1.0001;
  expect(generator.getRandomNumber(x, y)).toBeGreaterThanOrEqual(x);
  expect(generator.getRandomNumber(x, y)).toBeLessThan(y);
  expect(generator.getRandomNumber(x, x)).toStrictEqual(x);
});
