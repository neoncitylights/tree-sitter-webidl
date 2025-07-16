# tree-sitter-webidl
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)

WebIDL grammar for tree-sitter.

- [WebIDL Living Standard](https://webidl.spec.whatwg.org) (webidl.spec.whatwg.org)

> [!NOTE]
> This tree-sitter grammar is functionally complete as it implements the entire WebIDL grammar. However, it is currently being optimized so that it produces a smaller AST.

## Developing
1. Install the `tree-sitter` CLI. ([Instructions available](https://tree-sitter.github.io/tree-sitter/creating-parsers/1-getting-started.html#installation))
1. Run `npm install`.
1. Make any needed changes to `grammar.js`.
1. Run `tree-sitter generate` to generate the grammar; ensure there are no ambiguity errors.
1. [Write parser tests](https://tree-sitter.github.io/tree-sitter/creating-parsers/5-writing-tests.html) in the path `test/corpus`, either in existing files or new files.
1. Run `tree-sitter test`; ensure parser tests pass.
1. Repeat steps 3-6 as needed.

## License
This software is licensed under the MIT license ([`LICENSE`](./LICENSE) or <https://opensource.org/license/mit/>).

### Contribution
Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the MIT license, shall be licensed as above, without any additional terms or conditions.
