/// <reference types="node" />
import { EventEmitter } from 'events';

declare module 'iracing-sdk-js' {
  export interface InitOptions {
    telemetryUpdateInterval?: number;
    sessionInfoUpdateInterval?: number;
    sessionInfoParser?: (sessionInfo: string) => SessionInfoData;
  }

  // String literal types for various enums
  export type TrackSurface =
    | 'NotInWorld'
    | 'OffTrack'
    | 'InPitStall'
    | 'AproachingPits'
    | 'OnTrack';

  export type TrackSurfaceMaterial =
    | 'SurfaceNotInWorld'
    | 'UndefinedMaterial'
    | 'Asphalt1Material'
    | 'Asphalt2Material'
    | 'Asphalt3Material'
    | 'Asphalt4Material'
    | 'Concrete1Material'
    | 'Concrete2Material'
    | 'RacingDirt1Material'
    | 'RacingDirt2Material'
    | 'Paint1Material'
    | 'Paint2Material'
    | 'Rumble1Material'
    | 'Rumble2Material'
    | 'Rumble3Material'
    | 'Rumble4Material'
    | 'Grass1Material'
    | 'Grass2Material'
    | 'Grass3Material'
    | 'Grass4Material'
    | 'Dirt1Material'
    | 'Dirt2Material'
    | 'Dirt3Material'
    | 'Dirt4Material'
    | 'SandMaterial'
    | 'Gravel1Material'
    | 'Gravel2Material'
    | 'GrasscreteMaterial'
    | 'AstroturfMaterial';

  export type SessionState =
    | 'Invalid'
    | 'GetInCar'
    | 'Warmup'
    | 'ParadeLaps'
    | 'Racing'
    | 'Checkered'
    | 'CoolDown';

  export type SessionFlag =
    | 'OneLapToGreen'
    | 'Servicible'
    | 'StartHidden'
    | 'Checkered'
    | 'White'
    | 'Green'
    | 'Yellow'
    | 'Red'
    | 'Blue'
    | 'Debris'
    | 'Crossed'
    | 'YellowWaving'
    | 'GreenHeld'
    | 'TenToGo'
    | 'FiveToGo'
    | 'RandomWaving'
    | 'Caution'
    | 'CautionWaving'
    | 'Black'
    | 'Disqualify'
    | 'Furled'
    | 'DQScoringInvalid'
    | 'Repair'
    | 'StartReady'
    | 'StartSet'
    | 'StartGo';

  export type PitServiceStatus =
    | 'PitSvNone'
    | 'PitSvInProgress'
    | 'PitSvComplete'
    | 'PitSvTooFarLeft'
    | 'PitSvTooFarRight'
    | 'PitSvTooFarForward'
    | 'PitSvTooFarBack'
    | 'PitSvBadAngle'
    | 'PitSvCantFixThat';

  export type CarLeftRight =
    | 'LROff'
    | 'LRClear'
    | 'LRCarLeft'
    | 'LRCarRight'
    | 'LRCarLeftRight'
    | 'LR2CarsLeft'
    | 'LR2CarsRight';

  export type TrackWetness =
    | 'UNKNOWN'
    | 'Dry'
    | 'MostlyDry'
    | 'VeryLightlyWet'
    | 'LightlyWet'
    | 'ModeratelyWet'
    | 'VeryWet'
    | 'ExtremelyWet';

  export type CameraState =
    | 'IsSessionScreen'
    | 'IsScenicActive'
    | 'CamToolActive'
    | 'UIHidden'
    | 'UseAutoShotSelection'
    | 'UseTemporaryEdits'
    | 'UseKeyAcceleration'
    | 'UseKey10xAcceleration'
    | 'UseMouseAimMode';

  export type EngineWarning =
    | 'WaterTempWarning'
    | 'FuelPressureWarning'
    | 'OilPressureWarning'
    | 'EngineStalled'
    | 'PitSpeedLimiter'
    | 'RevLimiterActive'
    | 'OilTempWarning'
    | 'MandRepNeeded'
    | 'OptRepNeeded';

  export type PaceMode =
    | 'PaceModeSingleFileStart'
    | 'PaceModeDoubleFileStart'
    | 'PaceModeSingleFileRestart'
    | 'PaceModeDoubleFileRestart'
    | 'PaceModeNotPacing';

  export type IncidentType =
    | 'NoPenalty(0x)'
    | 'OutOfControl(2x)'
    | 'OffTrack(1x)'
    | 'Contact(0x)'
    | 'Contact(2x)'
    | 'CarContact(0x)'
    | 'CarContact(4x)';

