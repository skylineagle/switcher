/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4195113088")

  // update collection data
  unmarshal({
    "listRule": "allowed ?= @request.auth.level",
    "updateRule": "allowed ?= @request.auth.level",
    "viewRule": "allowed ?= @request.auth.level"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4195113088")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id != \"\" && allowed ?= @request.auth.level",
    "updateRule": "@request.auth.id != \"\" && allowed ?= @request.auth.level",
    "viewRule": "@request.auth.id != \"\" && allowed ?= @request.auth.level"
  }, collection)

  return app.save(collection)
})
