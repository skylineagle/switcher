/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4195113088")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id != \"\" && (allowed ~ @request.auth.level || @request.auth.level = 'super') && hide = true",
    "viewRule": "@request.auth.id != \"\" && (allowed ~ @request.auth.level || @request.auth.level = 'super') && hide = true"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4195113088")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id != \"\" && (allowed ~ @request.auth.level || @request.auth.level = 'super')",
    "viewRule": "@request.auth.id != \"\" && (allowed ~ @request.auth.level || @request.auth.level = 'super')"
  }, collection)

  return app.save(collection)
})
