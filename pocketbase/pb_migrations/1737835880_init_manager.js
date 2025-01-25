/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  let users = app.findCollectionByNameOrId("users");
  let managerUserRecord = new Record(users);

  managerUserRecord.set("email", "manager@switchr.io");
  managerUserRecord.set("password", "Password1!");
  managerUserRecord.set("verified", true);
  managerUserRecord.set("name", "Manager");
  managerUserRecord.set("level", "manager");

  app.save(managerUserRecord);
});
