/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1599127217")

  // remove field
  collection.fields.removeById("select1204587666")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1599127217")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "select1204587666",
    "maxSelect": 1,
    "name": "action",
    "presentable": false,
    "required": false,
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
