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

		// members
		$._callback_interface_member,
		$._interface_member,
		$._mixin_member,
		$._namespace_member,
		$._partial_interface_member,

		// types
		$._union_member_type,

		// value
		$._default_value,

		// other
		$._extended_attribute,
		$._operation,
	],

	rules: {
		source_file: $ => repeat(seq(
			optional($.extended_attribute_list),
			$._definition
		)),

		_definition: $ => choice(
			$.callback_definition,
			$.callback_interface_definition,
			$.interface_definition,
			$.interface_mixin_definition,
			$.partial_interface_definition,
			$.partial_interface_mixin_definition,
			$.namespace_definition,
			$.dictionary_definition,
			$.enum_definition,
			$.typedef_definition,
			$.includes_definition,
		),

		// inheritance
		inheritance: $ => seq(':', field('inheriting', $.identifier)),

		// callback
		callback_definition: $ => seq('callback', $._callback_rest),
		callback_interface_definition: $ => seq('callback', 'interface', $._callback_interface_rest),

		// interface and partial interface
		interface_definition: $ => seq(
			'interface',
			$._interface_rest,
		),

		interface_mixin_definition: $ => seq(
			'interface',
			'mixin',
			$._interface_mixin_rest,
		),

		partial_interface_definition: $ => seq(
			'partial',
			'interface',
			$._partial_interface_rest,
		),

		partial_interface_mixin_definition: $ => seq(
			'partial',
			'interface',
			'mixin',
			$._partial_interface_mixin_rest,
		),

		_interface_rest: $ => seq(
			field('name', $.identifier),
			optional($.inheritance),
			field('body', $.interface_body),
			';',
		),

		interface_body: $ => seq(
			'{',
			repeat($._interface_member),
			'}',
		),

		_partial_interface_rest: $ => seq(
			field('name', $.identifier),
			field('body', $.partial_interface_body),
			';',
		),

		partial_interface_body: $ => seq(
			'{',
			repeat(
				seq(
					optional($.extended_attribute_list),
					$._partial_interface_member,
				)
			),
			'}',
		),

		_partial_interface_mixin_rest: $ => seq(
			field('name', $.identifier),
			field('body', alias($.partial_interface_body, $.partial_interface_mixin_body)),
			';',
		),

		_interface_member: $ => choice(
			$._partial_interface_member,
			$.constructor,
		),

		_partial_interface_member: $ => choice(
			$.const_statement,
			$._operation,
			$.stringifier,
			$.static_member,
			$.iterable,
			$.async_iterable,
			$.readonly_member,
			$.read_write_attribute,
			$.read_write_maplike,
			$.read_write_setlike,
			$.inherit_attribute,
		),

		// interface mixin
		_interface_mixin_rest: $ => seq(
			field('name', $.identifier),
			field('body', $.interface_mixin_body),
			';'
		),

		interface_mixin_body: $ => seq(
			'{',
			repeat(seq(
				optional($.extended_attribute_list),
				$._mixin_member
			)),
			'}',
		),

		_mixin_member: $ => choice(
			$.const_statement,
			$.regular_operation,
			$.stringifier,
			$.mixin_readonly_attribute,
		),

		mixin_readonly_attribute: $ => seq(optional('readonly'), $.attribute_rest),

		// callback + callback interface
		_callback_interface_rest: $ => seq(
			field('name', $.identifier),
			field('body', $.callback_interface_body),
			';'
		),

		callback_interface_body: $ => seq(
			'{',
			repeat(seq(
				optional($.extended_attribute_list),
				$._callback_interface_member
			)),
			'}',
		),

		_callback_interface_member: $ => choice(
			$.const_statement,
			$.regular_operation,
		),

		_callback_rest: $ => seq(
			field('name', $.identifier),
			'=',
			field('type', $.type),
			$._parenthesized_argument_list,
			';'
		),

		// readonly members and attributes
		readonly_member: $ => seq(
			'readonly',
			choice(
				$.attribute_rest,
				$.maplike_rest,
				$.setlike_rest,
			)
		),

		readonly_attribute: $ => seq('readonly', $.attribute_rest),

		read_write_attribute: $ => alias($.attribute_rest, $.read_write_attribute),
		inherit_attribute: $ => seq('inherit', $.attribute_rest),
		attribute_rest: $ => seq(
			'attribute',
			field('type', $.type_with_extended_attributes),
			field('name', $._attribute_name),
			';',
		),

		_attribute_name: $ => choice(
			$.attribute_name_keyword,
			$.identifier,
		),

		attribute_name_keyword: $ => choice(
			'async',
			'required',
		),

		// operations
		_operation: $ => choice(
			$.regular_operation,
			$.special_operation,
		),

		regular_operation: $ => seq(
			field('return_type', $.type),
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
			optional(field('name', $._operation_name)),
			$._parenthesized_argument_list,
			';'
		),

		_operation_name: $ => choice(
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

		// arguments, constructor, stringifier
		argument_list: $ => sepByComma1($.argument),
		_parenthesized_argument_list: $ => seq('(', $.argument_list, ')'),

		argument: $ => choice(
			seq(
				'optional',
				field('type', $.type_with_extended_attributes),
				field('name', $._argument_name),
				optional($.default),
			),
			seq(
				field('type', $.type),
				optional($.ellipsis),
				field('name', $._argument_name),
			),
		),

		_argument_name: $ => choice(
			$.argument_name_keyword,
			$.identifier,
		),

		ellipsis: $ => '...',

		constructor: $ => seq(
			'constructor',
			$._parenthesized_argument_list,
			';',
		),

		stringifier: $ => seq(
			'stringifier',
			choice(
				seq(optional('readonly'), $.attribute_rest),
				';',
			),
		),

		// static member
		static_member: $ => seq(
			'static',
			choice(
				seq('optional', $.attribute_rest),
				$.regular_operation,
			),
		),

		// iterables
		iterable: $ => seq(
			'iterable',
			'<',
			field('lhs_type', $.type_with_extended_attributes),
			field('rhs_type', optional($._optional_type)),
			'>',
			';',
		),

		async_iterable: $ => seq(
			'async',
			'iterable',
			'<',
			field('lhs_type', $.type_with_extended_attributes),
			field('rhs_type', optional($._optional_type)),
			'>',
			optional($._parenthesized_argument_list),
			';',
		),

		_optional_type: $ => seq(',', $.type_with_extended_attributes),

		// setlike and maplike
		read_write_setlike: $ => $.setlike_rest,
		setlike_rest: $ => seq(
			'setlike',
			'<',
			field('type', $.type_with_extended_attributes),
			'>',
			';',
		),

		read_write_maplike: $ => $.maplike_rest,
		maplike_rest: $ => seq(
			'maplike',
			'<',
			field('key_type', $.type_with_extended_attributes),
			',',
			field('value_type', $.type_with_extended_attributes),
			'>',
			';'
		),

		// namespace statement
		namespace_definition: $ => seq(
			optional('partial'),
			'namespace',
			field('name', $.identifier),
			field('body', $._namespace_body),
			';'
		),

		_namespace_body: $ => seq(
			'{',
			repeat($._namespace_member),
			'}',
		),

		_namespace_member: $ => choice(
			$.regular_operation,
			$.readonly_attribute,
			$.const_statement,
		),

		// dictionary statement
		dictionary_definition: $ => seq(
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
			field('body', $.dictionary_body),
			';'
		),

		dictionary_body: $ => seq(
			'{',
			repeat(seq(
				optional($.extended_attribute_list),
				$.dictionary_member
			)),
			'}',
		),

		dictionary_member: $ => choice(
			seq(
				'required',
				field('type', $.type_with_extended_attributes),
				field('name', $.identifier),
				';',
			),
			seq(
				field('type', $.type),
				field('name', $.identifier),
				optional($.default),
				';',
			),
		),

		// enum statement
		enum_definition: $ => seq(
			'enum',
			field('name', $.identifier),
			field('body', $.enum_body),
			';'
		),

		enum_body: $ => seq(
			'{',
			sepByComma1Trailing($.string),
			'}',
		),

		// includes statement
		includes_definition: $ => seq(
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
		default: $ => seq('=', field('value', $._default_value)),
		_default_value: $ => choice(
			$._const_value,
			$.string,
			$.empty_array,
			$.empty_object,
			'null',
			'undefined',
		),

		empty_array: $ => seq('[', ']'),
		empty_object: $ => seq('{', '}'),

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
		typedef_definition: $ => seq(
			'typedef',
			field('type', $.type_with_extended_attributes),
			field('name', $.identifier),
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
			field('left', $._union_member_type),
			'or',
			field('right', choice($.union_or_expression, $._union_member_type))
		)),

		_union_member_type: $ => choice(
			$.distinguishable_type,
			$.union_type,
		),

		// builtin types
		distinguishable_type: $ => seq(
			choice(
				$.primitive_type,
				$.string_type,
				$.identifier,
				$.sequence_type,
				'object',
				'symbol',
				$.buffer_related_type,
				$.frozen_array_type,
				$.observable_array_type,
				$.record_type,
				'undefined',
			),
			optional('?'),
		),

		primitive_type: $ => choice(
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

		sequence_type: $ => seq(
			'sequence',
			'<',
			field('inner_type', $.type_with_extended_attributes),
			'>',
		),

		frozen_array_type: $ => seq(
			'FrozenArray',
			'<',
			field('inner_type', $.type_with_extended_attributes),
			'>',
		),

		observable_array_type: $ => seq(
			'ObservableArray',
			'<',
			field('inner_type', $.type_with_extended_attributes),
			'>',
		),

		// attributes
		extended_attribute_list: $ => seq(
			'[',
			sepByComma1($._extended_attribute),
			']'
		),

		_extended_attribute: $ => choice(
			$.extended_attribute_no_args,
			$.extended_attribute_arg_list,
			$.extended_attribute_named_arg_list,
			$.extended_attribute_ident,
			$.extended_attribute_ident_list,
			$.extended_attribute_wildcard,
		),

		extended_attribute_no_args: $ => field('name', $.identifier),

		extended_attribute_arg_list: $ => seq(
			field('name', $.identifier),
			$._parenthesized_argument_list,
		),

		extended_attribute_named_arg_list: $ => seq(
			field('lhs', $.identifier),
			'=',
			field('rhs', $.identifier),
			$._parenthesized_argument_list,
		),

		extended_attribute_ident: $ => seq(
			field('lhs', $.identifier),
			'=',
			field('rhs', $.identifier),
		),

		extended_attribute_ident_list: $ => seq(
			field('name', $.identifier),
			'=',
			'(',
			$.identifier_list,
			')',
		),

		extended_attribute_wildcard: $ => seq(
			field('name', $.identifier),
			'=',
			'*'
		),

		// other identifier nodes
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
