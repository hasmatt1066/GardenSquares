import Foundation

class UserSession: ObservableObject {
    @Published var isAuthenticated = false
    @Published var currentUser: User?
    
    struct User: Codable {
        let id: String
        let username: String
        let email: String
    }
    
    func signIn(username: String, password: String) async throws {
        // TODO: Implement actual authentication
        // This is a placeholder for demonstration
        self.currentUser = User(
            id: UUID().uuidString,
            username: username,
            email: "\(username)@example.com"
        )
        self.isAuthenticated = true
    }
    
    func signOut() {
        self.currentUser = nil
        self.isAuthenticated = false
    }
}