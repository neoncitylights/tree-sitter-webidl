# tree-sitter-webidl
[![License: MIT][license-badge]][license-url]
[![CI][ci-badge]][ci-url]

[license-badge]: https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square
[license-url]: #license
[ci-badge]: https://img.shields.io/github/actions/workflow/status/neoncitylights/tree-sitter-webidl/.github/workflows/ci.yml?style=flat-square
[ci-url]: https://github.com/neoncitylights/tree-sitter-webidl/actions/workflows/ci.yml

An unofficial WebIDL grammar for tree-sitter.

- [WebIDL Living Standard](https://webidl.spec.whatwg.org) (webidl.spec.whatwg.org)

## Compliance
The tree-sitter grammar has unit tests in [`test/corpus`](./test/corpus), and is also tested against some major browser engines and JS runtimes that contain WebIDL files:

- Firefox browser ([mozilla-firefox/firefox](https://github.com/mozilla-firefox/firefox]))
- WebKit engine ([WebKit/WebKit](https://github.com/WebKit/WebKit]))
- Node.js runtime ([nodejs/node](https://github.com/nodejs/node]))
- Bun runtime ([oven-sh/bun](https://github.com/oven-sh/bun))
- Web Platform Tests suite ([web-platform-tests/wpt](https://github.com/web-platform-tests/wpt))

The tree-sitter grammar aims to be quite spec-compliant, although also tries to be backwards-compatible and tolerant with some non-compliant syntax (where reasonable). At this time, this repository does not have a grammar that implements Blink IDL (the WebIDL dialect that Chromium uses).

The following non-compliant syntaxes are implemented:
- Extended attribute that takes a string literal
- Extended attribute that takes an identifier expression (identifiers joined by either `&` or `|`)
- `UTF8String` as a valid `StringType` (compatibility with Firefox)
- Allow interfaces without body braces, e.g `interface Foo;`

The following non-compliant syntaxes are *not* implemented:
- Conditional C-like directives (including `#if`, `#else`, and `#endif`).
- Callbacks with the `constructor` keyword, written as `callback constructor`.
- Special operation members marked as `legacycaller`.

## Developing
1. Install the `tree-sitter` CLI. ([Instructions available](https://tree-sitter.github.io/tree-sitter/creating-parsers/1-getting-started.html#installation))
1. Run `npm install`.
1. Make any needed changes to `grammar.js`.
1. Run `tree-sitter generate` to generate the grammar; ensure there are no ambiguity errors.
1. [Write parser tests](https://tree-sitter.github.io/tree-sitter/creating-parsers/5-writing-tests.html) in the path `test/corpus`, either in existing files or new files.
1. Run `tree-sitter test`; ensure parser tests pass.
1. Repeat steps 3-6 as needed.

> [!TIP]
> To run a playground locally, prefer running `make playground` (instead of just `tree-sitter playground`). This command also runs `tree-sitter generate` + `tree-sitter build --wasm` beforehand to guarantee the playground will be up-to-date.

## License
This software is licensed under the MIT license ([`LICENSE`](./LICENSE) or <https://opensource.org/license/mit/>).

### Contribution
Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the MIT license, shall be licensed as above, without any additional terms or conditions.
