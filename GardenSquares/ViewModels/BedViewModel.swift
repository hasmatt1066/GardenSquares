import Foundation
import SwiftUI

class BedViewModel: ObservableObject {
    @Published var bed: Bed
    @Published var selectedCells: Set<GridPosition> = []
    @Published var isPlantingMode = false
    
    let rowCount = 20
    let columnCount = 20
    
    var availablePlants: [Plant] = [] // Would be loaded from a database
    
    init(bed: Bed) {
        self.bed = bed
        loadPlants()
    }
    
    func handleDrag(at point: CGPoint) {
        // Convert point to grid position
        let row = Int(point.y / 30)
        let column = Int(point.x / 30)
        
        if isPlantingMode {
            selectedCells.insert(GridPosition(row: row, column: column))
        }
    }
    
    func plantSelected(_ plant: Plant) {
        let plantingInfo = PlantingInfo(plant: plant, plantingDate: Date())
        for position in selectedCells {
            if var cell = cell(at: position.row, column: position.column) {
                cell.plantingInfo = plantingInfo
                cell.lastWatered = Date()
                updateCell(cell)
            }
        }
        selectedCells.removeAll()
        isPlantingMode = false
    }
    
    private func loadPlants() {
        // TODO: Load plants from database
        // For now, adding sample plants
        availablePlants = [
            Plant(name: "Tomato", species: "Solanum lycopersicum", daysToHarvest: 80, wateringFrequency: 2, spacing: 1, notes: nil),
            Plant(name: "Lettuce", species: "Lactuca sativa", daysToHarvest: 45, wateringFrequency: 1, spacing: 1, notes: nil)
        ]
    }
    
    func cell(at row: Int, column: Int) -> GridCell? {
        guard row >= 0, row < rowCount, column >= 0, column < columnCount else { return nil }
        return bed.gridCells[row][column]
    }
    
    private func updateCell(_ cell: GridCell) {
        guard let row = bed.gridCells.firstIndex(where: { $0.contains(where: { $0.id == cell.id }) }),
              let column = bed.gridCells[row].firstIndex(where: { $0.id == cell.id }) else { return }
        bed.gridCells[row][column] = cell
    }
    
    func isInBedOutline(row: Int, column: Int) -> Bool {
        bed.outlinePositions.contains(GridPosition(row: row, column: column))
    }
}
