/** Default parser used for SessionInfo YAML
  Fixes TeamName issue, uses js-yaml for actual parsing
  @private
  @param {string} sessionInfoStr raw session info YAML string
  @returns {Object} parsed session info or falsy
*/
function createSessionInfoParser() {
  const yaml = require("js-yaml");

  return function (sessionInfoStr) {
    const fixedYamlStr = sessionInfoStr.replace(
      /TeamName: ([^\n]+)/g,
      function (match, p1) {
        if (
          (p1[0] === '"' && p1[p1.length - 1] === '"') ||
          (p1[0] === "'" && p1[p1.length - 1] === "'")
        ) {
          return match; // skip if quoted already
        } else {
          // 2nd replace is unnecessary atm but its here just in case
          return "TeamName: '" + p1.replace(/'/g, "''") + "'";
        }
      }
    );
    return yaml.load(fixedYamlStr);
  };
}

module.exports = createSessionInfoParser;
