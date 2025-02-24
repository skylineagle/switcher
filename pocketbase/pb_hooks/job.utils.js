/// <reference path="../pb_data/types.d.ts" />

const BAKER_URL = $os.getenv("BAKER_URL") || "http://host.docker.internal:3000";

function createCameraJob(cameraId, automation) {
  // curl -X POST -H "Content-Type: application/json" -d '{"automation": "..."}' http://host.docker.internal:3000/jobs/{cameraId}
  $http.send({
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    url: `${BAKER_URL}/jobs/${cameraId}`,
    body: automation,
  });
}

function deleteCameraJob(cameraId) {
  // curl -X DELETE http://host.docker.internal:3000/jobs/{cameraId}
  $http.send({
    method: "DELETE",
    url: `${BAKER_URL}/jobs/${cameraId}`,
  });
}

function startCameraJob(cameraId) {
  // curl -X POST http://host.docker.internal:3000/jobs/{cameraId}/start
  $http.send({
    method: "POST",
    url: `${BAKER_URL}/jobs/${cameraId}/start`,
  });
}

function stopCameraJob(cameraId) {
  // curl -X POST http://host.docker.internal:3000/jobs/{cameraId}/stop
  $http.send({
    method: "POST",
    url: `${BAKER_URL}/jobs/${cameraId}/stop`,
  });
}

function getJobStatus(cameraId) {
  // curl -X GET http://host.docker.internal:3000/jobs/{cameraId}
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