  export interface TelemetryValues {
    // Session Data
    SessionTime: number;
    SessionTick: number;
    SessionNum: number;
    SessionState: SessionState;
    SessionUniqueID: number;
    SessionFlags: SessionFlag[];

    // Player Data
    PlayerCarPosition: number;
    PlayerCarClassPosition: number;
    PlayerTrackSurface: TrackSurface;
    PlayerCarIdx: number;

    // Controls Data
    SteeringWheelAngle: number;
    Throttle: number;
    Brake: number;
    Clutch: number;
    Gear: number;
    RPM: number;

    // Physics Data
    Speed: number;
    Yaw: number;
    Pitch: number;
    Roll: number;
    VertAccel: number;
    LatAccel: number;
    LongAccel: number;

    // Environment Data
    TrackTemp: number;
    AirTemp: number;
    TrackWetness: TrackWetness;
    WindVel: number;
    WindDir: number;

    // Additional telemetry fields
    SessionTimeRemain: number;
    SessionLapsRemain: number;
    SessionLapsRemainEx: number;
    SessionTimeTotal: number;
    SessionLapsTotal: number;
    SessionJokerLapsRemain: number;
    SessionOnJokerLap: boolean;
    SessionTimeOfDay: number;
    RadioTransmitCarIdx: number;
    RadioTransmitRadioIdx: number;
    RadioTransmitFrequencyIdx: number;
    DisplayUnits: number;
    DriverMarker: boolean;
    PushToTalk: boolean;
    PushToPass: boolean;
    ManualBoost: boolean;
    ManualNoBoost: boolean;
    IsOnTrack: boolean;
    IsReplayPlaying: boolean;
    ReplayFrameNum: number;
    ReplayFrameNumEnd: number;
    IsDiskLoggingEnabled: boolean;
    IsDiskLoggingActive: boolean;
    FrameRate: number;
    CpuUsageFG: number;
    GpuUsage: number;
    ChanAvgLatency: number;
    ChanLatency: number;
    ChanQuality: number;
    ChanPartnerQuality: number;
    CpuUsageBG: number;
    ChanClockSkew: number;
    MemPageFaultSec: number;
    MemSoftPageFaultSec: number;
    PlayerCarClass: number;
    PlayerTrackSurfaceMaterial: TrackSurfaceMaterial;
    PlayerCarTeamIncidentCount: number;
    PlayerCarMyIncidentCount: number;
    PlayerCarDriverIncidentCount: number;
    PlayerCarWeightPenalty: number;
    PlayerCarPowerAdjust: number;
    PlayerCarDryTireSetLimit: number;
    PlayerCarTowTime: number;
    PlayerCarInPitStall: boolean;
    PlayerCarPitSvStatus: PitServiceStatus;
    PlayerTireCompound: number;
    PlayerFastRepairsUsed: number;
    CarIdxLap: number[];
    CarIdxLapCompleted: number[];
    CarIdxLapDistPct: number[];
    CarIdxTrackSurface: TrackSurface[];
    CarIdxTrackSurfaceMaterial: TrackSurfaceMaterial[];
    CarIdxOnPitRoad: boolean[];
    CarIdxPosition: number[];
    CarIdxClassPosition: number[];
    CarIdxClass: number[];
    CarIdxF2Time: number[];
    CarIdxEstTime: number[];
    CarIdxLastLapTime: number[];
    CarIdxBestLapTime: number[];
    CarIdxBestLapNum: number[];
    CarIdxTireCompound: number[];
    CarIdxQualTireCompound: number[];
    CarIdxQualTireCompoundLocked: boolean[];
    CarIdxFastRepairsUsed: number[];
    CarIdxSessionFlags: SessionFlag[][];
    PaceMode: PaceMode;
    CarIdxPaceLine: number[];
    CarIdxPaceRow: number[];
    CarIdxPaceFlags: string[][];
    OnPitRoad: boolean;
    CarIdxSteer: number[];
    CarIdxRPM: number[];
    CarIdxGear: number[];
    PlayerCarSLFirstRPM: number;
    PlayerCarSLShiftRPM: number;
    PlayerCarSLLastRPM: number;
    PlayerCarSLBlinkRPM: number;
    Lap: number;
    LapCompleted: number;
    LapDist: number;
    LapDistPct: number;
    RaceLaps: number;
    CarDistAhead: number;
    CarDistBehind: number;
    LapBestLap: number;
    LapBestLapTime: number;
    LapLastLapTime: number;
    LapCurrentLapTime: number;
    LapLasNLapSeq: number;
    LapLastNLapTime: number;
    LapBestNLapLap: number;
    LapBestNLapTime: number;
    LapDeltaToBestLap: number;
    LapDeltaToBestLap_DD: number;
    LapDeltaToBestLap_OK: boolean;
    LapDeltaToOptimalLap: number;
    LapDeltaToOptimalLap_DD: number;
    LapDeltaToOptimalLap_OK: boolean;
    LapDeltaToSessionBestLap: number;
    LapDeltaToSessionBestLap_DD: number;
    LapDeltaToSessionBestLap_OK: boolean;
    LapDeltaToSessionOptimalLap: number;
    LapDeltaToSessionOptimalLap_DD: number;
    LapDeltaToSessionOptimalLap_OK: boolean;
    LapDeltaToSessionLastlLap: number;
    LapDeltaToSessionLastlLap_DD: number;
    LapDeltaToSessionLastlLap_OK: boolean;
    YawNorth: number;
    EnterExitReset: number;
    TrackTempCrew: number;
    Skies: number;
    AirDensity: number;
    AirPressure: number;
    RelativeHumidity: number;
    FogLevel: number;
    Precipitation: number;
    SolarAltitude: number;
    SolarAzimuth: number;
    WeatherDeclaredWet: boolean;
    SteeringFFBEnabled: boolean;
    DCLapStatus: number;
    DCDriversSoFar: number;
    OkToReloadTextures: boolean;
    LoadNumTextures: boolean;
    CarLeftRight: CarLeftRight;
    PitsOpen: boolean;
    VidCapEnabled: boolean;
    VidCapActive: boolean;
    PlayerIncidents: IncidentType;
    PitRepairLeft: number;
    PitOptRepairLeft: number;
    PitstopActive: boolean;
    FastRepairUsed: number;
    FastRepairAvailable: number;
    LFTiresUsed: number;
    RFTiresUsed: number;
    LRTiresUsed: number;
    RRTiresUsed: number;
    LeftTireSetsUsed: number;
    RightTireSetsUsed: number;
    FrontTireSetsUsed: number;
    RearTireSetsUsed: number;
    TireSetsUsed: number;
    LFTiresAvailable: number;
    RFTiresAvailable: number;
    LRTiresAvailable: number;
    RRTiresAvailable: number;
    LeftTireSetsAvailable: number;
    RightTireSetsAvailable: number;
    FrontTireSetsAvailable: number;
    RearTireSetsAvailable: number;
    TireSetsAvailable: number;
    CamCarIdx: number;
    CamCameraNumber: number;
    CamGroupNumber: number;
    CamCameraState: CameraState[];
    IsOnTrackCar: boolean;
    IsInGarage: boolean;
    SteeringWheelAngleMax: number;
    ShiftPowerPct: number;
    ShiftGrindRPM: number;
    ThrottleRaw: number;
    BrakeRaw: number;
    ClutchRaw: number;
    HandbrakeRaw: number;
    BrakeABSactive: boolean;
    Shifter: number;
    EngineWarnings: EngineWarning[];
    FuelLevelPct: number;
    PitSvFlags: string[];
    PitSvLFP: number;
    PitSvRFP: number;
    PitSvLRP: number;
    PitSvRRP: number;
    PitSvFuel: number;
    PitSvTireCompound: number;
    CarIdxP2P_Status: boolean[];
    CarIdxP2P_Count: number[];
    P2P_Status: boolean;
    P2P_Count: number;
    SteeringWheelPctTorque: number;
    SteeringWheelPctTorqueSign: number;
    SteeringWheelPctTorqueSignStops: number;
    SteeringWheelPctIntensity: number;
    SteeringWheelPctSmoothing: number;
    SteeringWheelPctDamper: number;
    SteeringWheelLimiter: number;
    SteeringWheelMaxForceNm: number;
    SteeringWheelPeakForceNm: number;
    SteeringWheelUseLinear: boolean;
    ShiftIndicatorPct: number;
    ReplayPlaySpeed: number;
    ReplayPlaySlowMotion: boolean;
    ReplaySessionTime: number;
    ReplaySessionNum: number;
    TireLF_RumblePitch: number;
    TireRF_RumblePitch: number;
    TireLR_RumblePitch: number;
    TireRR_RumblePitch: number;
    IsGarageVisible: boolean;
    SteeringWheelTorque_ST: number[];
    SteeringWheelTorque: number;
    VelocityZ_ST: number[];
    VelocityY_ST: number[];
    VelocityX_ST: number[];
    VelocityZ: number;
    VelocityY: number;
    VelocityX: number;
    YawRate_ST: number[];
    PitchRate_ST: number[];
    RollRate_ST: number[];
    YawRate: number;
    PitchRate: number;
    RollRate: number;
    VertAccel_ST: number[];
    LatAccel_ST: number[];
    LongAccel_ST: number[];
    dcStarter: boolean;
    dcPitSpeedLimiterToggle: boolean;
    dcTractionControlToggle: boolean;
    dcHeadlightFlash: boolean;
    dcLowFuelAccept: boolean;
    dpRFTireChange: number;
    dpLFTireChange: number;
    dpRRTireChange: number;
    dpLRTireChange: number;
    dpFuelFill: number;
    dpFuelAutoFillEnabled: number;
    dpFuelAutoFillActive: number;
    dpWindshieldTearoff: number;
    dpFuelAddKg: number;
    dpFastRepair: number;
    dcDashPage: number;
    dcBrakeBias: number;
    dpLFTireColdPress: number;
    dpRFTireColdPress: number;
    dpLRTireColdPress: number;
    dpRRTireColdPress: number;
    dcTractionControl: number;
    dcABS: number;
    dcToggleWindshieldWipers: boolean;
    dcTriggerWindshieldWipers: boolean;
    RFbrakeLinePress: number;
    RFcoldPressure: number;
    RFodometer: number;
    RFtempCL: number;
    RFtempCM: number;
    RFtempCR: number;
    RFwearL: number;
    RFwearM: number;
    RFwearR: number;
    LFbrakeLinePress: number;
    LFcoldPressure: number;
    LFodometer: number;
    LFtempCL: number;
    LFtempCM: number;
    LFtempCR: number;
    LFwearL: number;
    LFwearM: number;
    LFwearR: number;
    FuelUsePerHour: number;
    Voltage: number;
    WaterTemp: number;
    WaterLevel: number;
    FuelPress: number;
    OilTemp: number;
    OilPress: number;
    OilLevel: number;
    ManifoldPress: number;
    FuelLevel: number;
    Engine0_RPM: number;
    RRbrakeLinePress: number;
    RRcoldPressure: number;
    RRodometer: number;
    RRtempCL: number;
    RRtempCM: number;
    RRtempCR: number;
    RRwearL: number;
    RRwearM: number;
    RRwearR: number;
    LRbrakeLinePress: number;
    LRcoldPressure: number;
    LRodometer: number;
    LRtempCL: number;
    LRtempCM: number;
    LRtempCR: number;
    LRwearL: number;
    LRwearM: number;
    LRwearR: number;
    LRshockDefl: number;
    LRshockDefl_ST: number[];
    LRshockVel: number;
    LRshockVel_ST: number[];
    RRshockDefl: number;
    RRshockDefl_ST: number[];
    RRshockVel: number;
    RRshockVel_ST: number[];
    LFshockDefl: number;
    LFshockDefl_ST: number[];
    LFshockVel: number;
    LFshockVel_ST: number[];
    RFshockDefl: number;
    RFshockDefl_ST: number[];
    RFshockVel: number;
    RFshockVel_ST: number[];
    // Additional fields that may exist
    [key: string]: any;
  }

