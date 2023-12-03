const mock = {
  start() {
    return true;
  },
  shutdown() {},
  isInitialized() {
    return true;
  },
  isConnected() {
    return false;
  },
  updateSessionInfo() {
    return false;
  },
  getSessionInfo() {},
  updateTelemetry() {
    return false;
  },
  getTelemetryDescription() {
    return { telemetry: "is telemetry" };
  },
  getTelemetry() {
    return {};
  },
  sendCmd() {},
};

module.exports = mock;
