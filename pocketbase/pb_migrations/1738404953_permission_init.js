/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  const collection = app.findCollectionByNameOrId("permissions");

  app.save(
    new Record(collection, {
      name: "mode_change",
      allowed: ["manager", "super"],
    })
  );

  app.save(
    new Record(collection, {
      name: "configuration_edit",
      allowed: ["super"],
    })
  );

  app.save(
    new Record(collection, {
      name: "view_stream",
      allowed: ["manager", "super"],
    })
  );

  app.save(
    new Record(collection, {
      name: "camera_edit",
      allowed: ["manager", "super"],
    })
  );

  app.save(
    new Record(collection, {
      name: "camera_delete",
      allowed: ["super"],
    })
  );
});
