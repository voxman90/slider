import Generator from './Generator';
import MathModule from './MathModule';

const pm = new MathModule();

test("The method 'numberOfDecimalPlaces' should return the number of decimal places", () => {
  expect(pm.numberOfDecimalPlaces(0.)).toStrictEqual(0);
  expect(pm.numberOfDecimalPlaces(1.0)).toStrictEqual(0);
  expect(pm.numberOfDecimalPlaces(1.0e0)).toStrictEqual(0);
  expect(pm.numberOfDecimalPlaces(1E-1)).toStrictEqual(1);
  expect(pm.numberOfDecimalPlaces(1.1e-1)).toStrictEqual(2);
  expect(pm.numberOfDecimalPlaces(0.001e+2)).toStrictEqual(1);

  let num = Generator.getRandomInt(-1e+10, 1e+10);
  expect(pm.numberOfDecimalPlaces(num)).toStrictEqual(0);

  let exp = Generator.getRandomInt(0, 20);
  num = Number(`1e-${exp}`);
  expect(pm.numberOfDecimalPlaces(num)).toStrictEqual(exp);

  num = Number(`1e+${exp}`);
  expect(pm.numberOfDecimalPlaces(num)).toStrictEqual(0);

  const index = Generator.getRandomInt(1, 20);
  exp = Generator.getRandomInt(index + 1, 21);
  num = Number(`${10 ** index}e-${exp}`); // Number(`${10 ** 21}e-1`) ==> NaN
  expect(pm.numberOfDecimalPlaces(num)).toStrictEqual(exp - index);

  num = Number(`${10 ** exp}e-${index}`);
  expect(pm.numberOfDecimalPlaces(num)).toStrictEqual(0);
});

test("The method 'getCommonFactor' should return the round factor that makes both numbers integer", () => {
  expect(pm.getCommonFactor(0.001, 0.01)).toStrictEqual(1000);

  const intX = Generator.getRandomInt(-1e+10, 1e+10);
  const intY = Generator.getRandomInt(-1e+10, 1e+10);
  expect(pm.getCommonFactor(intX, intY)).toStrictEqual(1);

  const num = Generator.getRandomNumber(-0.99, 1);
  const commonFactor = 10 ** pm.numberOfDecimalPlaces(num);
  expect(pm.getCommonFactor(intX, num)).toStrictEqual(commonFactor);
  expect(pm.getCommonFactor(num, intX)).toStrictEqual(commonFactor);
});

test("The method 'add' should return the sum of the two numbers", () => {
  expect(pm.add(0.1, 0.2)).toStrictEqual(0.3);
  expect(pm.add(Number.MAX_SAFE_INTEGER - 1, 1)).toStrictEqual(Number.MAX_SAFE_INTEGER);
  expect(pm.add(Number.MAX_SAFE_INTEGER, 1)).toStrictEqual(Number.MAX_SAFE_INTEGER + 2);
  expect(pm.add(1, Number.MIN_VALUE)).toStrictEqual(1);
  expect(pm.add(0, Number.MIN_VALUE)).not.toStrictEqual(0);
  expect(pm.add(0, 1e-324)).toStrictEqual(0);
});

test("The method 'sub' should return the difference of two numbers", () => {
  expect(pm.sub(0.3, 0.1)).toStrictEqual(0.2);
});

test("The method 'mul' should return the product of two numbers", () => {
  expect(pm.mul(0.1, 0.2)).toStrictEqual(0.02);
  expect(pm.mul(0.123, 0.12)).toStrictEqual(0.01476);
});

test("The method 'div' should return the quotient of two numbers", () => {
  expect(pm.div(0.2, 0.1)).toStrictEqual(2);
});
