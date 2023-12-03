const JsIrSdk = require('../src/JsIrSdk');
const IrSdkWrapper = require('./IrsdkNodeWrapper-stub');
const { describe, it, mock, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');

describe('JsIrSdk', function () {
  it('emits "Connected" when iRacing available', function (context) {
    context.mock.timers.enable();

    const opts = {
      telemetryUpdateInterval: 1,
      sessionInfoUpdateInterval: 20000,
    };
    const irSdkWrapperMockObj = Object.create(IrSdkWrapper);
    const start = mock.method(irSdkWrapperMockObj, 'start', () => true);

    irsdk = new JsIrSdk(irSdkWrapperMockObj, opts);
    const isConnected = mock.method(
      irSdkWrapperMockObj,
      'isConnected',
      () => false
    );

    const spy = context.mock.fn();

    irsdk.on('Connected', spy);
    context.mock.timers.tick(2);
    assert.strictEqual(spy.mock.callCount(), 0);

    isConnected.mock.mockImplementation(() => true);

    context.mock.timers.tick(2);

    assert.strictEqual(spy.mock.callCount(), 1);
    assert.strictEqual(start.mock.callCount(), 1);
  });

  it('emits "Disconnected" when iRacing shut down', function (context) {
    context.mock.timers.enable();
    const opts = {
      telemetryUpdateInterval: 1,
      sessionInfoUpdateInterval: 20000,
    };
    const irSdkWrapperMockObj = Object.create(IrSdkWrapper);
    const irsdk = new JsIrSdk(irSdkWrapperMockObj, opts);
    const isConnected = mock.method(
      irSdkWrapperMockObj,
      'isConnected',
      () => true
    );
    const spy = context.mock.fn();
    irsdk.on('Disconnected', spy);
    context.mock.timers.tick(2);
    assert.strictEqual(spy.mock.callCount(), 0);
    isConnected.mock.mockImplementation(() => false);
    context.mock.timers.tick(2);
    assert.strictEqual(spy.mock.callCount(), 1);
  });

  it('emits "Connected" again after reconnect', function (context) {
    context.mock.timers.enable();
    const opts = {
      telemetryUpdateInterval: 2000,
      sessionInfoUpdateInterval: 20000,
    };

    const irSdkWrapperMockObj = Object.create(IrSdkWrapper);
    const start = mock.method(irSdkWrapperMockObj, 'start', () => true);
    const isConnected = mock.method(
      irSdkWrapperMockObj,
      'isConnected',
      () => true
    );

    const irsdk = new JsIrSdk(irSdkWrapperMockObj, opts);

    assert.strictEqual(start.mock.callCount(), 1);

    context.mock.timers.tick(2500);
    isConnected.mock.mockImplementation(() => false);
    const isInitialized = mock.method(
      irSdkWrapperMockObj,
      'isInitialized',
      () => false
    );
    context.mock.timers.tick(11000);

    assert.strictEqual(start.mock.callCount(), 2);

    isConnected.mock.mockImplementation(() => true);
    isInitialized.mock.mockImplementation(() => true);

    const spy = context.mock.fn();
    irsdk.on('Connected', spy);
    context.mock.timers.tick(2500);

    assert.strictEqual(spy.mock.callCount(), 1);
  });

  it('emits "TelemetryDescription" once after "Connected"', async function (context) {
    context.mock.timers.enable();

    const opts = {
      telemetryUpdateInterval: 1,
      sessionInfoUpdateInterval: 20000,
    };
    const irSdkWrapperMockObj = Object.create(IrSdkWrapper);
    mock.method(irSdkWrapperMockObj, 'updateTelemetry', () => true);
    mock.method(irSdkWrapperMockObj, 'getTelemetryDescription', () => [
      { RPM: 'engine revs per minute' },
    ]);
    mock.method(irSdkWrapperMockObj, 'isConnected', () => true);
    const irsdk = new JsIrSdk(irSdkWrapperMockObj, opts);

    const spy = context.mock.fn();
    irsdk.on('TelemetryDescription', spy);

    context.mock.timers.tick(5);
    assert.strictEqual(spy.mock.callCount(), 1);
    assert.strictEqual(
      spy.mock.calls[0].arguments[0][0].RPM,
      'engine revs per minute'
    );
    context.mock.timers.tick(5);
    assert.strictEqual(spy.mock.callCount(), 1);
  });

  it('emits "Telemetry" when update available', function (context) {
    context.mock.timers.enable();

    const opts = {
      telemetryUpdateInterval: 10,
      sessionInfoUpdateInterval: 20000,
    };
    const irSdkWrapperMockObj = Object.create(IrSdkWrapper);
    mock.method(irSdkWrapperMockObj, 'updateTelemetry', () => true);
    mock.method(irSdkWrapperMockObj, 'getTelemetry', () => ({
      values: { RPM: 1100 },
    }));
    mock.method(irSdkWrapperMockObj, 'isConnected', () => true);
    const irsdk = new JsIrSdk(irSdkWrapperMockObj, opts);

    const spy = context.mock.fn();
    irsdk.on('Telemetry', spy);

    context.mock.timers.tick(12);
    assert.strictEqual(spy.mock.callCount(), 1);
    assert.strictEqual(spy.mock.calls[0].arguments[0].values.RPM, 1100);

    mock.method(irSdkWrapperMockObj, 'updateTelemetry', () => false);
    context.mock.timers.tick(12);

    assert.strictEqual(spy.mock.callCount(), 1);

    mock.method(irSdkWrapperMockObj, 'updateTelemetry', () => true);
    context.mock.timers.tick(12);

    assert.strictEqual(spy.mock.callCount(), 2);
  });

  it('emits "SessionInfo" when update available', function (context) {
    context.mock.timers.enable();
    const opts = { telemetryUpdateInterval: 10, sessionInfoUpdateInterval: 10 };
    const irSdkWrapperMockObj = Object.create(IrSdkWrapper);
    mock.method(irSdkWrapperMockObj, 'updateSessionInfo', () => true);
    mock.method(irSdkWrapperMockObj, 'getSessionInfo', () => {
      return '---\ntype: race\n';
    });
    mock.method(irSdkWrapperMockObj, 'isConnected', () => true);
    const irsdk = new JsIrSdk(irSdkWrapperMockObj, opts);
    const spy = context.mock.fn();
    irsdk.on('SessionInfo', spy);
    context.mock.timers.tick(12);
    assert.strictEqual(spy.mock.callCount(), 1);
    assert.strictEqual(spy.mock.calls[0].arguments[0].data.type, 'race');
    mock.method(irSdkWrapperMockObj, 'updateSessionInfo', () => false);
    context.mock.timers.tick(12);
    assert.strictEqual(spy.mock.callCount(), 1);
    mock.method(irSdkWrapperMockObj, 'updateSessionInfo', () => true);
    context.mock.timers.tick(12);
    assert.strictEqual(spy.mock.callCount(), 2);
  });

  describe('All commands', function () {
    let sendCmd, irsdk;
    beforeEach(function () {
      const irsdkWrapperMockObj = Object.create(IrSdkWrapper);
      sendCmd = mock.method(irsdkWrapperMockObj, 'sendCmd', () => true);
      irsdk = new JsIrSdk(irsdkWrapperMockObj);
    });
    afterEach(function () {
      irsdk._stop();
    });

    describe('.execCmd(cmd, [arg1, arg2, arg3])', function () {
      it('sends arbitrary broadcast message', function () {
        irsdk.execCmd(12, 13, 14, 15);
        assert.strictEqual(sendCmd.mock.callCount(), 1);
        assert.strictEqual(sendCmd.mock.calls[0].arguments[0], 12);
        assert.strictEqual(sendCmd.mock.calls[0].arguments[1], 13);
        assert.strictEqual(sendCmd.mock.calls[0].arguments[2], 14);
        assert.strictEqual(sendCmd.mock.calls[0].arguments[3], 15);
      });
    });

    describe('.reloadTextures()', function () {
      it('sends reload all command', function () {
        irsdk.reloadTextures();
        assert.strictEqual(sendCmd.mock.callCount(), 1);
        assert.strictEqual(sendCmd.mock.calls[0].arguments[0], 7);
        assert.strictEqual(sendCmd.mock.calls[0].arguments[1], 0);
      });
    });

    describe('.reloadTextures(carIdx)', function () {
      it('sends reload car command', function () {
        irsdk.reloadTexture(13);
        assert.strictEqual(sendCmd.mock.callCount(), 1);
        assert.strictEqual(sendCmd.mock.calls[0].arguments[0], 7);
        assert.strictEqual(sendCmd.mock.calls[0].arguments[1], 1);
        assert.strictEqual(sendCmd.mock.calls[0].arguments[2], 13);
      });
    });

    describe('.execChatCmd(cmd, [arg])', function () {
      it('sends chat command when cmd given as integer', function () {
        irsdk.execChatCmd(2);
        assert.strictEqual(sendCmd.mock.callCount(), 1);
        assert.strictEqual(sendCmd.mock.calls[0].arguments[0], 8);
        assert.strictEqual(sendCmd.mock.calls[0].arguments[1], 2);
        assert.strictEqual(sendCmd.mock.calls[0].arguments[2], 0);
      });
      it('sends chat command when cmd given as string', function () {
        irsdk.execChatCmd('cancel');
        assert.strictEqual(sendCmd.mock.callCount(), 1);
        assert.strictEqual(sendCmd.mock.calls[0].arguments[0], 8);
        assert.strictEqual(sendCmd.mock.calls[0].arguments[1], 3);
        assert.strictEqual(sendCmd.mock.calls[0].arguments[2], 0);
      });
    });

    describe('.execChatMacro(num)', function () {
      it('sends chat macro command', function () {
        irsdk.execChatMacro(7);
        assert.strictEqual(sendCmd.mock.callCount(), 1);
        assert.strictEqual(sendCmd.mock.calls[0].arguments[0], 8);
        assert.strictEqual(sendCmd.mock.calls[0].arguments[1], 0);
        assert.strictEqual(sendCmd.mock.calls[0].arguments[2], 7);
      });
    });

    describe('.execPitCmd(cmd, [arg])', function () {
      it('sends command when cmd given as integer', function () {
        irsdk.execPitCmd(1);
        assert.strictEqual(sendCmd.mock.callCount(), 1);
        assert.strictEqual(sendCmd.mock.calls[0].arguments[0], 9);
        assert.strictEqual(sendCmd.mock.calls[0].arguments[1], 1);
        assert.strictEqual(sendCmd.mock.calls[0].arguments[2], 0);
      });
      it('sends command when cmd given as string', function () {
        irsdk.execPitCmd('clearTires');
        assert.strictEqual(sendCmd.mock.callCount(), 1);
        assert.strictEqual(sendCmd.mock.calls[0].arguments[0], 9);
        assert.strictEqual(sendCmd.mock.calls[0].arguments[1], 7);
        assert.strictEqual(sendCmd.mock.calls[0].arguments[2], 0);
      });
      it('passes thru integer argument', function () {
        irsdk.execPitCmd('fuel', 60);
        assert.strictEqual(sendCmd.mock.callCount(), 1);
        assert.strictEqual(sendCmd.mock.calls[0].arguments[0], 9);
        assert.strictEqual(sendCmd.mock.calls[0].arguments[1], 2);
        assert.strictEqual(sendCmd.mock.calls[0].arguments[2], 60);
      });
    });

    describe('.execTelemetryCmd(cmd)', function () {
      it('sends command when cmd given as integer', function () {
        irsdk.execTelemetryCmd(1);
        assert.strictEqual(sendCmd.mock.callCount(), 1);
        assert.strictEqual(sendCmd.mock.calls[0].arguments[0], 10);
        assert.strictEqual(sendCmd.mock.calls[0].arguments[1], 1);
      });
      it('sends command when cmd given as string', function () {
        irsdk.execTelemetryCmd('restart');
        assert.strictEqual(sendCmd.mock.callCount(), 1);
        assert.strictEqual(sendCmd.mock.calls[0].arguments[0], 10);
        assert.strictEqual(sendCmd.mock.calls[0].arguments[1], 2);
      });
    });

    describe('.camControls', function () {
      describe('.setState(state)', function () {
        it('sends state cmd', function () {
          irsdk.camControls.setState(15);
          assert.strictEqual(sendCmd.mock.callCount(), 1);
          assert.strictEqual(sendCmd.mock.calls[0].arguments[0], 2);
          assert.strictEqual(sendCmd.mock.calls[0].arguments[1], 15);
        });
      });
      describe('.switchToCar(carNum, [camGroupNum], [camNum])', function () {
        it('sends switch cmd', function () {
          irsdk.camControls.switchToCar(12);
          assert.strictEqual(sendCmd.mock.callCount(), 1);
          assert.strictEqual(sendCmd.mock.calls[0].arguments[0], 1);
          assert.strictEqual(sendCmd.mock.calls[0].arguments[1], 12);
          assert.strictEqual(sendCmd.mock.calls[0].arguments[2], 0);
          assert.strictEqual(sendCmd.mock.calls[0].arguments[3], 0);
        });
        describe('leading zeros are padded if car num is given as string', function () {
          it('"1" -> 1', function () {
            irsdk.camControls.switchToCar('1');
            assert.strictEqual(sendCmd.mock.callCount(), 1);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[0], 1);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[1], 1);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[2], 0);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[3], 0);
          });
          it('"100" -> 100', function () {
            irsdk.camControls.switchToCar('100');
            assert.strictEqual(sendCmd.mock.callCount(), 1);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[0], 1);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[1], 100);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[2], 0);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[3], 0);
          });
          it('"110" -> 110', function () {
            irsdk.camControls.switchToCar('100');
            assert.strictEqual(sendCmd.mock.callCount(), 1);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[0], 1);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[1], 100);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[2], 0);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[3], 0);
          });
          it('"01" -> 2001', function () {
            irsdk.camControls.switchToCar('01');
            assert.strictEqual(sendCmd.mock.callCount(), 1);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[0], 1);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[1], 2001);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[2], 0);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[3], 0);
          });
          it('"001" -> 3001', function () {
            irsdk.camControls.switchToCar('001');
            assert.strictEqual(sendCmd.mock.callCount(), 1);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[0], 1);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[1], 3001);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[2], 0);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[3], 0);
          });
          it('"011" -> 3011', function () {
            irsdk.camControls.switchToCar('011');
            assert.strictEqual(sendCmd.mock.callCount(), 1);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[0], 1);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[1], 3011);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[2], 0);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[3], 0);
          });
        });
        it('sends focus at cmd', function () {
          irsdk.camControls.switchToCar(-2);
          assert.strictEqual(sendCmd.mock.callCount(), 1);
          assert.strictEqual(sendCmd.mock.calls[0].arguments[0], 1);
          assert.strictEqual(sendCmd.mock.calls[0].arguments[1], -2);
          assert.strictEqual(sendCmd.mock.calls[0].arguments[2], 0);
          assert.strictEqual(sendCmd.mock.calls[0].arguments[3], 0);
        });
        it('switches cam group and cam', function () {
          irsdk.camControls.switchToCar(12, 2, 3);
          assert.strictEqual(sendCmd.mock.callCount(), 1);
          assert.strictEqual(sendCmd.mock.calls[0].arguments[0], 1);
          assert.strictEqual(sendCmd.mock.calls[0].arguments[1], 12);
          assert.strictEqual(sendCmd.mock.calls[0].arguments[2], 2);
          assert.strictEqual(sendCmd.mock.calls[0].arguments[3], 3);
        });
      });
      describe('.switchToPos(carNum, [camGroupNum], [camNum])', function () {
        it('sends switch cmd', function () {
          irsdk.camControls.switchToPos(12);
          assert.strictEqual(sendCmd.mock.callCount(), 1);
          assert.strictEqual(sendCmd.mock.calls[0].arguments[0], 0);
          assert.strictEqual(sendCmd.mock.calls[0].arguments[1], 12);
          assert.strictEqual(sendCmd.mock.calls[0].arguments[2], 0);
          assert.strictEqual(sendCmd.mock.calls[0].arguments[3], 0);
        });
        it('sends focus at cmd"', function () {
          irsdk.camControls.switchToPos(-2);
          assert.strictEqual(sendCmd.mock.callCount(), 1);
          assert.strictEqual(sendCmd.mock.calls[0].arguments[0], 0);
          assert.strictEqual(sendCmd.mock.calls[0].arguments[1], -2);
          assert.strictEqual(sendCmd.mock.calls[0].arguments[2], 0);
          assert.strictEqual(sendCmd.mock.calls[0].arguments[3], 0);
        });
        it('switches cam group and cam', function () {
          irsdk.camControls.switchToPos(12, 2, 3);
          assert.strictEqual(sendCmd.mock.callCount(), 1);
          assert.strictEqual(sendCmd.mock.calls[0].arguments[0], 0);
          assert.strictEqual(sendCmd.mock.calls[0].arguments[1], 12);
          assert.strictEqual(sendCmd.mock.calls[0].arguments[2], 2);
          assert.strictEqual(sendCmd.mock.calls[0].arguments[3], 3);
        });
      });

      describe('.playbackControls', function () {
        describe('.play()', function () {
          it('sends cmd', function () {
            irsdk.playbackControls.play();
            assert.strictEqual(sendCmd.mock.callCount(), 1);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[0], 3);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[1], 1);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[2], 0);
          });
        });
        describe('.pause()', function () {
          it('sends cmd', function () {
            irsdk.playbackControls.pause();
            assert.strictEqual(sendCmd.mock.callCount(), 1);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[0], 3);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[1], 0);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[2], 0);
          });
        });
        describe('.fastForward([speed])', function () {
          it('sends cmd', function () {
            irsdk.playbackControls.fastForward();
            assert.strictEqual(sendCmd.mock.callCount(), 1);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[0], 3);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[1], 2);
          });
          it('passes optional argument', function () {
            irsdk.playbackControls.fastForward(16);
            assert.strictEqual(sendCmd.mock.callCount(), 1);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[0], 3);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[1], 16);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[2], 0);
          });
        });
        describe('.rewind([speed])', function () {
          it('sends cmd', function () {
            irsdk.playbackControls.rewind();
            assert.strictEqual(sendCmd.mock.callCount(), 1);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[0], 3);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[1], -2);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[2], 0);
          });
          it('passes optional argument', function () {
            irsdk.playbackControls.rewind(16);
            assert.strictEqual(sendCmd.mock.callCount(), 1);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[0], 3);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[1], -16);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[2], 0);
          });
        });
        describe('.slowForward([divider])', function () {
          it('sends cmd', function () {
            irsdk.playbackControls.slowForward();
            assert.strictEqual(sendCmd.mock.callCount(), 1);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[0], 3);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[1], 1);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[2], 1);
          });
          it('passes optional argument', function () {
            irsdk.playbackControls.slowForward(16);
            assert.strictEqual(sendCmd.mock.callCount(), 1);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[0], 3);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[1], 15);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[2], 1);
          });
        });
        describe('.slowBackward([divider])', function () {
          it('sends cmd', function () {
            irsdk.playbackControls.slowBackward();
            assert.strictEqual(sendCmd.mock.callCount(), 1);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[0], 3);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[1], -1);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[2], 1);
          });
          it('passes optional argument', function () {
            irsdk.playbackControls.slowBackward(16);
            assert.strictEqual(sendCmd.mock.callCount(), 1);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[0], 3);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[1], -15);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[2], 1);
          });
        });

        describe('.searchTs(sessionNum, sessionTimeMS)', function () {
          it('sends cmd with args', function () {
            irsdk.playbackControls.searchTs(1, 5000);
            assert.strictEqual(sendCmd.mock.callCount(), 1);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[0], 12);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[1], 1);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[2], 5000);
          });
        });
        describe('.searchFrame(frameNum, rpyPosMode)', function () {
          it('sends cmd with args', function () {
            irsdk.playbackControls.searchFrame(5, 1);
            assert.strictEqual(sendCmd.mock.callCount(), 1);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[0], 4);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[1], 1);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[2], 5);
          });
          it('rpyPosMode can be given as string', function () {
            irsdk.playbackControls.searchFrame(17, 'end');
            assert.strictEqual(sendCmd.mock.callCount(), 1);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[0], 4);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[1], 2);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[2], 17);
          });
        });
        describe('.search(searchMode)', function () {
          it('sends cmd with args', function () {
            irsdk.playbackControls.search(6);
            assert.strictEqual(sendCmd.mock.callCount(), 1);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[0], 5);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[1], 6);
          });
          it('searchMode can be given as string', function () {
            irsdk.playbackControls.search('prevIncident');
            assert.strictEqual(sendCmd.mock.callCount(), 1);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[0], 5);
            assert.strictEqual(sendCmd.mock.calls[0].arguments[1], 8);
          });
        });
      });
    });
  });
});
