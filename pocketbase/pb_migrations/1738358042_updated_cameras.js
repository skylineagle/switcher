/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4195113088")

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "select2546616235",
    "maxSelect": 1,
    "name": "mode",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "live",
      "auto",
      "offline"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4195113088")

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "select2546616235",
    "maxSelect": 1,
    "name": "mode",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "live",
      "offline",
      "auto"
    ]
  }))

  return app.save(collection)
})
