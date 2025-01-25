/// <reference path="../data/types.d.ts" />

// Handle adter sucessful creation
onRecordAfterCreateSuccess((e) => {
  $app.logger().info(`Camera created with ID: ${e.record.id}`);
  const configuration = JSON.parse(e.record.get("configuration"));
  $app.logger().info(configuration);

  if (!configuration) {
    $app.logger().warn(`No configuration found for camera ${e.record.id}`);
    e.next();
    return;
  }

  try {
    $http.send({
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      url: `http://host.docker.internal:3000/jobs/${e.record.id}`,
      body: JSON.stringify(configuration),
    });
  } catch (error) {
    $app.logger().error(error);
  }
  e.next();
}, "cameras");

// Handle after successful update
onRecordUpdateRequest((e) => {
  const { updateStatus } = require(`${__hooks}/utils`);
  $app.logger().info(`Camera updated request with ID: ${e.record.id}`);
  const current = $app.findRecordById("cameras", e.record.id);
  const name = e.record.get("name");
  const mode = e.record.get("mode");
  const source = e.record.get("source");
  const configuration = e.record.get("configuration");

  // On Configuration Change
  if (
    configuration &&
    JSON.stringify(configuration) !==
      JSON.stringify(current.get("configuration"))
  ) {
    $app.logger().info("Configuration changed, syncing baker job");
    try {
      $http.send({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        url: `http://host.docker.internal:3000/jobs/${e.record.id}`,
        body: JSON.stringify(configuration),
      });
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
        $http.send({
          method: "DELETE",
          url: `http://mediamtx:9997/v3/config/paths/delete/${name}`,
        });

        $http.send({
          method: "POST",
          url: `http://host.docker.internal:3000/jobs/${e.record.id}/start`,
        });
      } else if (mode === "live") {
        const statusResponse = $http.send({
          method: "GET",
          url: `http://host.docker.internal:3000/jobs/${e.record.id}`,
        });
        $app
          .logger()
          .info(`Job status: ${JSON.stringify(statusResponse.json.status)}`);

        const status = statusResponse.json.status;
        if (status === "running") {
          $app.logger().info("Stopping job");
          $http.send({
            method: "POST",
            url: `http://host.docker.internal:3000/jobs/${e.record.id}/stop`,
          });
        }

        $app.logger().info("Adding camera to MediaMTX");
        $http.send({
          method: "POST",
          url: `http://mediamtx:9997/v3/config/paths/add/${name}`,
          body: JSON.stringify({
            name,
            source,
          }),
        });
      }
      // If mode changed to off or live, stop and delete job
      else {
        $app.logger().info("Stopping job");
        $http.send({
          method: "POST",
          url: `http://host.docker.internal:3000/jobs/${e.record.id}/stop`,
        });

        $app.logger().info("Removing camera from MediaMTX");
        $http.send({
          method: "DELETE",
          url: `http://mediamtx:9997/v3/config/paths/delete/${name}`,
        });
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
  $app.logger().info(`Camera deleted with ID: ${e.record.id}`);

  try {
    // Stop and delete any existing job
    $http.send({
      method: "POST",
      url: `http://host.docker.internal:3000/jobs/${e.record.id}/stop`,
    });
    $http.send({
      method: "DELETE",
      url: `http://host.docker.internal:3000/jobs/${e.record.id}`,
    });

    $http.send({
      method: "DELETE",
      url: `http://mediamtx:9997/v3/config/paths/remove/${e.record.get(
        "name"
      )}`,
    });
  } catch (error) {
    $app.logger().error(`Error deleting job for camera ${e.record.id}:`, error);
  }

  e.next();
}, "cameras");
