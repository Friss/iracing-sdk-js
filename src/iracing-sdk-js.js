const IrSdkNodeWrapper =
  require('../build/Debug/IrSdkNodeBindings.node') ||
  require('../build/Release/IrSdkNodeBindings.node');
const JsIrSdk = require('./JsIrSdk');

/**
  @module irsdk
*/
module.exports = {};

let instance;

/**
  Initialize JsIrSdk, can be done once before using getInstance first time.
  @function
  @static
  @param {Object} [opts] Options
  @param {Integer} [opts.telemetryUpdateInterval=0] Telemetry update interval, milliseconds
  @param {Integer} [opts.sessionInfoUpdateInterval=0] SessionInfo update interval, milliseconds
  @param {iracing~sessionInfoParser} [opts.sessionInfoParser] Custom parser for session info
  @returns {iracing} Running instance of JsIrSdk
  @example
  * const irsdk = require('iracing-sdk-js')
  * // look for telemetry updates only once per 100 ms
  * const iracing = irsdk.init({telemetryUpdateInterval: 100})
*/
var init = (module.exports.init = function (opts) {
  if (!instance) {
    instance = new JsIrSdk(
      IrSdkNodeWrapper,
      Object.assign(
        {
          telemetryUpdateInterval: 0,
          sessionInfoUpdateInterval: 0,
        },
        opts
      )
    );
  }
  return instance;
});

/**
  Get initialized instance of JsIrSdk
  @function
  @static
  @returns {iracing} Running instance of JsIrSdk
  @example
  * const irsdk = require('iracing-sdk-js')
  * const iracing = irsdk.getInstance()
*/
module.exports.getInstance = function () {
  return init();
};
