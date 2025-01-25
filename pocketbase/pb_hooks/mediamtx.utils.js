/// <reference path="../pb_data/types.d.ts" />

function addMediaMTXPath(name, configuration) {
  $http.send({
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    url: `http://mediamtx:9997/v3/config/paths/add/${name}`,
    body: JSON.stringify({ name, ...configuration }),
  });
}

function deleteMediaMTXPath(name) {
  const response = $http.send({
    method: "DELETE",
    url: `http://mediamtx:9997/v3/config/paths/delete/${name}`,
  });
  $app.logger().info(response.statusCode);
}

module.exports = {
  addMediaMTXPath,
  deleteMediaMTXPath,
};
