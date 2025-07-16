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
		$.type,

		// value
		$._default_value,

		// other
		$._extended_attribute,
	],

	inline: $ => [
		$._type_identifier,
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
		inheritance: $ => seq(':', field('inheriting', $._type_identifier)),

		// callback
		callback_definition: $ => seq('callback', $._callback_rest),

		_callback_rest: $ => seq(
			field('name', $._type_identifier),
			'=',
			field('return_type', $.type),
			field('arguments', $.argument_list),
			';'
		),

		// callback interface
		callback_interface_definition: $ => seq('callback', 'interface', $._callback_interface_rest),

		_callback_interface_rest: $ => seq(
			field('name', $._type_identifier),
			field('body', $.callback_interface_body),
			';'
		),

		callback_interface_body: $ => seq(
			'{',
			repeat(
				seq(
					optional($.extended_attribute_list),
					$._callback_interface_member,
				),
			),
			'}',
		),

		_callback_interface_member: $ => choice(
			$.const_member,
			alias($._regular_operation, $.callback_interface_operation),
		),

		// interface
		interface_definition: $ => seq(
			'interface',
			$._interface_rest,
		),

		_interface_rest: $ => seq(
			field('name', $._type_identifier),
			optional($.inheritance),
			field('body', $.interface_body),
			';',
		),

		interface_body: $ => seq(
			'{',
			repeat(
				seq(
					optional($.extended_attribute_list),
					$._interface_member,
				),
			),
			'}',
		),

		_interface_member: $ => choice(
			$._partial_interface_member,
			$.constructor_member,
		),

		// interface mixin
		interface_mixin_definition: $ => seq(
			'interface',
			'mixin',
			$._interface_mixin_rest,
		),

		_interface_mixin_rest: $ => seq(
			field('name', $._type_identifier),
			field('body', $.interface_mixin_body),
			';'
		),

		interface_mixin_body: $ => seq(
			'{',
			repeat(
				seq(
					optional($.extended_attribute_list),
					$._mixin_member,
				),
			),
			'}',
		),

		// partial interface
		partial_interface_definition: $ => seq(
			'partial',
			'interface',
			$._partial_interface_rest,
		),

		_partial_interface_rest: $ => seq(
			field('name', $._type_identifier),
			field('body', $.partial_interface_body),
			';',
		),

		partial_interface_body: $ => seq(
			'{',
			repeat(
				seq(
					optional($.extended_attribute_list),
					$._partial_interface_member,
				),
			),
			'}',
		),

		_partial_interface_member: $ => choice(
			$.const_member,
			$.operation_member,
			$.stringifier_member,
			$.iterable_member,
			$.async_iterable_member,
			$.attribute_member,
			$.maplike_member,
			$.setlike_member,
		),

		// partial interface mixin
		partial_interface_mixin_definition: $ => seq(
			'partial',
			'interface',
			'mixin',
			$._partial_interface_mixin_rest,
		),

		_partial_interface_mixin_rest: $ => seq(
			field('name', $._type_identifier),
			field('body', alias($.partial_interface_body, $.partial_interface_mixin_body)),
			';',
		),

		_mixin_member: $ => choice(
			$.const_member,
			alias($._regular_operation, $.mixin_operation_member),
			$.stringifier_member,
			$.attribute_member,
		),

		// readonly members and attributes
		attribute_member: $ => seq(
			optional(field('attribute_modifier', choice('stringifier', 'inherit', 'static'))),
			optional('readonly'),
			'attribute',
			field('type', $._type_with_extended_attributes),
			field('name', $._attribute_name),
			';',
		),

		_attribute_name: $ => choice(
			$.attribute_name_keyword,
			$.identifier,
		),

		attribute_name_keyword: _ => choice(
			'async',
			'required',
		),

		// operations
		operation_member: $ => seq(
			optional(field('modifier', $.special)),
			$._regular_operation,
		),

		_regular_operation: $ => seq(
			optional(field('operation_modifier', choice('stringifier', 'static'))),
			field('return_type', $.type),
			$._operation_rest,
		),

		_operation_rest: $ => seq(
			optional(field('name', $._operation_name)),
			field('arguments', $.argument_list),
			';'
		),

		special: _ => choice(
			'getter',
			'setter',
			'deleter',
		),

		_operation_name: $ => choice(
			$.operation_name_keyword,
			$.identifier,
		),

		operation_name_keyword: _ => 'includes',

		// arguments, constructor, stringifier
		argument_name_keyword: _ => choice(
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

		// arguments
		argument_list: $ => seq(
			'(',
			optional(sepByComma1($.argument)),
			')',
		),

		argument: $ => choice(
			seq(
				'optional',
				field('type', $._type_with_extended_attributes),
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

		ellipsis: _ => '...',

		constructor_member: $ => seq(
			'constructor',
			field('arguments', $.argument_list),
			';',
		),

		stringifier_member: $ => seq(
			'stringifier',
			';',
		),

		// iterables
		iterable_member: $ => seq(
			'iterable',
			'<',
			field('lhs_type', $._type_with_extended_attributes),
			optional(field('rhs_type', $._iterable_optional_rhs_type)),
			'>',
			';',
		),

		async_iterable_member: $ => seq(
			'async',
			'iterable',
			'<',
			field('lhs_type', $._type_with_extended_attributes),
			optional(field('rhs_type', $._iterable_optional_rhs_type)),
			'>',
			optional(field('arguments', $.argument_list)),
			';',
		),

		_iterable_optional_rhs_type: $ => seq(',', $._type_with_extended_attributes),

		// setlike and maplike
		setlike_member: $ => seq(
			optional('readonly'),
			'setlike',
			'<',
			field('type', $._type_with_extended_attributes),
			'>',
			';',
		),

		maplike_member: $ => seq(
			optional('readonly'),
			'maplike',
			'<',
			field('key_type', $._type_with_extended_attributes),
			',',
			field('value_type', $._type_with_extended_attributes),
			'>',
			';'
		),

		// namespace
		namespace_definition: $ => seq(
			optional('partial'),
			'namespace',
			field('name', $.identifier),
			field('body', $.namespace_body),
			';'
		),

		namespace_body: $ => seq(
			'{',
			repeat(
				seq(
					optional($.extended_attribute_list),
					$._namespace_member
				),
			),
			'}',
		),

		_namespace_member: $ => choice(
			alias($._regular_operation, $.namespace_operation),
			$.attribute_member,
			$.const_member,
		),

		// dictionary
		dictionary_definition: $ => seq(
			choice(
				seq(
					'dictionary',
					field('name', $._type_identifier),
					optional($.inheritance),
				),
				seq(
					'partial',
					'dictionary',
					field('name', $._type_identifier),
				),
			),
			field('body', $.dictionary_body),
			';'
		),

		dictionary_body: $ => seq(
			'{',
			repeat(
				seq(
					optional($.extended_attribute_list),
					$.dictionary_member,
				)
			),
			'}',
		),

		dictionary_member: $ => choice(
			seq(
				'required',
				field('type', $._type_with_extended_attributes),
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

		// enum
		enum_definition: $ => seq(
			'enum',
			field('name', $._type_identifier),
			field('body', $.enum_body),
			';'
		),

		enum_body: $ => seq(
			'{',
			sepByComma1Trailing($.string),
			'}',
		),

		// includes
		includes_definition: $ => seq(
			field('lhs', $._type_identifier),
			'includes',
			field('rhs', $._type_identifier),
			';'
		),

		// const
		const_member: $ => seq(
			'const',
			field('type', $._const_type),
			field('name', $._type_identifier),
			'=',
			field('value', $._const_value),
			';',
		),

		_const_type: $ => choice(
			$.primitive_type,
			$._type_identifier,
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

		empty_array: _ => seq('[', ']'),
		empty_object: _ => seq('{', '}'),

		// literals
		integer_literal: $ => $._integer,
		boolean_literal: _ => choice('true', 'false'),
		float_literal: $ => choice(
			$._decimal,
			'-Infinity',
			'Infinity',
			'NaN',
		),

		// types
		typedef_definition: $ => seq(
			'typedef',
			field('type', $._type_with_extended_attributes),
			field('name', $._type_identifier),
			';'
		),

		type: $ => choice(
			$._distinguishable_type,
			'any',
			$.promise_type,
			$.union_type,
			$.optional_type,
		),

		_type_with_extended_attributes: $ => seq(
			optional($.extended_attribute_list),
			$.type,
		),

		optional_type: $ => seq(
			choice($._distinguishable_type, $.union_type),
			'?',
		),

		union_type: $ => seq(
			'(',
			$.union_or_expression,
			')'
		),

		union_or_expression: $ => prec.left(seq(
			field('lhs_type', $._union_member_type),
			field('operator', 'or'),
			field('rhs_type', choice($.union_or_expression, $._union_member_type))
		)),

		_union_member_type: $ => choice(
			$.optional_type,
			$._distinguishable_type,
			$.union_type,
		),

		// builtin types
		_distinguishable_type: $ => choice(
			$.primitive_type,
			$.string_type,
			$._type_identifier,
			$.sequence_type,
			'object',
			'symbol',
			$.buffer_related_type,
			$.frozen_array_type,
			$.observable_array_type,
			$.record_type,
			$.undefined_type,
		),

		undefined_type: _ => 'undefined',

		primitive_type: $ => choice(
			$.integer_type,
			$.float_type,
			'boolean',
			'byte',
			'octet',
			'bigint',
		),

		integer_type: _ => seq(
			optional('unsigned'),
			choice(
				'short',
				seq('long', optional('long')),
			),
		),

		float_type: _ => seq(
			optional('unrestricted'),
			choice('float', 'double'),
		),

		string_type: _ => choice(
			'ByteString',
			'DOMString',
			'USVString',
		),

		promise_type: $ => seq(
			'Promise',
			'<',
			field('type', $.type),
			'>',
		),

		record_type: $ => seq(
			'record',
			'<',
			field('key_type', $.string_type),
			',',
			field('value_type', $._type_with_extended_attributes),
			'>'
		),

		buffer_related_type: _ => choice(
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
			field('type', $._type_with_extended_attributes),
			'>',
		),

		frozen_array_type: $ => seq(
			'FrozenArray',
			'<',
			field('type', $._type_with_extended_attributes),
			'>',
		),

		observable_array_type: $ => seq(
			'ObservableArray',
			'<',
			field('type', $._type_with_extended_attributes),
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
			field('arguments', $.argument_list),
		),

		extended_attribute_named_arg_list: $ => seq(
			field('lhs', $.identifier),
			'=',
			field('rhs', $.identifier),
			field('arguments', $.argument_list),
		),

		extended_attribute_ident: $ => seq(
			field('lhs', $.identifier),
			'=',
			field('rhs', $.identifier),
		),

		extended_attribute_ident_list: $ => seq(
			field('name', $.identifier),
			'=',
			field('identifiers', $.identifier_list),
		),

		extended_attribute_wildcard: $ => seq(
			field('name', $.identifier),
			'=',
			'*'
		),

		// other identifier nodes
		identifier_list: $ => seq(
			'(',
			sepByComma1($.identifier),
			')',
		),
		_type_identifier: $ => alias($.identifier, $.type_identifier),

		// terminal symbols
		_integer: _ => /-?([1-9][0-9]*|0[Xx][0-9A-Fa-f]+|0[0-7]*)/,
		_decimal: _ => /-?(([0-9]+\.[0-9]*|[0-9]*\.[0-9]+)([Ee][+-]?[0-9]+)?|[0-9]+[Ee][+-]?[0-9]+)/,
		identifier: _ => /[_-]?[A-Za-z][0-9A-Z_a-z-]*/,
		string: _ => /"[^"]*"/,
		_whitespace: _ => /[\t\n\r ]+/,
		comment: _ => /\/\/.*|\/\*(.|\n)*?\*\//,
	}
});
