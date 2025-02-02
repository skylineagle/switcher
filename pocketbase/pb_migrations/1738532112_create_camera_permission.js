/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("permissions");

  app.save(
    new Record(collection, {
      name: "camera_create",
      allowed: ["super"],
    })
  );
});
