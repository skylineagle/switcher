/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4195113088")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_3FNqlvfeg1` ON `cameras` (`name`)"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4195113088")

  // update collection data
  unmarshal({
    "indexes": []
  }, collection)

  return app.save(collection)
})