  export interface SessionInfoData {
    WeekendInfo: SessionInfoDataWeekendInfo;
    SessionInfo: SessionInfoDataSessionInfo;
    CameraInfo: SessionInfoDataCameraInfo;
    RadioInfo: SessionInfoDataRadioInfo;
    DriverInfo: SessionInfoDataDriverInfo;
    SplitTimeInfo: SessionInfoDataSplitTimeInfo;
    CarSetup: SessionInfoDataCarSetup;
  }
  export interface SessionInfoDataCarSetup {
    UpdateCount: number;
    TiresAero: SessionInfoDataCarSetupTiresAero;
    Chassis: SessionInfoDataCarSetupChassis;
    Dampers: SessionInfoDataCarSetupDampers;
  }
  export interface SessionInfoDataCarSetupDampers {
    FrontDampers: SessionInfoDataCarSetupDampersFrontDampers;
    RearDampers: SessionInfoDataCarSetupDampersRearDampers;
  }
  export interface SessionInfoDataCarSetupDampersRearDampers {
    LowSpeedCompressionDamping: string;
    HighSpeedCompressionDamping: string;
    LowSpeedReboundDamping: string;
    HighSpeedReboundDamping: string;
  }
  export interface SessionInfoDataCarSetupDampersFrontDampers {
    LowSpeedCompressionDamping: string;
    HighSpeedCompressionDamping: string;
    LowSpeedReboundDamping: string;
    HighSpeedReboundDamping: string;
  }
  export interface SessionInfoDataCarSetupChassis {
    FrontBrakes: SessionInfoDataCarSetupChassisFrontBrakes;
    LeftFront: SessionInfoDataCarSetupChassisLeftFront;
    LeftRear: SessionInfoDataCarSetupChassisLeftRear;
    Rear: SessionInfoDataCarSetupChassisRear;
    InCarAdjustments: SessionInfoDataCarSetupChassisInCarAdjustments;
    RightFront: SessionInfoDataCarSetupChassisRightFront;
    RightRear: SessionInfoDataCarSetupChassisRightRear;
    GearsDifferential: SessionInfoDataCarSetupChassisGearsDifferential;
  }
  export interface SessionInfoDataCarSetupChassisGearsDifferential {
    GearStack: string;
    FrictionFaces: number;
    DiffPreload: string;
  }
  export interface SessionInfoDataCarSetupChassisRightRear {
    CornerWeight: string;
    RideHeight: string;
    BumpRubberGap: string;
    SpringRate: string;
    Camber: string;
    ToeIn: string;
  }
  export interface SessionInfoDataCarSetupChassisRightFront {
    CornerWeight: string;
    RideHeight: string;
    BumpRubberGap: string;
    SpringRate: string;
    Camber: string;
  }
  export interface SessionInfoDataCarSetupChassisInCarAdjustments {
    BrakePressureBias: string;
    AbsSetting: string;
    TcSetting: string;
    DashDisplayPage: string;
    CrossWeight: string;
  }
  export interface SessionInfoDataCarSetupChassisRear {
    FuelLevel: string;
    ArbBlades: number;
    RearWingAngle: string;
  }
  export interface SessionInfoDataCarSetupChassisLeftRear {
    CornerWeight: string;
    RideHeight: string;
    BumpRubberGap: string;
    SpringRate: string;
    Camber: string;
    ToeIn: string;
  }
  export interface SessionInfoDataCarSetupChassisLeftFront {
    CornerWeight: string;
    RideHeight: string;
    BumpRubberGap: string;
    SpringRate: string;
    Camber: string;
  }
  export interface SessionInfoDataCarSetupChassisFrontBrakes {
    ArbBlades: number;
    TotalToeIn: string;
    BrakePedalRatio: number;
    BrakePads: string;
    FWtdist: string;
    CenterFrontSplitterHeight: string;
  }
  export interface SessionInfoDataCarSetupTiresAero {
    TireType: SessionInfoDataCarSetupTiresAeroTireType;
    LeftFront: SessionInfoDataCarSetupTiresAeroLeftFront;
    LeftRear: SessionInfoDataCarSetupTiresAeroLeftRear;
    RightFront: SessionInfoDataCarSetupTiresAeroRightFront;
    RightRear: SessionInfoDataCarSetupTiresAeroRightRear;
    AeroBalanceCalc: SessionInfoDataCarSetupTiresAeroAeroBalanceCalc;
  }
  export interface SessionInfoDataCarSetupTiresAeroAeroBalanceCalc {
    FrontRhAtSpeed: string;
    RearRhAtSpeed: string;
    RearWingAngle: string;
    FrontDownforce: string;
  }
  export interface SessionInfoDataCarSetupTiresAeroRightRear {
    StartingPressure: string;
    LastHotPressure: string;
    LastTempsIMO: string;
    TreadRemaining: string;
  }
  export interface SessionInfoDataCarSetupTiresAeroRightFront {
    StartingPressure: string;
    LastHotPressure: string;
    LastTempsIMO: string;
    TreadRemaining: string;
  }
  export interface SessionInfoDataCarSetupTiresAeroLeftRear {
    StartingPressure: string;
    LastHotPressure: string;
    LastTempsOMI: string;
    TreadRemaining: string;
  }
  export interface SessionInfoDataCarSetupTiresAeroLeftFront {
    StartingPressure: string;
    LastHotPressure: string;
    LastTempsOMI: string;
    TreadRemaining: string;
  }
  export interface SessionInfoDataCarSetupTiresAeroTireType {
    TireType: TrackWetness;
  }
  export interface SessionInfoDataSplitTimeInfo {
    Sectors: SessionInfoDataSplitTimeInfoSectorsItem[];
  }
  export interface SessionInfoDataSplitTimeInfoSectorsItem {
    SectorNum: number;
    SectorStartPct: number;
  }
  export interface SessionInfoDataDriverInfo {
    DriverCarIdx: number;
    DriverUserID: number;
    PaceCarIdx: number;
    DriverIsAdmin?: number;
    DriverHeadPosX: number;
    DriverHeadPosY: number;
    DriverHeadPosZ: number;
    DriverCarIsElectric: number;
    DriverCarIdleRPM: number;
    DriverCarRedLine: number;
    DriverCarEngCylinderCount: number;
    DriverCarFuelKgPerLtr: number;
    DriverCarFuelMaxLtr: number;
    DriverCarMaxFuelPct: number;
    DriverCarGearNumForward: number;
    DriverCarGearNeutral: number;
    DriverCarGearReverse: number;
    DriverGearboxType: string;
    DriverGearboxControlType: string;
    DriverCarShiftAid: string;
    DriverCarSLFirstRPM: number;
    DriverCarSLShiftRPM: number;
    DriverCarSLLastRPM: number;
    DriverCarSLBlinkRPM: number;
    DriverCarVersion: string;
    DriverPitTrkPct: number;
    DriverCarEstLapTime: number;
    DriverSetupName: string;
    DriverSetupIsModified: number;
    DriverSetupLoadTypeName: string;
    DriverSetupPassedTech: number;
    DriverIncidentCount: number;
    DriverBrakeCurvingFactor: number;
    DriverTires: SessionInfoDataDriverInfoDriverTiresItem[];
    Drivers: SessionInfoDataDriverInfoDriversItem[];
  }
  export interface SessionInfoDataDriverInfoDriversItem {
    CarIdx: number;
    UserName: string;
    AbbrevName: any;
    Initials: any;
    UserID: number;
    TeamID: number;
    TeamName: string;
    CarNumber: string;
    CarNumberRaw: number;
    CarPath: string;
    CarClassID: number;
    CarID: number;
    CarIsPaceCar: number;
    CarIsAI: number;
    CarIsElectric: number;
    CarScreenName: string;
    CarScreenNameShort: string;
    CarCfg: number;
    CarCfgName: any;
    CarCfgCustomPaintExt: any;
    CarClassShortName: any;
    CarClassRelSpeed: number;
    CarClassLicenseLevel: number;
    CarClassMaxFuelPct: string;
    CarClassWeightPenalty: string;
    CarClassPowerAdjust: string;
    CarClassDryTireSetLimit: string;
    CarClassColor: number;
    CarClassEstLapTime: number;
    IRating: number;
    LicLevel: number;
    LicSubLevel: number;
    LicString: string;
    LicColor: string;
    IsSpectator: number;
    CarDesignStr: string;
    HelmetDesignStr: string;
    SuitDesignStr: string;
    BodyType: number;
    FaceType: number;
    HelmetType: number;
    CarNumberDesignStr: string;
    CarSponsor_1: number;
    CarSponsor_2: number;
    CurDriverIncidentCount: number;
    TeamIncidentCount: number;
  }
  export interface SessionInfoDataDriverInfoDriverTiresItem {
    TireIndex: number;
    TireCompoundType: string;
  }
  export interface SessionInfoDataRadioInfo {
    SelectedRadioNum: number;
    Radios: SessionInfoDataRadioInfoRadiosItem[];
  }
  export interface SessionInfoDataRadioInfoRadiosItem {
    RadioNum: number;
    HopCount: number;
    NumFrequencies: number;
    TunedToFrequencyNum: number;
    ScanningIsOn: number;
    Frequencies: SessionInfoDataRadioInfoRadiosItemFrequenciesItem[];
  }
  export interface SessionInfoDataRadioInfoRadiosItemFrequenciesItem {
    FrequencyNum: number;
    FrequencyName: string;
    Priority: number;
    CarIdx: number;
    EntryIdx: number;
    ClubID: number;
    CanScan: number;
    CanSquawk: number;
    Muted: number;
    IsMutable: number;
    IsDeletable: number;
  }
  export interface SessionInfoDataCameraInfo {
    Groups: SessionInfoDataCameraInfoGroupsItem[];
  }
  export interface SessionInfoDataCameraInfoGroupsItem {
    GroupNum: number;
    GroupName: string;
    IsScenic?: boolean;
    Cameras: SessionInfoDataCameraInfoGroupsItemCamerasItem[];
  }
  export interface SessionInfoDataCameraInfoGroupsItemCamerasItem {
    CameraNum: number;
    CameraName: string;
  }
  export interface SessionInfoDataSessionInfo {
    CurrentSessionNum: number;
    Sessions: SessionInfoDataSessionInfoSessionsItem[];
  }
  export interface SessionInfoDataSessionInfoSessionsItem {
    SessionNum: number;
    SessionLaps: string;
    SessionTime: string;
    SessionNumLapsToAvg: number;
    SessionType: string;
    SessionTrackRubberState: string;
    SessionName: string;
    SessionSubType: any;
    SessionSkipped: number;
    SessionRunGroupsUsed: number;
    SessionEnforceTireCompoundChange: number;
    ResultsPositions: any;
    ResultsFastestLap: SessionInfoDataSessionInfoSessionsItemResultsFastestLapItem[];
    ResultsAverageLapTime: number;
    ResultsNumCautionFlags: number;
    ResultsNumCautionLaps: number;
    ResultsNumLeadChanges: number;
    ResultsLapsComplete: number;
    ResultsOfficial: number;
  }
  export interface SessionInfoDataSessionInfoSessionsItemResultsFastestLapItem {
    CarIdx: number;
    FastestLap: number;
    FastestTime: number;
  }
  export interface SessionInfoDataWeekendInfo {
    TrackName: string;
    TrackID: number;
    TrackLength: string;
    TrackLengthOfficial: string;
    TrackDisplayName: string;
    TrackDisplayShortName: string;
    TrackConfigName: string;
    TrackCity: string;
    TrackState: string;
    TrackCountry: string;
    TrackAltitude: string;
    TrackLatitude: string;
    TrackLongitude: string;
    TrackNorthOffset: string;
    TrackNumTurns: number;
    TrackPitSpeedLimit: string;
    TrackPaceSpeed: string;
    TrackNumPitStalls: number;
    TrackType: string;
    TrackDirection: string;
    TrackWeatherType: string;
    TrackSkies: string;
    TrackSurfaceTemp: string;
    TrackSurfaceTempCrew: string;
    TrackAirTemp: string;
    TrackAirPressure: string;
    TrackAirDensity: string;
    TrackWindVel: string;
    TrackWindDir: string;
    TrackRelativeHumidity: string;
    TrackFogLevel: string;
    TrackPrecipitation: string;
    TrackCleanup: number;
    TrackDynamicTrack: number;
    TrackVersion: string;
    SeriesID: number;
    SeasonID: number;
    SessionID: number;
    SubSessionID: number;
    LeagueID: number;
    Official: number;
    RaceWeek: number;
    EventType: string;
    Category: string;
    SimMode: string;
    TeamRacing: number;
    MinDrivers: number;
    MaxDrivers: number;
    DCRuleSet: string;
    QualifierMustStartRace: number;
    NumCarClasses: number;
    NumCarTypes: number;
    HeatRacing: number;
    BuildType: string;
    BuildTarget: string;
    BuildVersion: string;
    RaceFarm: any;
    WeekendOptions: SessionInfoDataWeekendInfoWeekendOptions;
    TelemetryOptions: SessionInfoDataWeekendInfoTelemetryOptions;
  }
  export interface SessionInfoDataWeekendInfoTelemetryOptions {
    TelemetryDiskFile: string;
  }
  export interface SessionInfoDataWeekendInfoWeekendOptions {
    NumStarters: number;
    StartingGrid: string;
    QualifyScoring: string;
    CourseCautions: string;
    StandingStart: number;
    ShortParadeLap: number;
    Restarts: string;
    WeatherType: string;
    Skies: string;
    WindDirection: string;
    WindSpeed: string;
    WeatherTemp: string;
    RelativeHumidity: string;
    FogLevel: string;
    TimeOfDay: string;
    Date: string;
    EarthRotationSpeedupFactor: number;
    Unofficial: number;
    CommercialMode: string;
    NightMode: string;
    IsFixedSetup: number;
    StrictLapsChecking: string;
    HasOpenRegistration: number;
    HardcoreLevel: number;
    NumJokerLaps: number;
    IncidentLimit: string;
    FastRepairsLimit: string;
    GreenWhiteCheckeredLimit: number;
  }

