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

    // const statements
    const_statement: $ => seq(
      'const',
      field('type', $.const_type),
      field('name', $.identifier),
      '=',
      field('value', $.const_value),
      ';',
    ),

    const_type: $ => choice(
      $.primitive_type,
      $.identifier,
    ),

    const_value: $ => choice(
      $.boolean_literal,
      $.float_literal,
      $.integer_literal,
    ),

    // literals
    integer_literal: $ => $._integer,
    boolean_literal: $ => choice('true', 'false'),
    float_literal: $ => choice(
      $._decimal,
      '-Infinity',
      'Infinity',
      'NaN',
    ),

    // types
    distinguishable_type: $ => seq(
      choice(
        $.primitive_type,
        $.string_type,
        $.identifier,
        'object',
        'symbol',
        $.buffer_related_type,
        'undefined',
      ),
      optional('?'),
    ),

    buffer_related_type: $ => choice(
      'ArrayBuffer',
      'SharedArrayBuffer',
      'DataView',
      'Int8Array',
      'Int16Array',
      'Int32Array',
      'Uint8Array',
      'Uint16Array',
      'Uint32Array',
      'Uint8ClampedArray',
      'BigInt64Array',
      'BigUint64Array',
      'Float16Array',
      'Float32Array',
      'Float64Array',
    ),

    primitive_type: $ => seq(
      $.integer_type,
      $.float_type,
      'boolean',
      'byte',
      'octet',
      'bigint',
    ),

    integer_type: $ => seq(
      optional('unsigned'),
      choice(
        'short',
        seq('long', optional('long')),
      ),
    ),

    float_type: $ => seq(
      optional('restricted'),
      choice('float', 'double'),
    ),

    string_type: $ => choice(
      'ByteString',
      'DOMString',
      'USVString',
    ),

    identifier_list: $ => sepByComma($.identifier),

    // terminal symbols
    _integer: $ => /-?([1-9][0-9]*|0[Xx][0-9A-Fa-f]+|0[0-7]*)/,
    _decimal: $ => /-?(([0-9]+\.[0-9]*|[0-9]*\.[0-9]+)([Ee][+-]?[0-9]+)?|[0-9]+[Ee][+-]?[0-9]+)/,
    identifier: $ => /[_-]?[A-Za-z][0-9A-Z_a-z-]*/,
    string: $ => /"[^"]*"/,
    other: $ => /[^\t\n\r 0-9A-Za-z]/,
    whitespace: $ => /[\t\n\r ]+/,
    comment: $ => /\/\/.*|\/\*(.|\n)*?\*\//,
  }
});

/**
 * @param {RuleOrLiteral} rule
 * @returns SeqRule
 */
function sepByComma(rule) {
  return seq(
    rule,
    repeat(seq(',', rule)),
    optional(','),
  )
}
