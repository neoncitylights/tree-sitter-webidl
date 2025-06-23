/**
 * @file WebIDL grammar for tree-sitter
 * @author Samantha Nguyen <contact@samanthanguyen.me>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "webidl",
  extras: $ => [
    $.whitespace,
    $.comment,
  ],

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => seq(),

    identifier_list: $ => seq(
      $.identifier,
      repeat(seq(',', $.identifier)),
      optional(','),
    ),

    // terminal symbols
    integer: $ => /-?([1-9][0-9]*|0[Xx][0-9A-Fa-f]+|0[0-7]*)/,
    decimal: $ => /-?(([0-9]+\.[0-9]*|[0-9]*\.[0-9]+)([Ee][+-]?[0-9]+)?|[0-9]+[Ee][+-]?[0-9]+)/,
    identifier: $ => /[_-]?[A-Za-z][0-9A-Z_a-z-]*/,
    string: $ => /"[^"]*"/,
    other: $ => /[^\t\n\r 0-9A-Za-z]/,
    whitespace: $ => /[\t\n\r ]+/,
    comment: $ => /\/\/.*|\/\*(.|\n)*?\*\//,
  }
});
