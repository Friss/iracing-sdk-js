const irsdk = require("../");
const fs = require("fs");

const getTimestamp = () => {
  const date = new Date();
  return `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}-${date.getHours()}-${date.getMinutes()}`;
};

// enable access to raw yaml sessioninfo
process.env.NODE_ENV = "development";

irsdk.init({
  telemetryUpdateInterval: 5000,
  sessionInfoUpdateInterval: 5000,
});

const iracing = irsdk.getInstance();

console.log("waiting for iRacing...");

iracing.on("Connected", function () {
  console.log("connected to iRacing..");
});

iracing.on("Disconnected", function () {
  console.log("iRacing shut down.\n");
});

iracing.once("TelemetryDescription", function (data) {
  console.log("got TelemetryDescription");
  const dateStr = getTimestamp();
  const fileName = "./sample-data/" + dateStr + "-telemetry-desc.json";

  fs.writeFile(fileName, JSON.stringify(data, null, 2), function (err) {
    if (err) throw err;
  });
});

iracing.on("Telemetry", function (data) {
  console.log("got Telemetry");
  const dateStr = getTimestamp();
  const fileName = "./sample-data/" + dateStr + "-telemetry.json";

  fs.writeFile(fileName, JSON.stringify(data, null, 2), function (err) {
    if (err) throw err;
  });
});

iracing.on("SessionInfo", function (data) {
  console.log("got SessionInfo");
  const dateStr = getTimestamp();
  const jsonFileName = "./sample-data/" + dateStr + "-sessioninfo.json";
  const yamlFileName = "./sample-data/" + dateStr + "-sessioninfo.yaml";

  fs.writeFile(jsonFileName, JSON.stringify(data, null, 2), function (err) {
    if (err) throw err;
  });

  if (data.yaml) {
    fs.writeFile(yamlFileName, data.yaml, function (err) {
      if (err) throw err;
    });
  }
});
