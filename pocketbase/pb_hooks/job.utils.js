/// <reference path="../pb_data/types.d.ts" />

function createCameraJob(cameraId, automation) {
  $http.send({
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    url: `http://host.docker.internal:3000/jobs/${cameraId}`,
    body: JSON.stringify(automation),
  });
}

function deleteCameraJob(cameraId) {
  const response = $http.send({
    method: "DELETE",
    url: `http://host.docker.internal:3000/jobs/${cameraId}`,
  });
  $app.logger().info(response.statusCode);
}

function startCameraJob(cameraId) {
  $http.send({
    method: "POST",
    url: `http://host.docker.internal:3000/jobs/${cameraId}/start`,
  });
}

function stopCameraJob(cameraId) {
  $http.send({
    method: "POST",
    url: `http://host.docker.internal:3000/jobs/${cameraId}/stop`,
  });
}

function getJobStatus(cameraId) {
  const response = $http.send({
    method: "GET",
    url: `http://host.docker.internal:3000/jobs/${cameraId}`,
  });
  return response.json.status;
}

module.exports = {
  createCameraJob,
  deleteCameraJob,
  startCameraJob,
  stopCameraJob,
  getJobStatus,
};
