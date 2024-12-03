import SwiftUI

struct BedView: View {
    @StateObject private var viewModel: BedViewModel
    @GestureState private var dragState = DragState.inactive
    @State private var showingPlantingView = false
    
    init(bed: Bed) {
        _viewModel = StateObject(wrappedValue: BedViewModel(bed: bed))
    }
    
    var body: some View {
        ZStack {
            GridView(viewModel: viewModel)
                .gesture(
                    DragGesture(minimumDistance: 0)
                        .updating($dragState) { value, state, _ in
                            state = .dragging(translation: value.translation)
                            viewModel.handleDrag(at: value.location)
                        }
                        .onEnded { value in
                            if viewModel.isPlantingMode {
                                showingPlantingView = true
                            }
                        }
                )
                .gesture(
                    LongPressGesture(minimumDuration: 0.5)
                        .onEnded { _ in
                            viewModel.isPlantingMode = true
                        }
                )
            
            if showingPlantingView {
                PlantingView(viewModel: viewModel, isPresented: $showingPlantingView)
            }
        }
        .navigationTitle(viewModel.bed.name)
    }
}

enum DragState {
    case inactive
    case dragging(translation: CGSize)
}
