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
    $._whitespace,
    $.comment,
  ],

  supertypes: $ => [
    $._definition,
  ],

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => repeat($._definition),

    _definition: $ => choice(
      $.includes_statement,
    ),

    // arguments
    argument_name_keyword: $ => choice(
      'async',
      'attribute',
      'callback',
      'const',
      'constructor',
      'deleter',
      'dictionary',
      'enum',
      'getter',
      'includes',
      'inherit',
      'interface',
      'iterable',
      'maplike',
      'mixin',
      'namespace',
      'partial',
      'readonly',
      'required',
      'setlike',
      'setter',
      'static',
      'stringifier',
      'typedef',
      'unrestricted',
    ),

    argument_list: $ => sepByComma1NoTrailing($.argument),

    argument: $ => choice(
      seq(
        'optional',
        $.argument_name,
        $.default,
      ),
      seq(
        $.type,
        $.ellipsis,
        $.argument_name,
      ),
    ),

    argument_name: $ => choice(
      $.argument_name_keyword,
      $.identifier,
    ),

    ellipsis: $ => optional('...'),

    // includes statement
    includes_statement: $ => seq(
      field('includer', $.identifier),
      'includes',
      field('includee', $.identifier),
      ';'
    ),

    // const statement
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

    // default values
    default: $ => seq('=', $.default_value),
    default_value: $ => choice(
      'ConstValue',
      'string',
      seq('[', ']'),
      seq('{', '}'),
      'null',
      'undefined',
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
    type: $ => choice(
      $.single_type,
      seq($.union_type, optional('?')),
    ),

    single_type: $ => choice(
      $.distinguishable_type,
      'any',
      $.promise_type,
    ),

    union_type: $ => seq(
      '(',
      $.union_or_expression,
      ')'
    ),

    union_or_expression: $ => prec.left(seq(
      field('left', $.union_member_type),
      'or',
      field('right', choice($.union_or_expression, $.union_member_type))
    )),

    union_member_type: $ => choice(
      $.distinguishable_type,
      $.union_type,
    ),

    // builtin types
    distinguishable_type: $ => seq(
      choice(
        $.primitive_type,
        $.string_type,
        $.identifier,
        'object',
        'symbol',
        $.buffer_related_type,
        $.record_type,
        'undefined',
      ),
      optional('?'),
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

    promise_type: $ => seq('promise', '<', $.type, '>'),

    // todo: make second generic type a type_with_extended_attributes
    record_type: $ => seq('record', '<', $.string_type, $.type, '>'),

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

    identifier_list: $ => sepByComma1NoTrailing($.identifier),

    // terminal symbols
    _integer: $ => /-?([1-9][0-9]*|0[Xx][0-9A-Fa-f]+|0[0-7]*)/,
    _decimal: $ => /-?(([0-9]+\.[0-9]*|[0-9]*\.[0-9]+)([Ee][+-]?[0-9]+)?|[0-9]+[Ee][+-]?[0-9]+)/,
    identifier: $ => /[_-]?[A-Za-z][0-9A-Z_a-z-]*/,
    string: $ => /"[^"]*"/,
    other: $ => /[^\t\n\r 0-9A-Za-z]/,
    _whitespace: $ => /[\t\n\r ]+/,
    comment: $ => /\/\/.*|\/\*(.|\n)*?\*\//,
  }
});

/**
 * @param {RuleOrLiteral} rule
 * @returns SeqRule
 */
function sepByComma1NoTrailing(rule) {
  return seq(
    rule,
    repeat(seq(',', rule)),
  )
}
