import SwiftUI

struct SeasonView: View {
    @StateObject private var viewModel = SeasonViewModel()
    
    let columns = [
        GridItem(.adaptive(minimum: 150))
    ]
    
    var body: some View {
        NavigationView {
            ScrollView {
                LazyVGrid(columns: columns, spacing: 20) {
                    ForEach(viewModel.beds) { bed in
                        NavigationLink(destination: BedView(bed: bed)) {
                            BedTileView(bed: bed)
                        }
                    }
                }
                .padding()
            }
            .navigationTitle("Current Season")
        }
    }
}
