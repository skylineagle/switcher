/// <reference path="../pb_data/types.d.ts" />

// Handle create request
onRecordCreateRequest((e) => {
  const configuration = JSON.parse(e.record.get("configuration"));

  e.record.set(
    "configuration",
    JSON.stringify({
      ...configuration,
      sourceFingerprint: "",
      sourceOnDemand: false,
      sourceOnDemandStartTimeout: "10s",
      sourceOnDemandCloseAfter: "10s",
      maxReaders: 0,
      srtReadPassphrase: "",
      fallback: "",
      record: false,
      recordPath: "./recordings/%path/%Y-%m-%d_%H-%M-%S-%f",
      recordFormat: "fmp4",
      recordPartDuration: "1s",
      recordSegmentDuration: "1h0m0s",
      recordDeleteAfter: "1d",
      overridePublisher: true,
      srtPublishPassphrase: "",
      rtspTransport: "tcp",
      rtspAnyPort: false,
      rtspRangeType: "",
      rtspRangeStart: "",
      sourceRedirect: "",
      rpiCameraCamID: 0,
      rpiCameraWidth: 1920,
      rpiCameraHeight: 1080,
      rpiCameraHFlip: false,
      rpiCameraVFlip: false,
      rpiCameraBrightness: 0,
      rpiCameraContrast: 1,
      rpiCameraSaturation: 1,
      rpiCameraSharpness: 1,
      rpiCameraExposure: "normal",
      rpiCameraAWB: "auto",
      rpiCameraAWBGains: [0, 0],
      rpiCameraDenoise: "off",
      rpiCameraShutter: 0,
      rpiCameraMetering: "centre",
      rpiCameraGain: 0,
      rpiCameraEV: 0,
      rpiCameraROI: "",
      rpiCameraHDR: false,
      rpiCameraTuningFile: "",
      rpiCameraMode: "",
      rpiCameraFPS: 30,
      rpiCameraAfMode: "continuous",
      rpiCameraAfRange: "normal",
      rpiCameraAfSpeed: "normal",
      rpiCameraLensPosition: 0,
      rpiCameraAfWindow: "",
      rpiCameraFlickerPeriod: 0,
      rpiCameraTextOverlayEnable: false,
      rpiCameraTextOverlay: "%Y-%m-%d %H:%M:%S - MediaMTX",
      rpiCameraCodec: "auto",
      rpiCameraIDRPeriod: 60,
      rpiCameraBitrate: 5000000,
      rpiCameraProfile: "main",
      rpiCameraLevel: "4.1",
      runOnInit: "",
      runOnInitRestart: false,
      runOnDemand: "",
      runOnDemandRestart: false,
      runOnDemandStartTimeout: "10s",
      runOnDemandCloseAfter: "10s",
      runOnUnDemand: "",
      runOnReady: "",
      runOnReadyRestart: false,
      runOnNotReady: "",
      runOnRead: "",
      runOnReadRestart: false,
      runOnUnread: "",
      runOnRecordSegmentCreate: "",
      runOnRecordSegmentComplete: "",
    })
  );
  e.record.set("mode", "offline");
  e.record.set("status", "off");
  e.record.set("allowed", ["super", "manager", "user"]);
  e.record.set("hide", e.record.get("hide") ?? false);

  e.next();
});

// Handle adter sucessful creation
onRecordAfterCreateSuccess((e) => {
  const { createCameraJob } = require(`${__hooks}/job.utils`);
  $app.logger().info(`Camera created with ID: ${e.record.id}`);
  const automation = JSON.parse(e.record.get("automation"));

  if (!automation) {
    $app
      .logger()
      .warn(`No automation settings found for camera ${e.record.id}`);
    e.next();
    return;
  }

  try {
    createCameraJob(e.record.id, automation);
  } catch (error) {
    $app.logger().error(error);
  }
  e.next();
}, "cameras");

// Handle automation change
onRecordUpdateRequest((e) => {
  const { createCameraJob } = require(`${__hooks}/job.utils`);
  const current = $app.findRecordById("cameras", e.record.id);
  const automation = e.record.get("automation");

  if (
    automation &&
    JSON.stringify(automation) !== JSON.stringify(current.get("automation"))
  ) {
    $app.logger().info("Automation settings changed, syncing baker job");
    try {
      createCameraJob(e.record.id, automation);
    } catch (error) {
      $app.logger().error("Failed to sync baker job", error);
    }
  }
  e.next();
}, "cameras");

// Handle mode change
onRecordUpdateRequest((e) => {
  const { updateStatus } = require(`${__hooks}/utils`);
  const { startCameraJob, stopCameraJob } = require(`${__hooks}/job.utils`);
  const {
    addMediaMTXPath,
    deleteMediaMTXPath,
  } = require(`${__hooks}/mediamtx.utils`);
  const current = $app.findRecordById("cameras", e.record.id);
  const mode = e.record.get("mode");

  if (mode && mode !== current.get("mode")) {
    $app.logger().info("Mode changed, syncing camera state");
    const currentConfiguration = JSON.parse(current.get("configuration"));
    const configuration = JSON.parse(e.record.get("configuration"));
    try {
      // If mode changed to auto, create and start job
      if (mode === "auto") {
        deleteMediaMTXPath(currentConfiguration.name);
        startCameraJob(e.record.id);
      } else if (mode === "live") {
        $app.logger().debug("Stopping job");
        stopCameraJob(e.record.id);

        $app.logger().debug("Adding camera to MediaMTX");
        addMediaMTXPath(configuration);
      }
      // If mode changed to off or live, stop and delete job
      else {
        $app.logger().debug("Stopping job");
        stopCameraJob(e.record.id);

        deleteMediaMTXPath(currentConfiguration.name);
      }
    } catch (error) {
      $app.logger().error(error);
    }
  }

  e.next();
  updateStatus();
}, "cameras");

// Handle after successful deletion
onRecordAfterDeleteSuccess((e) => {
  const { stopCameraJob, deleteCameraJob } = require(`${__hooks}/job.utils`);
  const { deleteMediaMTXPath } = require(`${__hooks}/mediamtx.utils`);

  $app.logger().info(`Camera deleted with ID: ${e.record.id}`);

  try {
    // Stop and delete any existing job
    stopCameraJob(e.record.id);
    deleteCameraJob(e.record.id);
    deleteMediaMTXPath(e.record.get("configuration").name);
  } catch (error) {
    $app.logger().error(error);
  }

  e.next();
}, "cameras");
