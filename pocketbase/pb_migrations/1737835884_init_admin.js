/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  let users = app.findCollectionByNameOrId("users");
  let adminUserRecord = new Record(users);

  adminUserRecord.set("email", "admin@switcher.io");
  adminUserRecord.set("password", "Password2@");
  adminUserRecord.set("verified", true);
  adminUserRecord.set("name", "Admin");
  adminUserRecord.set("level", "super");

  app.save(adminUserRecord);
});
