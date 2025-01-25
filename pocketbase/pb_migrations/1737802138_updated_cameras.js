/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4195113088")

  // remove field
  collection.fields.removeById("url1602912115")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "json27830942312",
    "maxSize": 0,
    "name": "configuration",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "json"
  }))

  // update field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "json2783094231",
    "maxSize": 0,
    "name": "automation",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4195113088")

  // add field
  collection.fields.addAt(3, new Field({
    "exceptDomains": [],
    "hidden": false,
    "id": "url1602912115",
    "name": "source",
    "onlyDomains": [],
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url"
  }))

  // remove field
  collection.fields.removeById("json27830942312")

  // update field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "json2783094231",
    "maxSize": 0,
    "name": "configuration",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
})
