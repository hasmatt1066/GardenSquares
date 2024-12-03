# Garden Squares

A React application for managing garden beds and tracking plant growth.

## Current Features

- Interactive grid-based garden bed management
- Multiple garden beds support with individual state
- Drag-to-select planting interface
- Plant tracking with:
  - Days until harvest countdown
  - Watering schedule tracking
  - Visual growth indicators
- Plant deletion functionality
- Search through available plants

## Next Steps

### User Authentication Implementation
1. Create authentication screens:
   - Login
   - Registration
   - Password recovery
2. Set up backend authentication service
3. Add user session management
4. Secure garden data per user
5. Add user profile management

### Development Setup

1. Clone the repository:
```bash
git clone https://github.com/hasmatt1066/GardenSquares.git
```

2. Install dependencies:
```bash
cd GardenSquares
npm install
```

3. Start the development server:
```bash
npm start
```

### Tech Stack

- React 18
- Tailwind CSS for styling
- Pointer Events API for drag interactions

## Implementation Details

### Garden Bed Management
- Each bed maintains its own state for selected cells and planted items
- Drag selection system supports both selecting and unselecting cells
- Visual feedback for:
  - Plant maturity (progressive green shading)
  - Watering status (blue indicator bar)
  - Selection state (light green highlight)

### Plant System
- Configurable plant database with:
  - Growth duration
  - Watering frequency
  - Plant-specific information
- Real-time countdown for harvest dates
- Water scheduling system