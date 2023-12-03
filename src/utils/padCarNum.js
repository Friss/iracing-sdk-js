/** pad car number
    @function
    @param {string} numStr - car number as string
    @returns {number} - padded car number
  */
function padCarNum(numStr) {
  if (typeof numStr === "string") {
    var num = parseInt(numStr);
    var zeros = numStr.length - num.toString().length;
    if (!zeros) return num;

    var numPlaces = 1;
    if (num > 9) numPlaces = 2;
    if (num > 99) numPlaces = 3;

    return (numPlaces + zeros) * 1000 + num;
  }
}

module.exports = padCarNum;
