const sandboxed = require("sandboxed-module");
const { describe, it } = require("node:test");
const assert = require("node:assert");

describe("iracing-sdk-js", function () {
  describe("#init", function () {
    it("instantiates JsIrSdk once", function (context) {
      const jsIrSdkSpy = context.mock.fn();
      const nodeWrapperMock = {};
      const opts = {
        telemetryUpdateInterval: 1,
        sessionInfoUpdateInterval: 2,
      };
      const nodeIrSdk = sandboxed.require("../src/iracing-sdk-js", {
        requires: {
          "../build/Release/IrSdkNodeBindings.node": nodeWrapperMock,
          "./JsIrSdk": jsIrSdkSpy,
        },
      });
      nodeIrSdk.init(opts);
      nodeIrSdk.init(opts);
      assert.strictEqual(jsIrSdkSpy.mock.callCount(), 1);
      assert.strictEqual(
        jsIrSdkSpy.mock.calls[0].arguments[0],
        nodeWrapperMock
      );
      assert.strictEqual(
        jsIrSdkSpy.mock.calls[0].arguments[1].telemetryUpdateInterval,
        opts.telemetryUpdateInterval
      );
      assert.strictEqual(
        jsIrSdkSpy.mock.calls[0].arguments[1].sessionInfoUpdateInterval,
        opts.sessionInfoUpdateInterval
      );
    });
  });
  describe("#getInstance", function () {
    it("gives JsIrSdk singleton", function () {
      const nodeIrSdk = require("../src/iracing-sdk-js");
      const instance1 = nodeIrSdk.getInstance();
      const instance2 = nodeIrSdk.getInstance();
      assert.strictEqual(instance1, instance2);
      instance2._stop();
    });
  });
});
