/// <reference path="../pb_data/types.d.ts" />

function updateStatus() {
  $app.logger().info("Updating status");
  try {
    // Fetch all cameras
    const cameras = $app.findAllRecords("cameras");
    if (!cameras || cameras.length === 0) {
      $app.logger().info("No cameras found");
      return;
    }
    // Fetch live cameras from MediaMTX
    const response = $http.send({
      method: "GET",
      url: "http://mediamtx:9997/v3/paths/list",
    });

    if (response.statusCode !== 200) {
      throw new Error("Failed to fetch MediaMTX paths");
    }

    const mediamtxPaths = response.json;
    const liveCameras = mediamtxPaths.items;

    // Update each camera's status based on whether it's live
    // Update status for each live camera
    for (const camera of cameras) {
      const cameraName = camera.get("name");
      const cameraStatus = liveCameras
        .map((path) => path.name)
        .includes(cameraName);
      $app
        .logger()
        .info(`Updating Camera ${cameraName} status to: ${cameraStatus}`);
      camera.set(
        "status",
        cameraStatus
          ? liveCameras.find((path) => path.name === cameraName).ready
            ? "on"
            : "waiting"
          : "off"
      );
      $app.save(camera);
    }
  } catch (error) {
    $app.logger().error(error);
  }
}

module.exports = {
  updateStatus,
};
