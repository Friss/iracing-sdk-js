function stringToEnum(input, enumObj) {
  var enumKey = Object.keys(enumObj).find(function (key) {
    return key.toLowerCase() === input.toLowerCase();
  });
  if (enumKey) {
    return enumObj[enumKey];
  }
}

module.exports = stringToEnum;
