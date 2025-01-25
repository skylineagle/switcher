/// <reference path="../pb_data/types.d.ts" />

const MEDIAMTX_API = $os.getenv("MEDIAMTX_API") || "http://mediamtx:9997";

function addMediaMTXPath(name, configuration) {
  $http.send({
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    url: `${MEDIAMTX_API}/v3/config/paths/add/${name}`,
    body: JSON.stringify({ name, ...configuration }),
  });
}

function deleteMediaMTXPath(name) {
  const response = $http.send({
    method: "DELETE",
    url: `${MEDIAMTX_API}/v3/config/paths/delete/${name}`,
  });
  $app.logger().info(response.statusCode);
}

module.exports = {
  addMediaMTXPath,
  deleteMediaMTXPath,
};
