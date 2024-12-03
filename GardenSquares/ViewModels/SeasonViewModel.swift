import Foundation

class SeasonViewModel: ObservableObject {
    @Published var beds: [Bed] = []
    
    init() {
        loadBeds()
    }
    
    private func loadBeds() {
        // TODO: Load from persistence
        // For now, creating sample data
        beds = [
            createSampleBed(name: "Bed 1"),
            createSampleBed(name: "Bed 2")
        ]
    }
    
    private func createSampleBed(name: String) -> Bed {
        let gridCells = (0..<20).map { row in
            (0..<20).map { column in
                GridCell(position: GridPosition(row: row, column: column),
                        plantingInfo: nil,
                        lastWatered: nil)
            }
        }
        
        return Bed(name: name,
                   gridCells: gridCells,
                   selectedCells: [],
                   outlinePositions: createSampleOutline())
    }
    
    private func createSampleOutline() -> Set<GridPosition> {
        // Create a sample 10x10 bed outline
        var outline: Set<GridPosition> = []
        for row in 5..<15 {
            for column in 5..<15 {
                if row == 5 || row == 14 || column == 5 || column == 14 {
                    outline.insert(GridPosition(row: row, column: column))
                }
            }
        }
        return outline
    }
}