  export interface TelemetryEvent {
    timestamp: Date;
    values: TelemetryValues;
  }

  export interface SessionInfoEvent {
    timestamp: Date;
    data: SessionInfoData;
  }

  export interface UpdateEvent {
    type:
      | 'Connected'
      | 'Disconnected'
      | 'Telemetry'
      | 'TelemetryDescription'
      | 'SessionInfo';
    data?: any;
    timestamp: Date;
  }

  export interface CameraControls {
    setState(state: number): void;
    switchToCar(
      carNum: number | string,
      camGroupNum?: number,
      camNum?: number
    ): void;
    switchToPos(
      position: number | string,
      camGroupNum?: number,
      camNum?: number
    ): void;
  }

  export interface PlaybackControls {
    play(): void;
    pause(): void;
    fastForward(speed?: number): void;
    rewind(speed?: number): void;
    slowForward(divider?: number): void;
    slowBackward(divider?: number): void;
    search(searchMode: number | string): void;
    searchTs(sessionNum: number, sessionTimeMS: number): void;
    searchFrame(frameNum: number, rpyPosMode: number | string): void;
  }

  export interface IrSdkConsts {
    BroadcastMsg: {
      CamSwitchPos: 0;
      CamSwitchNum: 1;
      CamSetState: 2;
      ReplaySetPlaySpeed: 3;
      ReplaySetPlayPosition: 4;
      ReplaySearch: 5;
      ReplaySetState: 6;
      ReloadTextures: 7;
      ChatComand: 8;
      PitCommand: 9;
      TelemCommand: 10;
      FFBCommand: 11;
      ReplaySearchSessionTime: 12;
    };
    CameraState: {
      IsSessionScreen: 0x0001;
      IsScenicActive: 0x0002;
      CamToolActive: 0x0004;
      UIHidden: 0x0008;
      UseAutoShotSelection: 0x0010;
      UseTemporaryEdits: 0x0020;
      UseKeyAcceleration: 0x0040;
      UseKey10xAcceleration: 0x0080;
      UseMouseAimMode: 0x0100;
    };
    RpyPosMode: {
      Begin: 0;
      Current: 1;
      End: 2;
    };
    RpySrchMode: {
      ToStart: 0;
      ToEnd: 1;
      PrevSession: 2;
      NextSession: 3;
      PrevLap: 4;
      NextLap: 5;
      PrevFrame: 6;
      NextFrame: 7;
      PrevIncident: 8;
      NextIncident: 9;
    };
    RpyStateMode: {
      EraseTape: 0;
    };
    ReloadTexturesMode: {
      All: 0;
      CarIdx: 1;
    };
    ChatCommand: {
      Macro: 0;
      BeginChat: 1;
      Reply: 2;
      Cancel: 3;
    };
    PitCommand: {
      Clear: 0;
      WS: 1;
      Fuel: 2;
      LF: 3;
      RF: 4;
      LR: 5;
      RR: 6;
      ClearTires: 7;
      FR: 8;
      ClearWS: 9;
      ClearFR: 10;
      ClearFuel: 11;
    };
    TelemCommand: {
      Stop: 0;
      Start: 1;
      Restart: 2;
    };
    CamFocusAt: {
      Incident: -3;
      Leader: -2;
      Exciting: -1;
      Driver: 0;
    };
  }

