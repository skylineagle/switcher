/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  let users = app.findCollectionByNameOrId("users");
  let userRecord = new Record(users);

  userRecord.set("email", "user@switchr.io");
  userRecord.set("password", "Aa123456");
  userRecord.set("verified", true);
  userRecord.set("name", "User");
  userRecord.set("level", "user");

  app.save(userRecord);
});
