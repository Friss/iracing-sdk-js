const { describe, it } = require('node:test');
const assert = require('node:assert');
const stringToEnum = require('../../src/utils/stringToEnum');

describe('stringToEnum', function () {
  const TEST_ENUM = {
    FIRST_VALUE: 1,
    SECOND_VALUE: 2,
    THIRD_VALUE: 3,
  };

  it('converts matching string to enum value', function () {
    assert.strictEqual(stringToEnum('FIRST_VALUE', TEST_ENUM), 1);
    assert.strictEqual(stringToEnum('SECOND_VALUE', TEST_ENUM), 2);
    assert.strictEqual(stringToEnum('THIRD_VALUE', TEST_ENUM), 3);
  });

  it('is case insensitive', function () {
    assert.strictEqual(stringToEnum('first_value', TEST_ENUM), 1);
    assert.strictEqual(stringToEnum('First_Value', TEST_ENUM), 1);
    assert.strictEqual(stringToEnum('FIRST_value', TEST_ENUM), 1);
  });

  it('returns undefined for non-matching strings', function () {
    assert.strictEqual(stringToEnum('NON_EXISTENT', TEST_ENUM), undefined);
    assert.strictEqual(stringToEnum('', TEST_ENUM), undefined);
  });

  it('handles special characters correctly', function () {
    const SPECIAL_ENUM = {
      'SPECIAL-VALUE': 1,
      'ANOTHER.VALUE': 2,
    };
    assert.strictEqual(stringToEnum('SPECIAL-VALUE', SPECIAL_ENUM), 1);
    assert.strictEqual(stringToEnum('special-value', SPECIAL_ENUM), 1);
    assert.strictEqual(stringToEnum('ANOTHER.VALUE', SPECIAL_ENUM), 2);
  });
});
