import AnnaTS from '../src'
import { Query, TysonDecoded } from '../src/types'

type Test =
  | {
      name: string
      json: TysonDecoded
      tyson: string
    }
  | {
      query: true
      name: string
      json: Query
      tyson: string
    }

const client = new AnnaTS()

const tests: Test[] = [
  {
    name: 'Example General Insert',
    json: {
      collection: 'test',
      pipeline: {
        insert: [
          'foo',
          100,
          true,
          [1, 2, 3],
          {
            bar: 'baz',
          },
        ],
      },
    },
    tyson:
      'collection|test|:insert[s|foo|,n|100|,b|true|,v[n|1|,n|2|,n|3|],m{s|bar|:s|baz|}];',
    query: true,
  },
  {
    name: 'Get one item from test collection with get operation by ID',
    json: {
      collection: 'test',
      pipeline: [
        {
          get: {
            type: 'test',
            id: '0c49129e-3730-4d8a-a0a2-8330c15aec3f',
          },
        },
      ],
    },
    tyson:
      'collection|test|:q[get[test|0c49129e-3730-4d8a-a0a2-8330c15aec3f|]];',
    query: true,
  },
  {
    name: 'Find all test collection',
    json: {
      collection: 'test',
      pipeline: {
        find: [],
      },
    },
    tyson: 'collection|test|:find[];',
    query: true,
  },
  {
    name: 'Increment all points collection root value by 3',
    json: {
      collection: 'points',
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
    tyson: 'collection|points|:q[find[],update[inc{root:n|3|}]];',
    query: true,
  },
  {
    name: 'Increase every students grade by 10 and set their pass property to true',
    json: {
      collection: 'students',
      pipeline: [
        {
          find: [],
        },
        {
          update: [
            {
              inc: { path: 'grade', by: 10 },
            },
            {
              set: { path: 'pass', value: true },
            },
          ],
        },
      ],
    },
    tyson:
      'collection|students|:q[find[],update[inc{value|grade|:n|10|},set{value|pass|:b|true|}]];',
    query: true,
  },
  {
    name: 'Example Root root string update by get operation',
    json: {
      collection: 'categories',
      pipeline: [
        {
          get: {
            type: 'categories',
            id: '0c49129e-3730-4d8a-a0a2-8330c15aec3f',
          },
        },
        {
          update: {
            set: {
              root: 'chocolate',
            },
          },
        },
      ],
    },
    tyson:
      'collection|categories|:q[get[categories|0c49129e-3730-4d8a-a0a2-8330c15aec3f|],update[set{root:s|chocolate|}]];',
    query: true,
  },
  {
    name: 'Example Find First 5 Sorted by `num`',
    json: {
      collection: 'test',
      pipeline: [
        {
          find: [],
        },
        {
          sort: {
            asc: 'num',
          },
        },
        {
          limit: 5,
        },
      ],
    },
    tyson: 'collection|test|:q[find[],sort[asc(value|num|)],limit(n|5|)];',
    query: true,
  },
  {
    name: 'Increment all category order over 4 by 1',
    json: {
      collection: 'categories',
      pipeline: [
        {
          find: {
            gt: {
              path: 'order',
              value: 4,
            },
          },
        },
        {
          update: {
            inc: {
              path: 'order',
              by: 1,
            },
          },
        },
      ],
    },
    tyson:
      'collection|categories|:q[find[gt{value|order|:n|4|}],update[inc{value|order|:n|1|}]];',
    query: true,
  },
  {
    name: 'Example Find test with num greater than 4',
    json: {
      collection: 'test',
      pipeline: {
        find: {
          gt: {
            path: 'num',
            value: 4,
          },
        },
      },
    },
    tyson: 'collection|test|:find[gt{value|num|:n|4|}];',
    query: true,
  },
  {
    name: 'Example Find 6th+ test(s) with num not >= 4',
    json: {
      collection: 'test',
      pipeline: [
        {
          find: {
            not: {
              gte: {
                path: 'num',
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
    tyson: 'collection|test|:q[find[not(gte{value|num|:n|4|})],offset(n|5|)];',
    query: true,
  },
  {
    name: 'Example Find 6th+ test(s) with num not >= 4',
    json: {
      collection: 'test',
      pipeline: [
        {
          find: {
            lt: {
              path: 'num',
              value: 5,
            },
          },
        },
        {
          delete: true,
        },
      ],
    },
    tyson: 'collection|test|:q[find[lt{value|num|:n|5|}],delete];',
    query: true,
  },
  {
    name: 'Insert Node with Complex Object',
    json: {
      collection: 'test',
      pipeline: {
        insert: [
          {
            friends: [
              {
                type: 'person',
                name: 'bob',
              },
            ],
          },
        ],
      },
    },
    tyson:
      'collection|test|:insert[m{s|friends|:v[m{s|type|:s|person|,s|name|:s|bob|}]}];',
    query: true,
  },
  {
    name: 'Response example',
    json: {
      ok: {
        data: [
          {
            _collection: 'test',
            _id: 'e2a7233b-024e-4883-a2a0-8d60b8a78bc9',
            _value: null,
          },
          {
            _collection: 'test',
            _id: '14ade9c7-ea2a-407d-b0ba-f5b8fa442439',
            _value: 42,
          },
          {
            _collection: 'test',
            _id: 'f00a4018-a440-496d-b37b-7798d3994cd4',
            _value: {
              friends: [
                {
                  name: 'bob',
                  type: 'person',
                },
              ],
            },
          },
          {
            _collection: 'test',
            _id: 'ae62beee-3140-44a6-a4b0-cbaf5da10d58',
            _value: 'foo',
          },
          {
            _collection: 'test',
            _id: '955b6806-ef30-4c5f-b3d0-aaca09b3384b',
            _value: {
              text: 'Lorem Ipsum!',
              key: 1,
            },
          },
          {
            _collection: 'test',
            _id: '09fced66-7e7e-464e-b0e5-1261d9e69a10',
            _value: [1, 2],
          },
          {
            _collection: 'test',
            _id: 'bcbf6bba-cc22-417f-95a4-76d9b6145653',
            _value: true,
          },
          {
            _collection: 'test',
            _id: '10f2e763-76f1-4e02-8299-cf127cc41325',
            _value: new Date('2009-02-13T23:31:30.000Z'),
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
      ]`.replace(/[\r\n]+\s*/g, ''),
  },
  {
    name: 'Response Error example',
    json: {
      error: 'Fetch recursion error',
    },
    tyson: 'result:error|Fetch recursion error|;',
  },
  {
    name: 'Example Insert Test',
    json: {
      ok: {
        ids: [
          {
            id: 'c33f4b53-594e-40b1-8f52-8e59415f2d4d',
            type: 'test',
          },
        ],
        meta: {
          count: 1,
        },
      },
    },
    tyson:
      'result:ok[response{s|data|:ids[test|c33f4b53-594e-40b1-8f52-8e59415f2d4d|],s|meta|:insert_meta{s|count|:n|1|},}]',
  },
]

test.each(tests.map((t, i) => [t.name, t]))('%s', (name, t) => {
  expect(client.decode(t.tyson)).toEqual(t.json)
  if (t.hasOwnProperty('query')) {
    expect(client.encode(t.json as Query)).toEqual(t.tyson)
  }
})

afterAll(async () => {
  // try {
  //   client.close()
  // } catch (err) {
  //   console.log(`You did something wrong: ${err}`)
  //   throw err
  // }
})
