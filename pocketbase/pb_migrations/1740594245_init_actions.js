/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("actions");

  app.save(
    new Record(collection, {
      name: "live",
    })
  );

  app.save(
    new Record(collection, {
      name: "offline",
    })
  );

  app.save(
    new Record(collection, {
      name: "auto",
    })
  );
});
