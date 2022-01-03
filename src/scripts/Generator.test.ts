import Generator from "./Generator";

test("The method 'getRandomInt' should return an integer in an inclusive range", () => {
  expect(Generator.getRandomInt(-5, 5)).toBeGreaterThanOrEqual(-5);
  expect(Generator.getRandomInt(-5, 5)).toBeLessThanOrEqual(5);
  expect(Generator.getRandomInt(-5, -5)).toStrictEqual(-5);
});

test("The method 'getRandomNumber' should return a number from the range (left inclusive)", () => {
  const x = -1.0001;
  const y = 1.0001;
  expect(Generator.getRandomNumber(x, y)).toBeGreaterThanOrEqual(x);
  expect(Generator.getRandomNumber(x, y)).toBeLessThan(y);
  expect(Generator.getRandomNumber(x, x)).toStrictEqual(x);
});
