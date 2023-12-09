const irsdk = require('../');
const fs = require('fs');

// kill the process when enough is done..
const done = (function () {
  var tasks = [];
  var totalTasks = 3;

  return function (taskName) {
    tasks.push(taskName);
    if (tasks.length >= totalTasks) {
      console.log();
      console.log('checks done', new Date());
      process.exit();
    }
  };
})();

irsdk.init({
  telemetryUpdateInterval: 100,
  sessionInfoUpdateInterval: 100,
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
    done('TelemetryDescription');
  });
});

iracing.once('Telemetry', function (data) {
  console.log('got Telemetry');
  const fileName = './sample-data/telemetry.json';

  fs.writeFile(fileName, JSON.stringify(data, null, 2), function (err) {
    if (err) throw err;
    done('Telemetry');
  });
});

iracing.once('SessionInfo', function (data) {
  console.log('got SessionInfo');
  const jsonFileName = './sample-data/sessioninfo.json';

  fs.writeFile(jsonFileName, JSON.stringify(data, null, 2), function (err) {
    if (err) throw err;
    done('SessionInfo');
  });
});
