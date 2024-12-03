import Foundation

struct GridCell: Identifiable, Codable {
    var id: UUID = UUID()
    var position: GridPosition
    var plantingInfo: PlantingInfo?
    var lastWatered: Date?
    
    var daysUntilHarvest: Int? {
        guard let plantingInfo = plantingInfo else { return nil }
        let daysSincePlanting = Calendar.current.dateComponents([.day], from: plantingInfo.plantingDate, to: Date()).day ?? 0
        return max(0, plantingInfo.plant.daysToHarvest - daysSincePlanting)
    }
    
    var daysUntilWatering: Int? {
        guard let lastWatered = lastWatered,
              let plantingInfo = plantingInfo else { return nil }
        let daysSinceWatering = Calendar.current.dateComponents([.day], from: lastWatered, to: Date()).day ?? 0
        return max(0, plantingInfo.plant.wateringFrequency - daysSinceWatering)
    }
}

struct GridPosition: Hashable, Codable {
    var row: Int
    var column: Int
}
