const EventEmitter = require("node:events");
const stringToEnum = require("./utils/stringToEnum");
const createSessionInfoParser = require("./utils/createSessionInfoParser");
const padCarNum = require("./utils/padCarNum");
const IrSdkConsts = require("./consts/IrSdkConsts");
const BroadcastMsg = IrSdkConsts.BroadcastMsg;

/**
  JsIrSdk is javascript implementation of iRacing SDK.

  Don't use constructor directly, use {@link module:irsdk.getInstance}.

  @class
  @extends events.EventEmitter
  @see {@link https://nodejs.org/api/events.html#events_class_eventemitter|EventEmitter API}
  @alias iracing
  @fires iracing#Connected
  @fires iracing#Disconnected
  @fires iracing#Telemetry
  @fires iracing#TelemetryDescription
  @fires iracing#SessionInfo

  @example const iracing = require('iracing-sdk-js').getInstance()
*/
class JsIrSdk extends EventEmitter {
  constructor(IrSdkWrapper, opts) {
    super();

    this.IrSdkWrapper = IrSdkWrapper;
    opts = opts || {};

    /** Execute any of available commands, excl. FFB command
    @method
    @param {Integer} msgId Message id
    @param {Integer} [arg1] 1st argument
    @param {Integer} [arg2] 2nd argument
    @param {Integer} [arg3] 3rd argument
  */
    this.execCmd = this.IrSdkWrapper.sendCmd;

    /**
   Parser for SessionInfo YAML
   @callback iracing~sessionInfoParser
   @param {String} sessionInfo SessionInfo YAML
   @returns {Object} parsed session info
  */
    this.sessionInfoParser = opts.sessionInfoParser;
    if (!this.sessionInfoParser) {
      this.sessionInfoParser = createSessionInfoParser();
    }

    this.connected = false; // if irsdk is available

    this.startIntervalId = setInterval(() => {
      if (!this.IrSdkWrapper.isInitialized()) {
        this.IrSdkWrapper.start();
      }
    }, 10000);

    this.IrSdkWrapper.start();

    /** Latest telemetry, may be null or undefined

  */
    this.telemetry = null;

    /** Latest telemetry, may be null or undefined

  */
    this.telemetryDescription = null;

    /** Latest telemetry, may be null or undefined

  */
    this.sessionInfo = null;

    this.telemetryIntervalId = setInterval(() => {
      this.checkConnection();
      if (this.connected && IrSdkWrapper.updateTelemetry()) {
        var now = new Date(); // date gives ms accuracy
        this.telemetry = IrSdkWrapper.getTelemetry();
        // replace ctime timestamp
        this.telemetry.timestamp = now;
        setImmediate(() => {
          if (!this.telemetryDescription) {
            this.telemetryDescription = IrSdkWrapper.getTelemetryDescription();
            /**
            Telemetry description, contains description of available telemetry values
            @event iracing#TelemetryDescription
            @type Object
            @example
            * iracing.on('TelemetryDescription', function (data) {
            *   console.log(evt)
            * })
          */
            this.emit("update", {
              type: "TelemetryDescription",
              data: this.telemetryDescription,
              timestamp: now,
            });
          }
          /**
          Telemetry update
          @event iracing#Telemetry
          @type Object
          @example
          * iracing.on('Telemetry', function (evt) {
          *   console.log(evt)
          * })
        */
          this.emit("update", {
            type: "Telemetry",
            data: this.telemetry.values,
            timestamp: now,
          });
        });
      }
    }, opts.telemetryUpdateInterval);

    this.sessionInfoIntervalId = setInterval(() => {
      this.checkConnection();
      if (this.connected && IrSdkWrapper.updateSessionInfo()) {
        var now = new Date();
        var sessionInfo = IrSdkWrapper.getSessionInfo();
        var doc;
        setImmediate(() => {
          try {
            doc = this.sessionInfoParser(sessionInfo);
          } catch (ex) {
            // TODO: log faulty yaml
            console.error("js-irsdk: yaml error: \n" + ex);
          }

          if (doc) {
            this.sessionInfo = { timestamp: now, data: doc };
            /**
            SessionInfo update
            @event iracing#SessionInfo
            @type Object
            @example
            * iracing.on('SessionInfo', function (evt) {
            *   console.log(evt)
            * })
          */
            this.emit("update", {
              type: "SessionInfo",
              data: this.sessionInfo.data,
              timestamp: now,
            });
          }
        });
      }
    }, opts.sessionInfoUpdateInterval);

    /**
    any update event
    @event iracing#update
    @type Object
    @example
    * iracing.on('update', function (evt) {
    *   console.log(evt)
    * })
    */
    this.on("update", (evt) => {
      // fire old events as well.
      const timestamp = evt.timestamp;
      const data = evt.data;
      const type = evt.type;

      switch (type) {
        case "SessionInfo":
          this.emit("SessionInfo", { timestamp, data });
          break;
        case "Telemetry":
          this.emit("Telemetry", { timestamp, values: data });
          break;
        case "TelemetryDescription":
          this.emit("TelemetryDescription", data);
          break;
        case "Connected":
          this.emit("Connected");
          break;
        case "Disconnected":
          this.emit("Disconnected");
          break;
        default:
          break;
      }
    });
  }

