// camera / command example

const irsdk = require('../');

irsdk.init({
  telemetryUpdateInterval: 1000,
  sessionInfoUpdateInterval: 1000,
});

const iracing = irsdk.getInstance();

console.log('\nwaiting for iRacing...');

iracing.on('Connected', function () {
  console.log('Connected to iRacing.');

  iracing.once('Disconnected', function () {
    console.log('iRacing shut down.');
    process.exit();
  });

  iracing.once('SessionInfo', function (sessionInfo) {
    console.log('SessionInfo event received\n');

    // try to find rollbar cam group
    const camGroup = sessionInfo.data.CameraInfo.Groups.find(
      function (camGroup) {
        return camGroup.GroupName === 'Roll Bar';
      }
    );
    const camGroupNum = camGroup ? camGroup.GroupNum : 1;

    // loop thru top10, switch every 5 second
    const currentPosition = 1;

    setInterval(function () {
      console.log('showing P' + currentPosition);
      iracing.camControls.switchToPos(currentPosition++, camGroupNum, 0);

      if (currentPosition > 10) {
        currentPosition = 1;
      }
    }, 5000);
  });
});
