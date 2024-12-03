import Foundation
import SwiftUI

struct User: Codable, Identifiable {
    var id: String
    var username: String
    var email: String
    var activeSeasonId: String?
}
