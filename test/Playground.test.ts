import AnnaTS from '../src/'

const client = new AnnaTS()

const testCollection = 'tsClientTest'

let testID: string | undefined

beforeAll(async () => {
  return client
    .query({
      collection: testCollection,
      pipeline: {
        insert: 42,
      },
    })
    .then((res) => {
      testID = res?.[0]?.ok?.ids?.[0]?.id || ''
    })
})

test('Insert', () => {
  expect(testID?.length).toBe(36)
})

test('Get', () => {
  if (testID === undefined) throw new Error('ID is undefined')
  client
    .query({
      collection: testCollection,
      pipeline: {
        get: {
          type: testCollection,
          id: testID,
        },
      },
    })
    .then((res) => {
      expect(res?.[0]?.ok?.data?.[0]?._value).toBe(42)
    })
})

test('Delete', () => {
  if (testID === undefined) throw new Error('ID is undefined')
  client
    .query({
      collection: testCollection,
      pipeline: [
        {
          get: {
            type: testCollection,
            id: testID,
          },
        },
        { delete: true },
      ],
    })
    .then((res) => {
      expect(res?.[0]?.ok?.meta?.count).toBe(1)
    })
})

test('Get Deleted', () => {
  if (testID === undefined) throw new Error('ID is undefined')
  client
    .query({
      collection: testCollection,
      pipeline: {
        get: {
          type: testCollection,
          id: testID,
        },
      },
    })
    .then((res) => {
      expect(res?.[0]?.ok?.meta?.count).toBe(0)
    })
})
