import AnnaClient from "."
import { Query } from "./types"

/** NOTE:
 * uri, and port are both optional. By default the
 * client will connect to the playground.annadb.dev
 * server on port 10001
 *
 * Example: const annaDB = new AnnaClient()
 */
const annaDB = new AnnaClient({
  uri: "annadb://playground.annadb.dev",
  port: 10001,
})

const queryAddTest42: Query = {
  collection: "test",
  pipeline: {
    insert: 42,
  },
}

/** NOTE:
 * When running multiple queries in a row,
 * they are currently executed in series in
 * separate transactions.
 */

const example = async () => {
  const addTest42 = await annaDB.query(queryAddTest42)
  if (addTest42?.[0]?.error) throw new Error(addTest42[0].error)
  const id = addTest42?.[0]?.ok?.ids?.[0].id
  if (id === undefined) throw new Error("No id returned")

  const queryGetTest: Query = {
    collection: "test",
    pipeline: {
      get: {
        type: "test",
        id: id,
      },
    },
  }

  const getTest = await annaDB.query(queryGetTest)

  const deleteTest: Query = {
    collection: "test",
    pipeline: [
      {
        get: {
          type: "test",
          id: id,
        },
      },
      {
        delete: true,
      },
    ],
  }

  const delTest = await annaDB.query(deleteTest)

  console.log(
    JSON.stringify(
      {
        addTest: addTest42,
        getTest,
        delTest,
      },
      undefined,
      2
    )
  )
}

example()
