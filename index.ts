import { decodeTyson } from "./decode"
import { encodeTyson } from "./encode"
import { AnnaClientConstruct, AnnaDbUri, Decode, Query, Result } from "./types"
import zmq from "zeromq"

class AnnaClient {
  private uri: AnnaDbUri = "annadb://playground.annadb.dev"
  private port: number = 10001
  private socket = zmq.socket("req")

  constructor(options: AnnaClientConstruct = {}) {
    this.uri = options?.uri ?? this.uri
    this.port = options?.port ?? this.port
  }

  public connect = () => {
    // from url get host
    const host = new URL(this.uri).hostname
    this.socket = zmq.socket("req").connect(`tcp://${host}:${this.port}`)
  }

  public close = () => {
    this.socket.close()
  }

  public queryTySON = async (TySON: string) => {
    this.connect()
    this.decode(TySON)
    this.socket.send(TySON)
    const res = await new Promise<string>((res, rej) => {
      var data: string | undefined
      this.socket.once("message", (raw: Buffer) => {
        data = raw.toString()
        this.socket.close()
        res(data as string)
      })
      this.socket.on("error", (err) => {
        this.socket.close()
        rej(err)
      })
    })
    return res
  }

  public query = async (query: Query) => {
    const TySON = encodeTyson(query)
    const res = await this.queryTySON(TySON)
    var decoded = this.decode(res)
    if (!Array.isArray(decoded)) decoded = [decoded]
    return decoded as Result[]
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
