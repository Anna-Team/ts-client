import { decodeTyson } from "./decode"
import { encodeTyson } from "./encode"
import { Query, TysonDecoded } from "./types"

interface Test {
  name: string
  json: TysonDecoded
  tyson: string
}

const tests: Test[] = [
  {
    name: "Example General Insert",
    json: {
      collection: "test",
      pipeline: {
        insert: [
          "foo",
          100,
          true,
          [1, 2, 3],
          {
            bar: "baz",
          },
        ],
      },
    },
    tyson: `collection|test|:insert[s|foo|,n|100|,b|true|,v[n|1|,n|2|,n|3|],m{s|bar|:s|baz|}];`,
  },
  {
    name: "Get one item from test collection with get operation by ID",
    json: {
      collection: "test",
      pipeline: [
        {
          get: {
            type: "test",
            id: "0c49129e-3730-4d8a-a0a2-8330c15aec3f",
          },
        },
      ],
    },
    tyson:
      "collection|test|:q[get[test|0c49129e-3730-4d8a-a0a2-8330c15aec3f|]];",
  },
  {
    name: "Find all test collection",
    json: {
      collection: "test",
      pipeline: {
        find: [],
      },
    },
    tyson: "collection|test|:find[];",
  },
  {
    name: "Increment all points collection root value by 3",
    json: {
      collection: "points",
      pipeline: [
        {
          find: [],
        },
        {
          update: {
            inc: {
              root: 3,
            },
          },
        },
      ],
    },
    tyson: "collection|points|:q[find[],update[inc{root:n|3|}]];",
  },
  {
    name: "Increase every students grade by 10 and set their pass property to true",
    json: {
      collection: "students",
      pipeline: [
        {
          find: [],
        },
        {
          update: [
            {
              inc: { path: "grade", by: 10 },
            },
            {
              set: { path: "pass", value: true },
            },
          ],
        },
      ],
    },
    tyson:
      "collection|students|:q[find[],update[inc{value|grade|:n|10|},set{value|pass|:b|true|}]];",
  },
  {
    name: "Example Root root string update by get operation",
    json: {
      collection: "categories",
      pipeline: [
        {
          get: {
            type: "categories",
            id: "0c49129e-3730-4d8a-a0a2-8330c15aec3f",
          },
        },
        {
          update: {
            set: {
              root: "chocolate",
            },
          },
        },
      ],
    },
    tyson:
      "collection|categories|:q[get[categories|0c49129e-3730-4d8a-a0a2-8330c15aec3f|],update[set{root:s|chocolate|}]];",
  },
  {
    name: "Example Find First 5 Sorted by `num`",
    json: {
      collection: "test",
      pipeline: [
        {
          find: [],
        },
        {
          sort: {
            asc: "num",
          },
        },
        {
          limit: 5,
        },
      ],
    },
    tyson: "collection|test|:q[find[],sort[asc(value|num|)],limit(n|5|)];",
  },
  {
    name: "Increment all category order over 4 by 1",
    json: {
      collection: "categories",
      pipeline: [
        {
          find: {
            gt: {
              path: "order",
              value: 4,
            },
          },
        },
        {
          update: {
            inc: {
              path: "order",
              by: 1,
            },
          },
        },
      ],
    },
    tyson:
      "collection|categories|:q[find[gt{value|order|:n|4|}],update[inc{value|order|:n|1|}]];",
  },
  {
    name: "Example Find test with num greater than 4",
    json: {
      collection: "test",
      pipeline: {
        find: {
          gt: {
            path: "num",
            value: 4,
          },
        },
      },
    },
    tyson: "collection|test|:find[gt{value|num|:n|4|}];",
  },
  {
    name: "Example Find 6th+ test(s) with num not >= 4",
    json: {
      collection: "test",
      pipeline: [
        {
          find: {
            not: {
              gte: {
                path: "num",
                value: 4,
              },
            },
          },
        },
        {
          offset: 5,
        },
      ],
    },
    tyson: "collection|test|:q[find[not(gte{value|num|:n|4|})],offset(n|5|)];",
  },
  {
    name: "Example Find 6th+ test(s) with num not >= 4",
    json: {
      collection: "test",
      pipeline: [
        {
          find: {
            lt: {
              path: "num",
              value: 5,
            },
          },
        },
        {
          delete: true,
        },
      ],
    },
    tyson: "collection|test|:q[find[lt{value|num|:n|5|}],delete];",
  },
  {
    name: "Insert Node with Complex Object",
    json: {
      collection: "test",
      pipeline: {
        insert: [
          {
            friends: [
              {
                type: "person",
                name: "bob",
              },
            ],
          },
        ],
      },
    },
    tyson:
      "collection|test|:insert[m{s|friends|:v[m{s|type|:s|person|,s|name|:s|bob|}]}];",
  },
  {
    name: "Response example",
    json: {
      ok: {
        data: [
          {
            _collection: "test",
            _id: "e2a7233b-024e-4883-a2a0-8d60b8a78bc9",
            _value: null,
          },
          {
            _collection: "test",
            _id: "14ade9c7-ea2a-407d-b0ba-f5b8fa442439",
            _value: 42,
          },
          {
            _collection: "test",
            _id: "f00a4018-a440-496d-b37b-7798d3994cd4",
            _value: {
              friends: [
                {
                  name: "bob",
                  type: "person",
                },
              ],
            },
          },
          {
            _collection: "test",
            _id: "ae62beee-3140-44a6-a4b0-cbaf5da10d58",
            _value: "foo",
          },
          {
            _collection: "test",
            _id: "955b6806-ef30-4c5f-b3d0-aaca09b3384b",
            _value: {
              text: "Lorem Ipsum!",
              key: 1,
            },
          },
          {
            _collection: "test",
            _id: "09fced66-7e7e-464e-b0e5-1261d9e69a10",
            _value: [1, 2],
          },
          {
            _collection: "test",
            _id: "bcbf6bba-cc22-417f-95a4-76d9b6145653",
            _value: true,
          },
          {
            _collection: "test",
            _id: "10f2e763-76f1-4e02-8299-cf127cc41325",
            _value: new Date("2009-02-13T23:31:30.000Z"),
          },
        ],
        meta: {
          count: 8,
        },
      },
    },
    tyson: `result:ok[
        response{
          s|data|:objects{
            test|e2a7233b-024e-4883-a2a0-8d60b8a78bc9|:null,
            test|14ade9c7-ea2a-407d-b0ba-f5b8fa442439|:n|42|,
            test|f00a4018-a440-496d-b37b-7798d3994cd4|:m{
              s|friends|:v[
                m{
                  s|name|:s|bob|,
                  s|type|:s|person|
                }
              ]
            },
            test|ae62beee-3140-44a6-a4b0-cbaf5da10d58|:s|foo|,
            test|955b6806-ef30-4c5f-b3d0-aaca09b3384b|:m{
              s|text|:s|Lorem Ipsum!|,
              s|key|:n|1|
            },
            test|09fced66-7e7e-464e-b0e5-1261d9e69a10|:v[n|1|,n|2|],
            test|bcbf6bba-cc22-417f-95a4-76d9b6145653|:b|true|,
            test|10f2e763-76f1-4e02-8299-cf127cc41325|:uts|1234567890|
          },
          s|meta|:find_meta{
            s|count|:n|8|
          },
        }
      ]`.replace(/[\r\n]+\s*/g, ""),
  },
  {
    name: "Response Error example",
    json: {
      error: "Fetch recursion error",
    },
    tyson: `result:error|Fetch recursion error|;`,
  },
  {
    name: "Example Insert Test",
    json: {
      ok: {
        ids: [
          {
            id: "c33f4b53-594e-40b1-8f52-8e59415f2d4d",
            type: "test",
          },
        ],
        meta: {
          count: 1,
        },
      },
    },
    tyson:
      "result:ok[response{s|data|:ids[test|c33f4b53-594e-40b1-8f52-8e59415f2d4d|],s|meta|:insert_meta{s|count|:n|1|},}]",
  },
]

