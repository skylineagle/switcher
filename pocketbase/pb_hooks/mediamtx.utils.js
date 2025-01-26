/// <reference path="../pb_data/types.d.ts" />

const MEDIAMTX_API = $os.getenv("MEDIAMTX_API") || "http://mediamtx:9997";

function addMediaMTXPath(name, configuration) {
  $app.logger().info("Adding mediamtx path");
  $http.send({
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    url: `${MEDIAMTX_API}/v3/config/paths/add/${name}`,
    body: JSON.stringify({ name, ...configuration }),
  });
}

function updateMediaMTXPath(oldName, configuration) {
  $app.logger().info("Updating mediamtx path");
  const response = $http.send({
    method: "PATCH",
    url: `${MEDIAMTX_API}/v3/config/paths/patch/${name}`,
    body: JSON.stringify(configuration),
  });

  $app.logger().info(JSON.stringify(response));
}

function deleteMediaMTXPath(name) {
  $app.logger().info("Deleting mediamtx path");
  $http.send({
    method: "DELETE",
    url: `${MEDIAMTX_API}/v3/config/paths/delete/${name}`,
  });
}

module.exports = {
  addMediaMTXPath,
  deleteMediaMTXPath,
  updateMediaMTXPath,
};
