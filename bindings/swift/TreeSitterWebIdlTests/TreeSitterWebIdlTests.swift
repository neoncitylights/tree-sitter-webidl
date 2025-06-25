import XCTest
import SwiftTreeSitter
import TreeSitterWebIDL

final class TreeSitterWebIDLTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_webidl())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading WebIDL grammar")
    }
}
