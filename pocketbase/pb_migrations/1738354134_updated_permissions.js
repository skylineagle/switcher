/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3709660955")

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "select4093079137",
    "maxSelect": 2,
    "name": "allowed",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "super",
      "manager",
      "user"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3709660955")

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "select4093079137",
    "maxSelect": 2,
    "name": "allowed",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "user",
      "manager",
      "admin"
    ]
  }))

  return app.save(collection)
})
