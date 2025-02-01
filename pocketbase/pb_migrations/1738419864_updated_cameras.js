/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4195113088")

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "select4093079137",
    "maxSelect": 3,
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
  const collection = app.findCollectionByNameOrId("pbc_4195113088")

  // remove field
  collection.fields.removeById("select4093079137")

  return app.save(collection)
})
