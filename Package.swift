// swift-tools-version:5.3

import Foundation
import PackageDescription

var sources = ["src/parser.c"]
if FileManager.default.fileExists(atPath: "src/scanner.c") {
    sources.append("src/scanner.c")
}

let package = Package(
    name: "TreeSitterWebIDL",
    products: [
        .library(name: "TreeSitterWebIDL", targets: ["TreeSitterWebIDL"])
    ],
    dependencies: [
        .package(url: "https://github.com/tree-sitter/swift-tree-sitter", from: "0.8.0")
    ],
    targets: [
        .target(
            name: "TreeSitterWebIDL",
            dependencies: [],
            path: ".",
            sources: sources,
            resources: [
                // .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterWebIDLTests",
            dependencies: [
                .product(name: "SwiftTreeSitter", package: "swift-tree-sitter"),
                "TreeSitterWebIDL",
            ],
            path: "bindings/swift/TreeSitterWebIDLTests"
        ),
    ],
    cLanguageStandard: .c11
)
