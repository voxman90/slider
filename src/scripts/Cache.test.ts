import { NonBottomValue } from 'common/types/types';

import Cache from './Cache';
import { createTuplesArray } from './TuplesArray';

type Tuple = [string, NonBottomValue];
type TuplesArray = Array<Tuple>;

const TEST_CACHE_CAPACITY = 10;

const generatingFunc = (i: number): Tuple => [`${i}`, i];
const getCacheEntries = (cache: Cache<NonBottomValue>): TuplesArray => [...cache.entries()];
const setCacheEntries = (cache: Cache<NonBottomValue>, tuplesArray: TuplesArray): void => {
  tuplesArray.forEach(([key, value]) => {
    cache.set(key, value);
  });
}

let cache: Cache<NonBottomValue>;
let tuplesArray = createTuplesArray(generatingFunc, TEST_CACHE_CAPACITY);;

beforeEach(() => {
  cache = new Cache(TEST_CACHE_CAPACITY);
});


describe("Test 'set' method utility", () => {
  it("Check that 'set' method fills the cache with values with different keys without loss", () => {
    setCacheEntries(cache, tuplesArray);
    expect(getCacheEntries(cache)).toEqual(tuplesArray);
  });

  it("Check that 'set' method correctly fills the cache with values with duplicate keys", () => {
    const doubledTuplesArray = [...tuplesArray, ...tuplesArray];
    setCacheEntries(cache, doubledTuplesArray);
    expect(getCacheEntries(cache)).toEqual(tuplesArray);
  });

  it("Check that 'set'method takes into account the cache 'capacity' property", () => {
    const extraTuplesArray = createTuplesArray(generatingFunc, TEST_CACHE_CAPACITY, 'extra');
    const doubledTuplesArray = [...tuplesArray, ...extraTuplesArray];
    setCacheEntries(cache, doubledTuplesArray);
    expect(getCacheEntries(cache)).toEqual(extraTuplesArray);
  });
});
