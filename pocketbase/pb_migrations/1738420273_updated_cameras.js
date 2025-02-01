/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4195113088")

  // update collection data
  unmarshal({
    "listRule": "allowed ?~ @request.auth.level",
    "viewRule": "allowed ?~ @request.auth.level"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4195113088")

  // update collection data
  unmarshal({
    "listRule": "allowed ?= @request.auth.level",
    "viewRule": "allowed ?= @request.auth.level"
  }, collection)

  return app.save(collection)
})
