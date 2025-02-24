/// <reference path="../pb_data/types.d.ts" />

const SWITCHER_URL = $os.getenv("SWITCHER_URL") || "http://host.docker.internal:8000";

function toggleMode(cameraId, mode) {
  $app.logger().info("Toggling mode of camera", cameraId, "to", mode);
  $http.send({
    method: "POST",
    url: `${SWITCHER_URL}/api/run/${cameraId}/${mode}`,
  });
}

module.exports = {
  toggleMode,
};
