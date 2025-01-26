/// <reference path="../pb_data/types.d.ts" />

// Handle adter sucessful creation
onRecordAfterCreateSuccess((e) => {
  const { createCameraJob } = require(`${__hooks}/job.utils`);
  $app.logger().info(`Camera created with ID: ${e.record.id}`);
  const automation = JSON.parse(e.record.get("automation"));
  $app.logger().info(automation);

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

// Handle after successful update
onRecordUpdateRequest((e) => {
  const {
    createCameraJob,
    startCameraJob,
    stopCameraJob,
    getJobStatus,
  } = require(`${__hooks}/job.utils`);
  const {
    addMediaMTXPath,
    deleteMediaMTXPath,
    updateMediaMTXPath,
  } = require(`${__hooks}/mediamtx.utils`);
  const { updateStatus } = require(`${__hooks}/utils`);

  $app.logger().info(`Camera updated request with ID: ${e.record.id}`);
  const current = $app.findRecordById("cameras", e.record.id);
  const name = e.record.get("name");
  const mode = e.record.get("mode");
  const automation = e.record.get("automation");
  const configuration = e.record.get("configuration");

  // Sync name into configuration.name
  if (name && name !== current.get("name")) {
    $app.logger().info("Name changed, syncing with configuration");
    try {
      const configuration = JSON.parse(e.record.get("configuration"));
      configuration.name = name;
      e.record.set("configuration", JSON.stringify(configuration));

      $app.logger().info("Syncing name with mediamtx");
      if (mode === "live") {
        removeMediaMTXPath(current.get("name"));
        addMediaMTXPath(name, configuration);
      }
    } catch (error) {
      $app.logger().error("Failed to sync name with configuration", error);
      throw new Error("Failed to sync name with configuration");
    }
  }

  // Sync configuration.name with name
  try {
    const configuration = JSON.parse(e.record.get("configuration"));
    const currentConfiguration = JSON.parse(current.get("configuration"));
    if (configuration.name !== currentConfiguration.name) {
      $app
        .logger()
        .info("Configuration name changed, syncing with camera name");
      e.record.set("name", configuration.name);
    }
  } catch (error) {
    $app
      .logger()
      .error("Failed to sync configuration name with camera name", error);
    throw new Error("Failed to sync configuration name with camera name");
  }

  // On Configuration Change
  if (
    configuration &&
    JSON.stringify(configuration) !==
      JSON.stringify(current.get("configuration"))
  ) {
    if (["waiting", "on"].includes(current.get("status"))) {
      $app.logger().info("Configuration changed, syncing camera state");
      try {
        const configuration = JSON.parse(e.record.get("configuration"));
        updateMediaMTXPath(name, configuration);
      } catch (error) {
        $app.logger().error("Failed to sync configuration with camera", error);
      }
    }
  }

  // On Automation Settings Change
  if (
    automation &&
    JSON.stringify(automation) !== JSON.stringify(current.get("automation"))
  ) {
    $app.logger().info("Automation settings changed, syncing baker job");
    try {
      createCameraJob(e.record.id, automation);
      if (current.get("mode") === "auto") {
        startCameraJob(e.record.id);
      }
    } catch (error) {
      $app.logger().error("Failed to sync baker job", error);
    }
  }

  // On Mode Change
  if (mode && mode !== current.get("mode")) {
    $app.logger().info("Mode changed, syncing camera state");
    try {
      // If mode changed to auto, create and start job
      if (mode === "auto") {
        deleteMediaMTXPath(name);
        startCameraJob(e.record.id);
      } else if (mode === "live") {
        $app.logger().info("Stopping job");
        stopCameraJob(e.record.id);

        $app.logger().info("Adding camera to MediaMTX");
        const configuration = JSON.parse(e.record.get("configuration"));
        addMediaMTXPath(name, configuration);
      }
      // If mode changed to off or live, stop and delete job
      else {
        $app.logger().info("Stopping job");
        stopCameraJob(e.record.id);

        $app.logger().info("Removing camera from MediaMTX");
        deleteMediaMTXPath(name);
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
    deleteMediaMTXPath(e.record.get("name"));
  } catch (error) {
    $app.logger().error(error);
  }

  e.next();
}, "cameras");
