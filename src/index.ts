import { decodeTyson } from './decode'
import { encodeTyson } from './encode'
import {
  AnnaClientConstruct,
  AnnaDbUri,
  Decode,
  InsertType,
  Query,
  Result,
  ScalarVectorMap,
} from './types'
import zmq from 'zeromq'

class AnnaClient {
  private uri: AnnaDbUri = 'annadb://playground.annadb.dev'
  private port = 10001
  private socket: zmq.Socket | undefined

  constructor(options: AnnaClientConstruct = {}) {
    this.uri = options?.uri ?? this.uri
    this.port = options?.port ?? this.port
  }

  public connect = () => {
    if (this.socket !== undefined) {
      console.warn(`AnnaClient: socket already connected`)
    } else {
      const host = new URL(this.uri).hostname
      this.socket = zmq.socket('req').connect(`tcp://${host}:${this.port}`)
    }
  }

  public close = () => {
    if (this.socket === undefined) {
      return
    }
    this.socket?.close()
  }

  public queryTySON = async (TySON: string, autoClose = true) => {
    if (this.socket === undefined) this.connect()
    // decode Tyson to check for errors in string
    try {
      this.decode(TySON)
    } catch (err) {
      console.log(`Error decoding Tyson: ${err}`)
      throw err
    }
    if (this.socket === undefined) {
      throw new Error('No socket open')
    }
    this.socket.send(TySON)
    const res = await new Promise<string>((res, rej) => {
      let data: string | undefined
      this.socket?.once('message', (raw: Buffer) => {
        data = raw.toString()
        if (autoClose) this.socket?.close()
        res(data as string)
      })
      this.socket?.on('error', (err) => {
        this.socket?.close()
        rej(err)
      })
    })
    return res
  }

  public query = async <
    I extends InsertType = InsertType,
    R extends ScalarVectorMap = ScalarVectorMap
  >(
    query: Query<I>
  ) => {
    const TySON = encodeTyson(query)
    const res = await this.queryTySON(TySON)
    let decoded = this.decode(res)
    if (!Array.isArray(decoded)) decoded = [decoded]
    return decoded as Result<R>[]
  }

  public decode: Decode = (tyson) => {
    const [rTyson, res] = decodeTyson(tyson)
    if (rTyson.length > 0)
      throw new Error(
        `TySON result was not fully parsed. Remaining TySON: ${rTyson}`
      )
    return res
  }
  public encode = encodeTyson
}

export default AnnaClient
