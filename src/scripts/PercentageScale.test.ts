import Generator from './Generator';
import PercentageScale from './PercentageScale';

const scale = new PercentageScale(0, 1);

test("This method should reflect the value on the scale", () => {
  const x = Generator.getRandomInt(0, 1e+10);
  scale.setRatio(-x, x);
  expect(scale.reflectOnScale(-x)).toStrictEqual(0)
  expect(scale.reflectOnScale(0)).toStrictEqual(50);
  expect(scale.reflectOnScale(x)).toStrictEqual(100);
  scale.setRatio(0, x);
  expect(scale.reflectOnScale(-x)).toStrictEqual(-100)
  expect(scale.reflectOnScale(0)).toStrictEqual(0);
  expect(scale.reflectOnScale(x)).toStrictEqual(100);
});

test("This method should convert value to percent according ratio", () => {
  scale.setRatio(0, 1);
  expect(scale.convertToPercent(100)).toStrictEqual(10000);
  scale.setRatio(-1, 1);
  expect(scale.convertToPercent(100)).toStrictEqual(5000);
  scale.setRatio(0, 1000);
  expect(scale.convertToPercent(100)).toStrictEqual(10);
  expect(scale.convertToPercent(-100)).toStrictEqual(-10);
});

test("This method should convert percent to value according ratio", () => {
  scale.setRatio(0, 1);
  expect(scale.convertToValue(50)).toStrictEqual(0.5);
  scale.setRatio(-1, 1);
  expect(scale.convertToValue(50)).toStrictEqual(1);
  expect(scale.convertToValue(-100)).toStrictEqual(-2);
});

test("This method should shift value by the value given in percent", () => {
  scale.setRatio(-1, 1);
  expect(scale.shift(1, -100)).toStrictEqual(-1);
  expect(scale.shift(-1, 100)).toStrictEqual(1);
  expect(scale.shift(0.1, 10)).toStrictEqual(0.3);
});

test("This method should convert offset to percent according ratio", () => {
  scale.setRatio(0, 100);
  expect(scale.convertOffsetToPercent(100, 30)).toStrictEqual(-70);
  expect(scale.convertOffsetToPercent(0, 70)).toStrictEqual(70);
  expect(scale.convertOffsetToPercent(100, 100)).toStrictEqual(0);
});
