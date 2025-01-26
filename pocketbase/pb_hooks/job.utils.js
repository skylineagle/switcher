/// <reference path="../pb_data/types.d.ts" />

const BAKER_URL = $os.getenv("BAKER_URL") || "http://host.docker.internal:3000";

function createCameraJob(cameraId, automation) {
  $http.send({
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    url: `${BAKER_URL}/jobs/${cameraId}`,
    body: JSON.stringify(automation),
  });
}

function deleteCameraJob(cameraId) {
  $http.send({
    method: "DELETE",
    url: `${BAKER_URL}/jobs/${cameraId}`,
  });
}

function startCameraJob(cameraId) {
  $http.send({
    method: "POST",
    url: `${BAKER_URL}/jobs/${cameraId}/start`,
  });
}

function stopCameraJob(cameraId) {
  $http.send({
    method: "POST",
    url: `${BAKER_URL}/jobs/${cameraId}/stop`,
  });
}

function getJobStatus(cameraId) {
  $http.send({
    method: "GET",
    url: `${BAKER_URL}/jobs/${cameraId}`,
  });
}

module.exports = {
  createCameraJob,
  deleteCameraJob,
  startCameraJob,
  stopCameraJob,
  getJobStatus,
};
