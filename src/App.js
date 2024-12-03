import React, { useState, useCallback, useEffect, useRef } from 'react';

const initialBeds = [
  { id: 1, name: 'Bed 1' },
  { id: 2, name: 'Bed 2' },
  { id: 3, name: 'Bed 3' }
];

const plants = [
  { id: 1, name: 'Tomato', daysToHarvest: 80, wateringFrequency: 2 },
  { id: 2, name: 'Lettuce', daysToHarvest: 45, wateringFrequency: 1 },
  { id: 3, name: 'Pepper', daysToHarvest: 70, wateringFrequency: 2 }
];

const WateringIndicator = ({ lastWatered, wateringFrequency }) => {
  const daysSinceWatering = Math.floor((new Date() - new Date(lastWatered)) / (1000 * 60 * 60 * 24));
  const remainingDays = wateringFrequency - daysSinceWatering;
  const percentage = Math.max(0, (remainingDays / wateringFrequency) * 100);
  
  return (
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
      <div 
        className={`h-full ${percentage === 0 ? 'bg-red-500' : 'bg-blue-500'}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

const getMaturityColor = (currentDate, plantedDate, daysToHarvest) => {
  const daysSincePlanting = Math.floor((currentDate - new Date(plantedDate)) / (1000 * 60 * 60 * 24));
  const maturityPercentage = Math.min(100, Math.max(0, (daysSincePlanting / daysToHarvest) * 100));
  const colorLevel = Math.floor(maturityPercentage / 10);
  
  const greenShades = [
    'bg-green-50',
    'bg-green-100',
    'bg-green-200',
    'bg-green-300',
    'bg-green-400',
    'bg-green-500',
    'bg-green-600',
    'bg-green-700',
    'bg-green-800',
    'bg-green-900'
  ];
  
  return greenShades[colorLevel];
};

export default function GardenSquaresDemo() {
  const gridRef = useRef(null);
  const [currentView, setCurrentView] = useState('season');
  const [selectedBed, setSelectedBed] = useState(null);
  const [bedsData, setBedsData] = useState(
    initialBeds.reduce((acc, bed) => ({
      ...acc,
      [bed.id]: {
        selectedCells: new Set(),
        gridData: {}
      }
    }), {})
  );
  const [plantingMode, setPlantingMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [showPlantSelector, setShowPlantSelector] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDragging, setIsDragging] = useState(false);
  const [initialCell, setInitialCell] = useState(null);

  const currentBedData = selectedBed ? bedsData[selectedBed.id] : null;
  const selectedCells = currentBedData?.selectedCells || new Set();
  const gridData = currentBedData?.gridData || {};

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const updateBedData = (bedId, updates) => {
    setBedsData(prev => ({
      ...prev,
      [bedId]: {
        ...prev[bedId],
        ...updates
      }
    }));
  };

  const getCellFromPoint = (x, y) => {
    if (!gridRef.current) return null;
    const rect = gridRef.current.getBoundingClientRect();
    const relX = x - rect.left;
    const relY = y - rect.top;
    const cellWidth = rect.width / 8;
    const cellHeight = rect.height / 8;
    
    const col = Math.floor(relX / cellWidth);
    const row = Math.floor(relY / cellHeight);
    
    if (col >= 0 && col < 8 && row >= 0 && row < 8) {
      return row * 8 + col;
    }
    return null;
  };

  const handlePointerDown = (e) => {
    if (!plantingMode || !selectedBed) return;
    setIsDragging(true);
    const cellId = getCellFromPoint(e.clientX, e.clientY);
    if (cellId !== null) {
      setInitialCell({
        id: cellId,
        wasSelected: selectedCells.has(cellId)
      });
      
      const newSelectedCells = new Set(selectedCells);
      if (newSelectedCells.has(cellId)) {
        newSelectedCells.delete(cellId);
      } else {
        newSelectedCells.add(cellId);
      }
      updateBedData(selectedBed.id, { selectedCells: newSelectedCells });
    }
    e.preventDefault();
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !plantingMode || !initialCell || !selectedBed) return;
    const cellId = getCellFromPoint(e.clientX, e.clientY);
    if (cellId !== null) {
      const newSelectedCells = new Set(selectedCells);
      if (initialCell.wasSelected) {
        newSelectedCells.delete(cellId);
      } else {
        newSelectedCells.add(cellId);
      }
      updateBedData(selectedBed.id, { selectedCells: newSelectedCells });
    }
    e.preventDefault();
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setInitialCell(null);
  };

  const handlePlantSelect = (plant) => {
    if (!selectedBed) return;
    
    const plantingDate = currentDate;
    const newGridData = { ...gridData };
    selectedCells.forEach(cellId => {
      newGridData[cellId] = {
        plant,
        plantedDate: plantingDate,
        lastWatered: plantingDate
      };
    });
    
    updateBedData(selectedBed.id, {
      gridData: newGridData,
      selectedCells: new Set()
    });
    
    setPlantingMode(false);
    setShowPlantSelector(false);
  };

  const handleDelete = (cellId) => {
    if (!selectedBed || !gridData[cellId]) return;
    
    const newGridData = { ...gridData };
    delete newGridData[cellId];
    updateBedData(selectedBed.id, { gridData: newGridData });
  };

  if (currentView === 'season') {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Current Season</h1>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {initialBeds.map(bed => (
            <button
              key={bed.id}
              className="p-4 bg-blue-100 rounded-lg text-center hover:bg-blue-200 transition-colors"
              onClick={() => {
                setSelectedBed(bed);
                setCurrentView('bed');
              }}
            >
              <h2 className="text-lg font-semibold">{bed.name}</h2>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (showPlantSelector) {
    return (
      <div className="p-4">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search plants..."
            className="w-full p-2 border rounded"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          {plants
            .filter(plant => plant.name.toLowerCase().includes(searchText.toLowerCase()))
            .map(plant => (
              <button
                key={plant.id}
                className="p-2 border rounded hover:bg-gray-100 text-left"
                onClick={() => handlePlantSelect(plant)}
              >
                <div className="font-semibold">{plant.name}</div>
                <div className="text-sm text-gray-600">
                  Days to harvest: {plant.daysToHarvest}
                  <br />
                  Water every {plant.wateringFrequency} days
                </div>
              </button>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#e6d5c3]">
      <div className="flex justify-between items-center mb-4">
        <button
          className="px-3 py-1 bg-gray-200 rounded"
          onClick={() => {
            setCurrentView('season');
            setSelectedBed(null);
            setPlantingMode(false);
            setDeleteMode(false);
          }}
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold">{selectedBed?.name}</h1>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded ${plantingMode ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            onClick={() => {
              setPlantingMode(!plantingMode);
              setDeleteMode(false);
              if (selectedBed) {
                updateBedData(selectedBed.id, { selectedCells: new Set() });
              }
            }}
          >
            {plantingMode ? 'Planting...' : 'Plant'}
          </button>
          <button
            className={`px-3 py-1 rounded ${deleteMode ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
            onClick={() => {
              setDeleteMode(!deleteMode);
              setPlantingMode(false);
              if (selectedBed) {
                updateBedData(selectedBed.id, { selectedCells: new Set() });
              }
            }}
          >
            {deleteMode ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      <div 
        ref={gridRef}
        className="grid grid-cols-8 gap-1 touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {Array.from({ length: 64 }, (_, i) => {
          const cellData = gridData[i];
          const isSelected = selectedCells.has(i);
          
          return (
            <div
              key={i}
              className={`
                relative aspect-square border
                ${isSelected ? 'bg-green-100' : 'bg-[#e6d5c3]'}
                ${cellData ? getMaturityColor(currentDate, cellData.plantedDate, cellData.plant.daysToHarvest) : ''}
                ${(plantingMode || deleteMode) ? 'cursor-pointer hover:opacity-75' : ''}
                flex items-center justify-center
                select-none
              `}
              onClick={() => deleteMode && handleDelete(i)}
            >
              {cellData && (
                <>
                  <div className="text-xs text-center pointer-events-none">
                    <div className="font-bold">{cellData.plant.name}</div>
                    <div>H: {cellData.plant.daysToHarvest}d</div>
                    <div>W: {cellData.plant.wateringFrequency}d</div>
                  </div>
                  <WateringIndicator 
                    lastWatered={cellData.lastWatered}
                    wateringFrequency={cellData.plant.wateringFrequency}
                  />
                </>
              )}
            </div>
          );
        })}
      </div>

      {selectedCells.size > 0 && (
        <div className="fixed bottom-4 left-4 right-4">
          <button
            className="w-full py-2 bg-green-500 text-white rounded-lg"
            onClick={() => setShowPlantSelector(true)}
          >
            Select Plant ({selectedCells.size} cells)
          </button>
        </div>
      )}
    </div>
  );
}
