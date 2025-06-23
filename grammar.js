/**
 * @file WebIDL grammar for tree-sitter
 * @author Samantha Nguyen <contact@samanthanguyen.me>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "webidl",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});
