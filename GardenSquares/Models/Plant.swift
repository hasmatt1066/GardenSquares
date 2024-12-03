import Foundation

struct Plant: Identifiable, Codable {
    var id: UUID = UUID()
    var name: String
    var species: String
    var daysToHarvest: Int
    var wateringFrequency: Int // days between watering
    var spacing: Int // number of cells needed
    var notes: String?
}

struct PlantingInfo: Codable {
    var plant: Plant
    var plantingDate: Date
}
