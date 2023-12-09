const irsdk = require('../');
const fs = require('fs');

// enable access to raw yaml sessioninfo
process.env.NODE_ENV = 'development';

irsdk.init({
  telemetryUpdateInterval: 5000,
  sessionInfoUpdateInterval: 5000,
});

const iracing = irsdk.getInstance();

console.log('waiting for iRacing...');

iracing.on('Connected', function () {
  console.log('connected to iRacing..');
});

iracing.on('Disconnected', function () {
  console.log('iRacing shut down.\n');
});

iracing.once('TelemetryDescription', function (data) {
  console.log('got TelemetryDescription');
  const fileName = './sample-data/telemetry-desc.json';

  fs.writeFile(fileName, JSON.stringify(data, null, 2), function (err) {
    if (err) throw err;
  });
});

iracing.once('Telemetry', function (data) {
  console.log('got Telemetry');
  const fileName = './sample-data/telemetry.json';

  fs.writeFile(fileName, JSON.stringify(data, null, 2), function (err) {
    if (err) throw err;
  });
});

iracing.once('SessionInfo', function (data) {
  console.log('got SessionInfo');
  const jsonFileName = './sample-data/sessioninfo.json';
  const yamlFileName = './sample-data/sessioninfo.yaml';

  fs.writeFile(jsonFileName, JSON.stringify(data, null, 2), function (err) {
    if (err) throw err;
  });

  if (data.yaml) {
    fs.writeFile(yamlFileName, data.yaml, function (err) {
      if (err) throw err;
    });
  }
});
