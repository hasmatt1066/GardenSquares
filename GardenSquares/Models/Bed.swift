import Foundation

struct Bed: Identifiable, Codable {
    var id: UUID = UUID()
    var name: String
    var gridCells: [[GridCell]]
    var selectedCells: Set<GridPosition>
    var outlinePositions: Set<GridPosition>
}
