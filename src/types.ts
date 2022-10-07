type uts = Date
export type Link = { type: string; id: string }
type Scalar = string | number | boolean | null | uts
export type ScalarVectorMap =
  | Scalar
  | { [key: string]: ScalarVectorMap }
  | ScalarVectorMap[]
export type ScalarOrMap =
  | Scalar
  | (ScalarVectorMap | { [key: string]: ScalarVectorMap })[]
export type ScalarOrLink =
  | Scalar
  | Link
  | { [key: string]: ScalarOrLink }
  | ScalarOrLink[]

type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<Record<Exclude<Keys, K>, undefined>>
  }[Keys]

export type ArrayAtLeastOne<T> = [T, ...T[]]
type ArrayOnlyOne<T> = [T, ...[]]
type OneOrArrayAtLeastOne<T> = T | ArrayAtLeastOne<T>
type OneOrMany<T> = T | T[]

export interface RootOp<T = ScalarOrLink> {
  root: T
}

export interface PathOp<T = ScalarOrLink> {
  path: string
  value: T
}

export type RootOrPathOp = RootOp | PathOp

export interface ComparisonOperators {
  eq?: RootOrPathOp
  neq?: RootOrPathOp
  gt?: RootOrPathOp
  gte?: RootOrPathOp
  lt?: RootOrPathOp
  lte?: RootOrPathOp
}
type ComparisonOperator = RequireOnlyOne<ComparisonOperators>

export interface LogicalOperators extends ComparisonOperators {
  and?: ArrayAtLeastOne<LogicOpOrCompOp>
  or?: ArrayAtLeastOne<LogicOpOrCompOp>
  not?: LogicOpOrCompOp
}
export type LogicalOperator = RequireOnlyOne<LogicalOperators>
export type LogicOpOrCompOp = LogicalOperator | ComparisonOperator

export type InsertVector = { [key: string]: InsertOp }
export type InsertOp = InsertVector | ScalarOrLink | [InsertOp, ...InsertOp[]]
export type GetOps = OneOrArrayAtLeastOne<Link>
export type FindOps = OneOrMany<LogicalOperator>
export type SortOp = RequireOnlyOne<{ [key in 'asc' | 'desc']?: string }>
export type SortOps = OneOrArrayAtLeastOne<SortOp>
// this is a tuple of operations to prevent the RootOp more than once
export type SetOpTuple = [RootOrPathOp, ...PathOp[]]
export type SetOps = RootOrPathOp | SetOpTuple
export type IncOpRoot = { root: number }
export type IncOpPath = { path: string; by: number }
export type IncOp = IncOpRoot | IncOpPath
export type IncOps = OneOrArrayAtLeastOne<IncOp>
export interface UpdateOperations {
  set?: SetOps
  inc?: IncOps
}
export type UpdateOp = RequireOnlyOne<UpdateOperations>
export type UpdateOps = UpdateOp | [UpdateOp, ...UpdateOp[]]

export type OpKeys =
  | 'insert'
  | 'get'
  | 'find'
  | 'sort'
  | 'limit'
  | 'offset'
  | 'update'
  | 'delete'
export type Ops =
  | InsertOp
  | GetOps
  | FindOps
  | SortOps
  | number
  | UpdateOps
  | boolean

interface Insert {
  insert: InsertOp
}

interface Roots {
  get?: GetOps
  find?: FindOps
}
export type Root = RequireOnlyOne<Roots>

export interface Operators extends Roots {
  sort?: SortOps
  limit?: number
  offset?: number
}
export type Operator = RequireOnlyOne<Operators>

interface Mutators {
  update?: UpdateOp | [UpdateOp, ...UpdateOp[]]
  delete?: true
}
export type Mutation = RequireOnlyOne<Mutators>

export interface AllOps {
  insert?: Insert['insert']
  get?: Roots['get']
  find?: Roots['find']
  sort?: Operators['sort']
  limit?: Operators['limit']
  offset?: Operators['offset']
  update?: Mutators['update']
  delete?: Mutators['delete']
}

export type AnyOp = RequireOnlyOne<AllOps>

export type Op = Operator | Mutation

export type SinglePipe = Root | Insert
export type MaybeArrayPipe = ArrayPipe | []
export type ArrayPipe =
  | ArrayOnlyOne<Insert>
  | ArrayOnlyOne<Root>
  | [Root, ...Operator[]]
  | [Root, Mutation]
  | [Root, ...Operator[], Mutation]
  | [Root, ...Operator[], Operator | Mutation]

