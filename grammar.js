/**
 * @file WebIDL grammar for tree-sitter
 * @author Samantha Nguyen <contact@samanthanguyen.me>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

import {
	sepByComma1,
	sepByComma1Trailing,
} from './grammar.utils.js'

export default grammar({
	name: "webidl",
	extras: $ => [
		$._whitespace,
		$.comment,
	],

	supertypes: $ => [
		$._definition,
	],

	rules: {
		source_file: $ => repeat($._definition),

		_definition: $ => choice(
			$.namespace_statement,
			$.dictionary_statement,
			$.enum_statement,
			$.typedef_statement,
			$.includes_statement,
		),

		// operations
		operation: $ => choice(
			$.regular_operation,
			$.special_operation,
		),

		regular_operation: $ => seq(
			$.type,
			$.operation_rest,
		),

		special_operation: $ => seq(
			$.special,
			$.regular_operation,
		),

		special: $ => choice(
			'getter',
			'setter',
			'deleter',
		),

		operation_rest: $ => seq(
			optional($.operation_name),
			'(',
			$.argument_list,
			')',
			';'
		),

		operation_name: $ => choice(
			$.operation_name_keyword,
			$.identifier,
		),

		operation_name_keyword: $ => 'includes',

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

		argument_list: $ => sepByComma1($.argument),

		argument: $ => choice(
			seq(
				'optional',
				field('type', $.type_with_extended_attributes),
				field('name', $.argument_name),
				optional($.default),
			),
			seq(
				field('type', $.type),
				optional($.ellipsis),
				field('name', $.argument_name),
			),
		),

		argument_name: $ => choice(
			$.argument_name_keyword,
			$.identifier,
		),

		ellipsis: $ => '...',

		// namespace statement
		namespace_statement: $ => seq(
			optional('partial'),
			'namespace',
			field('name', $.identifier),
			'{',
			optional($._namespace_members),
			'}',
			';'
		),

		_namespace_members: $ => repeat1($.namespace_member),

		namespace_member: $ => choice(
			$.regular_operation,
			// seq('readonly', $.attribute_rest),
			$.const_statement,
		),

		// dictionary statement
		dictionary_statement: $ => seq(
			choice(
				seq(
					'dictionary',
					field('name', $.identifier),
					optional($.inheritance),
				),
				seq(
					'partial',
					'dictionary',
					field('name', $.identifier),
				),
			),
			field('name', $.identifier),
			'{',
			optional($._dictionary_members),
			'}',
			';'
		),

		_dictionary_members: $ => repeat1($.dictionary_member),

		dictionary_member: $ => seq(
			optional($.extended_attribute_list),
			$._dictionary_member_rest,
		),

		_dictionary_member_rest: $ => choice(
			seq(
				'required',
				$.type_with_extended_attributes,
				field('name', $.identifier),
				';',
			),
			seq(
				$.type,
				field('name', $.identifier),
				optional($.default),
				';',
			),
		),

		// inheritance
		inheritance: $ => seq(':', field('inheriting', $.identifier)),

		// enum statement
		enum_statement: $ => seq(
			'enum',
			field('name', $.identifier),
			'{',
			$._enum_value_list,
			'}',
			';'
		),

		_enum_value_list: $ => sepByComma1Trailing($.string),

		// includes statement
		includes_statement: $ => seq(
			field('lhs', $.identifier),
			'includes',
			field('rhs', $.identifier),
			';'
		),

		// const statement
		const_statement: $ => seq(
			'const',
			field('type', $._const_type),
			field('name', $.identifier),
			'=',
			field('value', $._const_value),
			';',
		),

		_const_type: $ => choice(
			$.primitive_type,
			$.identifier,
		),

		_const_value: $ => choice(
			$.boolean_literal,
			$.float_literal,
			$.integer_literal,
		),

		// default values
		default: $ => seq('=', $.default_value),
		default_value: $ => choice(
			'ConstValue',
			$.string,
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
		typedef_statement: $ => seq(
			'typedef',
			$.type_with_extended_attributes,
			$.identifier,
			';'
		),

		type: $ => choice(
			$._single_type,
			seq($.union_type, optional('?')),
		),

		type_with_extended_attributes: $ => seq(
			optional($.extended_attribute_list),
			$.type,
		),

		_single_type: $ => choice(
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
				seq('sequence', '<', $.type_with_extended_attributes, ')'),
				seq('async', 'iterable', '<', $.type_with_extended_attributes, ')'),
				'object',
				'symbol',
				$.buffer_related_type,
				seq('FrozenArray', '<', $.type_with_extended_attributes, ')'),
				seq('ObservableArray', '<', $.type_with_extended_attributes, ')'),
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

		record_type: $ => seq(
			'record',
			'<',
			$.string_type,
			',',
			$.type_with_extended_attributes,
			'>'
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

		// attributes
		extended_attribute_list: $ => seq(
			'[',
			sepByComma1($.extended_attribute),
			']'
		),

		extended_attribute: $ => choice(
			$.extended_attribute_no_args,
			$.extended_attribute_named_arg_list,
			$.extended_attribute_ident,
			$.extended_attribute_ident_list,
			$.extended_attribute_wildcard,
		),

		extended_attribute_no_args: $ => alias(
			$.identifier,
			$.extended_attribute_no_args,
		),

		extended_attribute_named_arg_list: $ => seq(
			field('lhs', $.identifier),
			'=',
			field('rhs', $.identifier),
			'(', $.argument_list, ')',
		),

		extended_attribute_ident: $ => seq(
			field('lhs', $.identifier),
			'=',
			field('rhs', $.identifier),
		),

		extended_attribute_ident_list: $ => seq(
			field('lhs', $.identifier),
			'=',
			'(',
			$.identifier_list,
			')',
		),

		extended_attribute_wildcard: $ => seq(
			field('lhs', $.identifier),
			'=',
			'*'
		),

		// identifier list
		identifier_list: $ => sepByComma1($.identifier),

		// terminal symbols
		_integer: $ => /-?([1-9][0-9]*|0[Xx][0-9A-Fa-f]+|0[0-7]*)/,
		_decimal: $ => /-?(([0-9]+\.[0-9]*|[0-9]*\.[0-9]+)([Ee][+-]?[0-9]+)?|[0-9]+[Ee][+-]?[0-9]+)/,
		identifier: $ => /[_-]?[A-Za-z][0-9A-Z_a-z-]*/,
		string: $ => /"[^"]*"/,
		_whitespace: $ => /[\t\n\r ]+/,
		comment: $ => /\/\/.*|\/\*(.|\n)*?\*\//,
	}
});
