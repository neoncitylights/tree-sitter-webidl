/**
 * @param {RuleOrLiteral} sep
 * @param {RuleOrLiteral} rule
 * @returns SeqRule
 */
export const sepBy1Trailing = (sep, rule) => seq(sepBy1(sep, rule), optional(sep))

/**
 * @param {RuleOrLiteral} sep
 * @param {RuleOrLiteral} rule
 * @returns SeqRule
 */
export const sepBy1 = (sep, rule) => seq(rule, repeat(seq(sep, rule)))

// semicolon
/**
 * @param {RuleOrLiteral} rule
 * @returns SeqRule
 */
export const sepBySemicolon1 = (rule) => sepBy1(',', rule)

// commas
/**
 * @param {RuleOrLiteral} rule
 * @returns SeqRule
 */
export const sepByComma1Trailing = (rule) => sepBy1Trailing(',', rule)

/**
 * @param {RuleOrLiteral} rule
 * @returns SeqRule
 */
export const sepByComma1 = (rule) => sepBy1(',', rule)
