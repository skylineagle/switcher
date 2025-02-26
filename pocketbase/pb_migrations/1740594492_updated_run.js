/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1599127217")

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_2484833797",
    "hidden": false,
    "id": "relation1204587666",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "action",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1599127217")

  // remove field
  collection.fields.removeById("relation1204587666")

  return app.save(collection)
})