  checkConnection() {
    if (this.IrSdkWrapper.isInitialized() && this.IrSdkWrapper.isConnected()) {
      if (!this.connected) {
        this.connected = true;
        /**
        iRacing, sim, is started
        @event iracing#Connected
        @example
        * iracing.on('Connected', function (evt) {
        *   console.log(evt)
        * })
      */
        this.emit("update", { type: "Connected", timestamp: new Date() });
      }
    } else {
      if (this.connected) {
        this.connected = false;
        /**
        iRacing, sim, was closed
        @event iracing#Disconnected
        @example
        * iracing.on('Disconnected', function (evt) {
        *   console.log(evt)
        * })
      */
        this.emit("update", { type: "Disconnected", timestamp: new Date() });

        this.IrSdkWrapper.shutdown();
        this.telemetryDescription = null;
      }
    }
  }

  /** iRacing SDK related constants
    @type IrSdkConsts
    @instance
  */
  Consts = IrSdkConsts;

  /** Camera controls
    @type {Object}
  */
  camControls = {
    /** Change camera tool state
      @method
      @param {IrSdkConsts.CameraState} state new state
      @example
      * // hide UI and enable mouse aim
      * var States = iracing.Consts.CameraState
      * var state = States.CamToolActive | States.UIHidden | States.UseMouseAimMode
      * iracing.camControls.setState(state)
    */
    setState: (state) => {
      this.execCmd(BroadcastMsg.CamSetState, state);
    },
    /** Switch camera, focus on car
      @method
      @param {Integer|String|IrSdkConsts.CamFocusAt} carNum Car to focus on
      @param {Integer} [camGroupNum] Select camera group
      @param {Integer} [camNum] Select camera

      @example
      * // show car #2
      * iracing.camControls.switchToCar(2)
      @example
      * // show car #02
      * iracing.camControls.switchToCar('02')
      @example
      * // show leader
      * iracing.camControls.switchToCar('leader')
      @example
      * // show car #2 using cam group 3
      * iracing.camControls.switchToCar(2, 3)
    */
    switchToCar: (carNum, camGroupNum, camNum) => {
      camGroupNum = camGroupNum | 0;
      camNum = camNum | 0;

      if (typeof carNum === "string") {
        if (isNaN(parseInt(carNum))) {
          carNum = stringToEnum(carNum, IrSdkConsts.CamFocusAt);
        } else {
          carNum = padCarNum(carNum);
        }
      }
      if (Number.isInteger(carNum)) {
        this.execCmd(BroadcastMsg.CamSwitchNum, carNum, camGroupNum, camNum);
      }
    },
    /** Switch camera, focus on position
      @method
      @param {Integer|IrSdkConsts.CamFocusAt} position Position to focus on
      @param {Integer} [camGroupNum] Select camera group
      @param {Integer} [camNum] Select camera

      @example iracing.camControls.switchToPos(2) // show P2
    */
    switchToPos: (position, camGroupNum, camNum) => {
      camGroupNum = camGroupNum | 0;
      camNum = camNum | 0;

      if (typeof position === "string") {
        position = stringToEnum(position, IrSdkConsts.CamFocusAt);
      }
      if (Number.isInteger(position)) {
        this.execCmd(BroadcastMsg.CamSwitchPos, position, camGroupNum, camNum);
      }
    },
  };