  export interface JsIrSdk extends EventEmitter {
    connected: boolean;
    telemetry: { timestamp: Date; values: TelemetryValues } | null;
    telemetryDescription: any | null;
    sessionInfo: { timestamp: Date; data: SessionInfoData } | null;
    Consts: IrSdkConsts;
    camControls: CameraControls;
    playbackControls: PlaybackControls;

    execCmd(msgId: number, arg1?: number, arg2?: number, arg3?: number): void;
    reloadTextures(): void;
    reloadTexture(carIdx: number): void;
    execChatCmd(cmd: number | string, arg?: number): void;
    execChatMacro(num: number): void;
    execPitCmd(cmd: number | string, arg?: number): void;
    execTelemetryCmd(cmd: number | string): void;

    on(event: 'Connected', listener: () => void): this;
    on(event: 'Disconnected', listener: () => void): this;
    on(event: 'Telemetry', listener: (evt: TelemetryEvent) => void): this;
    on(event: 'TelemetryDescription', listener: (data: any) => void): this;
    on(event: 'SessionInfo', listener: (evt: SessionInfoEvent) => void): this;
    on(event: 'update', listener: (evt: UpdateEvent) => void): this;
    on(event: string | symbol, listener: (...args: any[]) => void): this;

    once(event: 'Connected', listener: () => void): this;
    once(event: 'Disconnected', listener: () => void): this;
    once(event: 'Telemetry', listener: (evt: TelemetryEvent) => void): this;
    once(event: 'TelemetryDescription', listener: (data: any) => void): this;
    once(event: 'SessionInfo', listener: (evt: SessionInfoEvent) => void): this;
    once(event: 'update', listener: (evt: UpdateEvent) => void): this;
    once(event: string | symbol, listener: (...args: any[]) => void): this;

    emit(event: 'Connected'): boolean;
    emit(event: 'Disconnected'): boolean;
    emit(event: 'Telemetry', evt: TelemetryEvent): boolean;
    emit(event: 'TelemetryDescription', data: any): boolean;
    emit(event: 'SessionInfo', evt: SessionInfoEvent): boolean;
    emit(event: 'update', evt: UpdateEvent): boolean;
    emit(event: string | symbol, ...args: any[]): boolean;
  }

  export function init(opts?: InitOptions): JsIrSdk;
  export function getInstance(): JsIrSdk;
}