interface testOptions {
  verbose?: boolean
  run?: ("encode" | "decode")[]
}
const runTests = (
  tests: Test[],
  { verbose = false, run = ["encode", "decode"] }: testOptions
) => {
  var testCount = 0
  var passed = 0
  tests.forEach((test) => {
    if (verbose) console.log(`🧪 Processing Test: ${test.name}`)
    var resultOnly = test.tyson.startsWith("result:")
    if (verbose && resultOnly) console.log(`    📬 Result Only Test`)
    if (!resultOnly && run.includes("encode")) {
      testCount++
      var encodeResult: any
      try {
        encodeResult = encodeTyson(test.json as Query)
        if (encodeResult !== test.tyson) {
          console.log(`❌ Encode Test "${test.name}" failed!`)
          if (verbose) {
            console.log(`    JSON: ${JSON.stringify(test.json)}`)
            console.log(`    ⚠️   Expected: ${test.tyson}`)
            console.log(`    ⛔  Received: ${encodeResult}`)
          }
        } else {
          passed++
          console.log(`✅ Encode Test "${test.name}" passed!`)
          if (verbose) {
            console.log(`    JSON: ${JSON.stringify(test.json)}`)
            console.log(`    🔬  Expected: ${test.tyson}`)
            console.log(`    💯  Received: ${encodeResult}`)
          }
        }
      } catch (e) {
        console.log(`☠️  Encoding Tyson for "${test.name}" errored!`)
        console.warn(e)
      }
    }
    if (run.includes("decode")) {
      testCount++
      var undecoded: any
      var decodeResult: any
      try {
        const [_undecoded, _decodeResult] = decodeTyson(test.tyson)
        undecoded = _undecoded
        decodeResult = _decodeResult
        if (undecoded.length > 0) {
          console.log(
            `❌ Decode Test "${test.name}" not fully decoded!: "${undecoded}"`
          )
        }
        if (JSON.stringify(decodeResult) !== JSON.stringify(test.json)) {
          console.log(`❌ Decode Test "${test.name}" failed!`)
          if (verbose) {
            console.log(`    Tyson: ${test.tyson}`)
            console.log(`    ⚠️   Expected: ${JSON.stringify(test.json)}`)
            console.log(`    ⛔  Received: ${JSON.stringify(decodeResult)}`)
          }
        } else {
          passed++
          console.log(`✅ Decode Test "${test.name}" passed!`)
          if (verbose) {
            console.log(`    Tyson: ${test.tyson}`)
            console.log(`    🔬  Expected: ${JSON.stringify(test.json)}`)
            console.log(`    💯  Received: ${JSON.stringify(decodeResult)}`)
          }
        }
      } catch (e) {
        console.log(`☠️  Decoding Tyson for "${test.name}" errored!`)
        console.warn(e)
      }
    }
  })

  return Math.floor((passed / testCount) * 100)
}

const pass = runTests(tests, { verbose: true, run: ["encode", "decode"] })

console.log(`Passed ${pass}% of tests.\n`)

if (pass === 100) {
  console.log("Encoding and Decoding TySON works!\n")
  console.log(
    "🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉\n" +
      "🎉  All tests passed! 🎉\n" +
      "🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉\n"
  )
  console.log("Try adding some more tests...")
  console.log("TODO: Add tests for client on a local db instance.")
}