export type Pipe = SinglePipe | ArrayPipe

export interface Query {
  collection: string
  pipeline: Pipe
}

export interface Results {
  ok: Response
  error: string
}
export type Result = RequireOnlyOne<Results>

export interface Response {
  data?: IObject[]
  meta?: Meta
  ids?: Link[]
}

export interface Meta extends Partial<Record<string, ScalarVectorMap>> {
  count?: number
}

export interface IObject {
  _id: string
  _collection: string
  _value: ScalarVectorMap
}

export type QueryOrResult = Query | Result
export type TysonDecoded = OneOrMany<QueryOrResult>

export type FuncDecodeMeta = (tyson: string) => [tyson: string, meta: Meta]
export type FuncDecodeDate = (tyson: string) => [tyson: string, date: Date]
export type FuncDecodeBool = (tyson: string) => [tyson: string, bool: boolean]
export type FuncDecodeNumber = (
  tyson: string
) => [tyson: string, number: number]
export type FuncDecodeString = (
  tyson: string,
  allowEmpty?: boolean
) => [tyson: string, string: string]
export type FuncDecodeMap = (
  tyson: string,
  allowItemRef: boolean,
  dmap?: Record<string, ScalarVectorMap>
) => [tyson: string, map: Record<string, ScalarVectorMap>]
export type FuncDecodeVector = (
  tyson: string,
  allowItemRef: boolean,
  vector?: ScalarVectorMap[]
) => [tyson: string, vector: ScalarVectorMap[]]
export type FuncDecodeScalar = (
  tyson: string,
  allowItemRef: boolean
) => [tyson: string, scalar: ScalarVectorMap]
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type FuncDecodeID = (tyson: string) => [tyson: string, link: Link]
export type FuncDecodeIDs = (
  tyson: string,
  ids?: Link[]
) => [tyson: string, ids: Link[]]
export type FuncDecodeCollectionID = (
  tyson: string
) => [tyson: string, object: Omit<IObject, '_value'>]
export type FuncDecodeItemSet = (
  tyson: string,
  items?: IObject[]
) => [tyson: string, items: IObject[]]
export type FuncDecodeItemMap = (
  tyson: string,
  items?: Record<string, ScalarVectorMap>
) => [tyson: string, map: Record<string, ScalarVectorMap>]
export type FuncDecodeObjects = (
  tyson: string
) => [tyson: string, objects: IObject[]]
export type FuncDecodeResponse = (
  tyson: string,
  ok?: Partial<Response>
) => [tyson: string, response: { ok: Partial<Response> }]
export type FuncDecodeResponses = (tyson: string) => [
  tyson: string,
  response: {
    ok: Partial<Response>
  }
]
export type FuncDecodeError = (
  tyson: string
) => [tyson: string, error: Exclude<Result, 'error'>]
export type FuncDecodeResult = (
  tyson: string
) => [tyson: string, result: Result]
export type FuncDecodeCollection = (
  tyson: string
) => [tyson: string, collection: string]
export type FuncDecodePathOrOp = (
  tyson: string
) => [tyson: string, pathOrOp: RootOrPathOp]
export type FuncDecodeLogicalOperation = (
  tyson: string
) => [tyson: string, op: LogicalOperator]
export type FuncDecodeSortOp = (
  tyson: string,
  sortOps?: SortOp[]
) => [tyson: string, sortOp: SortOps]
export type FuncDecodeIncrementOp = (
  tyson: string,
  increments?: IncOpPath[]
) => [string, IncOps]
export type FuncDecodeUpdateOperations = (
  tyson: string,
  operations?: UpdateOp[]
) => [tyson: string, op: UpdateOps]
export type FuncDecodeOperation = (
  tyson: string,
  root?: boolean
) => [tyson: string, operation: AnyOp]
export type FuncDecodeQuery = (tyson: string) => [tyson: string, query: Query]
export type FuncDecodeTyson = (
  tyson: string,
  decodedArray?: QueryOrResult[]
) => [tyson: string, decoded: TysonDecoded]
export type Decode = (tyson: string) => TysonDecoded
export type FuncSkipChars = (tyson: string, chars?: string[]) => string
export type AnnaDbUri = `annadb://${string}`
export interface AnnaClientConstruct {
  uri?: AnnaDbUri
  port?: number
}
