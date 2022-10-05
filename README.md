# AnnaDB TS-Client

[![AnnaDB Logo](https://annadb.dev/assets/img/logo_colored.svg)](https://annadb.dev)![And](https://cdn.iconscout.com/icon/free/png-128/mobile-keyboard-key-program-ampersand-and-11559.png)![TypeScript Logo](https://ih1.redbubble.net/image.560011559.2881/raf,128x128,075,f,101010:01c5ca27c6.u2.jpg)

This is a typescript client built for type-safe query creation.

AnnaDB uses a custom query language dubbed [TySON](https://github.com/roman-right/tyson)

## Road Map

- Version `0.0.1`
  - [x] Create TS types around the TySON syntax
  - [x] Encode JS Objects into TySON
- Version `0.0.2`
  - [x] Decode TySON into JS Objects
  - [*] Handle encoding of `uts` (Unix TimeStamps) better if input is date string and not a `Date` object

* Note: There really isn't a good way to handle date objects in JSON. JSON stringifies date objects into formatted date strings. This is not a problem for the client as it can handle date strings. However, the server will not be able to handle date strings. The server will only accept `uts` (Unix TimeStamps) which are integers. The client will need to be able to handle this conversion. This leaves a bug right now that if you are encoding insert TySON from JSON, that date objects will not be encoded as `uts` but as strings instead.

- Version `0.1.0`

  - [x] Create Client connection to annadb using uri string like `annadb://playground.annadb.dev:10001`

- Version `1.0.0`

  - [ ] Release as NPM module and public to NPM
  - [ ] Create a Schema Definition Language (SDL) for AnnaDB or alternatively just use TypeScript types.
  - [ ] Pass a data model into the TySON Query type, enabling strongly typed inputs/responses that conform to the model.

- Version `2.0.0`

  - [ ] Generate a spec-free GraphQL API (no introspection)
  - [ ] Generate a spec-compliant GraphQL API (w/introspection)

- Version `3.0.0`
  - [ ] Depending upon security/auth built into AnnaDB, build a auth layer inside of this TS Client
  - [ ] Data Input Constraints for strings
  - [ ] Data Input Constraints for numbers
  - [ ] Data Input Constraints for vertexes (arrays)
  - [ ] Data Input Constraints for maps (objects)
