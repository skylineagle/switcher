/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4195113088")

  // add field
  collection.fields.addAt(8, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3552922951",
    "hidden": false,
    "id": "relation3616895705",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "model",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4195113088")

  // remove field
  collection.fields.removeById("relation3616895705")

  return app.save(collection)
})