  /** Replay and playback controls
    @type {Object}
  */
  playbackControls = {
    /** Play replay
      @method
      @example iracing.playbackControls.play()
    */
    play: () => {
      this.execCmd(BroadcastMsg.ReplaySetPlaySpeed, 1, 0);
    },
    /** Pause replay
      @method
      @example iracing.playbackControls.pause()
    */
    pause: () => {
      this.execCmd(BroadcastMsg.ReplaySetPlaySpeed, 0, 0);
    },
    /** fast-forward replay
      @method
      @param {Integer} [speed=2] FF speed, something between 2-16 works
      @example iracing.playbackControls.fastForward() // double speed FF
    */
    fastForward: (speed) => {
      speed = speed || 2;
      this.execCmd(BroadcastMsg.ReplaySetPlaySpeed, speed, 0);
    },
    /** rewind replay
      @method
      @param {Integer} [speed=2] RW speed, something between 2-16 works
      @example iracing.playbackControls.rewind() // double speed RW
    */
    rewind: (speed) => {
      speed = speed || 2;
      this.execCmd(BroadcastMsg.ReplaySetPlaySpeed, -1 * speed, 0);
    },
    /** slow-forward replay, slow motion
      @method
      @param {Integer} [divider=2] divider of speed, something between 2-17 works
      @example iracing.playbackControls.slowForward(2) // half speed
    */
    slowForward: (divider) => {
      divider = divider || 2;
      divider -= 1;
      this.execCmd(BroadcastMsg.ReplaySetPlaySpeed, divider, 1);
    },
    /** slow-backward replay, reverse slow motion
      @method
      @param {Integer} [divider=2] divider of speed, something between 2-17 works
      @example iracing.playbackControls.slowBackward(2) // half speed RW
    */
    slowBackward: (divider) => {
      divider = divider || 2;
      divider -= 1;
      this.execCmd(BroadcastMsg.ReplaySetPlaySpeed, -1 * divider, 1);
    },
    /** Search things from replay
      @method
      @param {IrSdkConsts.RpySrchMode} searchMode what to search
      @example iracing.playbackControls.search('nextIncident')
    */
    search: (searchMode) => {
      if (typeof searchMode === "string") {
        searchMode = stringToEnum(searchMode, IrSdkConsts.RpySrchMode);
      }
      if (Number.isInteger(searchMode)) {
        this.execCmd(BroadcastMsg.ReplaySearch, searchMode);
      }
    },
    /** Search timestamp
      @method
      @param {Integer} sessionNum Session number
      @param {Integer} sessionTimeMS Session time in milliseconds
      @example
      * // jump to 2nd minute of 3rd session
      * iracing.playbackControls.searchTs(2, 2*60*1000)
    */
    searchTs: (sessionNum, sessionTimeMS) => {
      this.execCmd(
        BroadcastMsg.ReplaySearchSessionTime,
        sessionNum,
        sessionTimeMS
      );
    },
    /** Go to frame. Frame counting can be relative to begin, end or current.
      @method
      @param {Integer} frameNum Frame number
      @param {IrSdkConsts.RpyPosMode} rpyPosMode Is frame number relative to begin, end or current frame
      @example iracing.playbackControls.searchFrame(1, 'current') // go to 1 frame forward
    */
    searchFrame: (frameNum, rpyPosMode) => {
      if (typeof rpyPosMode === "string") {
        rpyPosMode = stringToEnum(rpyPosMode, IrSdkConsts.RpyPosMode);
      }
      if (Number.isInteger(rpyPosMode)) {
        this.execCmd(BroadcastMsg.ReplaySetPlayPosition, rpyPosMode, frameNum);
      }
    },
  };

  /** Reload all car textures
    @method
    @example iracing.reloadTextures() // reload all paints
  */
  reloadTextures() {
    this.execCmd(
      BroadcastMsg.ReloadTextures,
      IrSdkConsts.ReloadTexturesMode.All
    );
  }

  /** Reload car's texture
    @method
    @param {Integer} carIdx car to reload
    @example iracing.reloadTexture(1) // reload paint of carIdx=1
  */
  reloadTexture(carIdx) {
    this.execCmd(
      BroadcastMsg.ReloadTextures,
      IrSdkConsts.ReloadTexturesMode.CarIdx,
      carIdx
    );
  }

  /** Execute chat command
    @param {IrSdkConsts.ChatCommand} cmd
    @param {Integer} [arg] Command argument, if needed
    @example iracing.execChatCmd('cancel') // close chat window
  */
  execChatCmd(cmd, arg) {
    arg = arg || 0;
    if (typeof cmd === "string") {
      cmd = stringToEnum(cmd, IrSdkConsts.ChatCommand);
    }
    if (Number.isInteger(cmd)) {
      this.execCmd(BroadcastMsg.ChatComand, cmd, arg);
    }
  }

  /** Execute chat macro
    @param {Integer} num Macro's number (0-15)
    @example iracing.execChatMacro(1) // macro 1
  */
  execChatMacro(num) {
    this.execChatCmd("macro", num);
  }

  /** Execute pit command
    @param {IrSdkConsts.PitCommand} cmd
    @param {Integer} [arg] Command argument, if needed
    @example
    * // full tank, no tires, no tear off
    * iracing.execPitCmd('clear')
    * iracing.execPitCmd('fuel', 999) // 999 liters
    * iracing.execPitCmd('lf') // new left front
    * iracing.execPitCmd('lr', 200) // new left rear, 200 kPa
  */
  execPitCmd(cmd, arg) {
    arg = arg || 0;
    if (typeof cmd === "string") {
      cmd = stringToEnum(cmd, IrSdkConsts.PitCommand);
    }
    if (Number.isInteger(cmd)) {
      this.execCmd(BroadcastMsg.PitCommand, cmd, arg);
    }
  }

  /** Control telemetry logging (ibt file)
    @param {IrSdkConsts.TelemCommand} cmd Command: start/stop/restart
    @example iracing.execTelemetryCmd('restart')
  */
  execTelemetryCmd(cmd) {
    if (typeof cmd === "string") {
      cmd = stringToEnum(cmd, IrSdkConsts.TelemCommand);
    }
    if (Number.isInteger(cmd)) {
      this.execCmd(BroadcastMsg.TelemCommand, cmd);
    }
  }

  /**
    Stops JsIrSdk, no new events are fired after calling this
    @method
    @private
  */
  _stop() {
    clearInterval(this.telemetryIntervalId);
    clearInterval(this.sessionInfoIntervalId);
    clearInterval(this.startIntervalId);
    this.IrSdkWrapper.shutdown();
  }
}

module.exports = JsIrSdk;
