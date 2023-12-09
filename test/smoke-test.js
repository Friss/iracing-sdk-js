const assert = require('node:assert');
const irsdk = require('../');

irsdk.init({
  telemetryUpdateInterval: 0,
  sessionInfoUpdateInterval: 1000,
});

const iracing = irsdk.getInstance();

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

function validateValue(val, desc) {
  if (desc.type !== 'bitField') {
    if (desc.unit.substr(0, 5) === 'irsdk') {
      assert.strictEqual(
        typeof val,
        'string',
        `enums should be converted to strings ${JSON.stringify(desc)}`
      );
    } else {
      if (desc.type === 'bool') {
        assert.strictEqual(typeof val, 'boolean');
      }
      if (desc.type === 'int') {
        assert.strictEqual(typeof val, 'number');
      }
      if (desc.type === 'float') {
        assert.strictEqual(typeof val, 'number');
      }
      if (desc.type === 'double') {
        assert.strictEqual(typeof val, 'number');
      }
      if (desc.type === 'char') {
        assert.strictEqual(typeof val, 'string');
        assert.strictEqual(val.length, 1);
      }
    }
  } else {
    // expect bitField to be converted to array<string>
    assert.strictEqual(
      Array.isArray(val),
      true,
      'bitField should be converted to array<string>'
    );

    val.forEach(function (bitFieldVal) {
      assert.strictEqual(typeof bitFieldVal, 'string');
    });
  }
}

// tests that C++ module is working
// correctly when doing unit & type conversions
function checkTelemetryValues(telemetry, desc) {
  if (!desc || !telemetry) {
    return;
  }

  console.log('got telemetry and its description, validating output..');

  for (const telemetryVarName in desc) {
    if (desc.hasOwnProperty(telemetryVarName)) {
      console.log('checking ' + telemetryVarName);
      const varDesc = desc[telemetryVarName];
      const value = telemetry.values[telemetryVarName];

      assert.strictEqual(typeof varDesc, 'object');
      assert.notEqual(value, undefined);

      if (varDesc.count > 1) {
        assert.strictEqual(Array.isArray(value), true);

        value.forEach(function (val) {
          validateValue(val, varDesc);
        });
      } else {
        validateValue(value, varDesc);
      }
    }
  }
}

console.log();
console.log('waiting for iRacing...');

iracing.once('Connected', function () {
  console.log();
  console.log('Connected to iRacing.');

  let telemetry, desc;

  iracing.once('TelemetryDescription', function (data) {
    console.log('TelemetryDescription event received');
    assert.strictEqual(typeof data, 'object');
    desc = data;
    checkTelemetryValues(telemetry, desc);
    done('desc');
  });

  iracing.once('Telemetry', function (data) {
    console.log('Telemetry event received');
    assert.strictEqual(typeof data, 'object');
    assert.strictEqual(typeof data.timestamp, 'object');
    assert.strictEqual(typeof data.values, 'object');

    telemetry = data;
    checkTelemetryValues(telemetry, desc);
    done('telemetry');
  });

  iracing.once('SessionInfo', function (data) {
    console.log('SessionInfo event received');
    assert.strictEqual(typeof data, 'object');
    assert.strictEqual(typeof data.timestamp, 'object');
    assert.strictEqual(typeof data.data, 'object');
    done('sessioninfo');
  });
});

setTimeout(function () {
  console.log('no iRacing detected, skipping telemetry checks.');
  process.exit(0);
}, 3000);
