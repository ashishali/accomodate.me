import { useState, useMemo, useEffect } from 'react'
import './App.css'
import MapComponent from './components/MapComponent'
import Sidebar from './components/Sidebar'
import { MOCK_DATA } from './utils/DataManager'
import { fetchStreetGeometry } from './utils/osm'
import LoginPage from './components/LoginPage'

function App() {
  const [selectedHouse, setSelectedHouse] = useState(null)
  const [selectedStreet, setSelectedStreet] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [hoveredHouseId, setHoveredHouseId] = useState(null)
  const [filters, setFilters] = useState({
    diet: 'All',
    gender: 'Any'
  })

  const [streetGeometryState, setStreetGeometryState] = useState({
    status: 'idle',
    data: [],
    error: null
  })

  // Lifted state for houses to allow adding new ones. Safely access MOCK_DATA.
  const [houses, setHouses] = useState(MOCK_DATA?.houses || [])
  const streets = MOCK_DATA?.streets || []

  // Simulated User Auth
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('accomodate_user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem('accomodate_user');
      }
    }
  }, []);

  const handleLogin = (user) => {
    // Use existing ID or generate one
    const fullUser = {
      ...user,
      id: user.id || `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    localStorage.setItem('accomodate_user', JSON.stringify(fullUser));
    setCurrentUser(fullUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('accomodate_user');
    setCurrentUser(null);
    setSelectedHouse(null);
  };

  // Debug check
  useEffect(() => {
    if (!MOCK_DATA) {
      console.error("Critical: MOCK_DATA is missing or undefined");
    } else {
      console.log("App Initialized. Streets:", streets.length, "Houses:", houses.length);
    }
  }, []);

  const handleAddHouse = (newHouse) => {
    // Attach ownerId
    const houseWithOwner = { ...newHouse, ownerId: currentUser?.id };
    setHouses((prevHouses) => [...prevHouses, houseWithOwner]);
    setSelectedHouse(houseWithOwner);
    if (houseWithOwner.street !== selectedStreet) {
      setSelectedStreet(houseWithOwner.street);
    }
  };

  const handleDeleteHouse = (houseId) => {
    // confirm is handled in Sidebar
    setHouses(prev => prev.filter(h => h.id !== houseId));
    if (selectedHouse?.id === houseId) {
      setSelectedHouse(null);
    }
  };

  const handleUpdateHouse = (updatedHouse) => {
    setHouses(prev => prev.map(h => h.id === updatedHouse.id ? updatedHouse : h));
    setSelectedHouse(updatedHouse);
  };

  const handleHouseSelect = (house) => {
    setSelectedHouse(house)
    if (house && house.street !== selectedStreet) {
      setSelectedStreet(house.street)
    }
  }

  const filteredHouses = useMemo(() => {
    return houses.filter((house) => {
      if (selectedStreet && house.street !== selectedStreet) {
        return false
      }

      if (filters.diet !== 'All' && house.dietPreference !== filters.diet) {
        return false
      }

      if (filters.gender !== 'Any') {
        if (!house.lookingForRoommates) {
          return false
        }
        const matchesGender =
          house.roommatePreference === filters.gender || house.roommatePreference === 'Any'
        if (!matchesGender) {
          return false
        }
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesAddress = house.address.toLowerCase().includes(query)
        const matchesStreet = house.street.toLowerCase().includes(query)
        if (!matchesAddress && !matchesStreet) {
          return false
        }
      }

      return true
    })
  }, [houses, selectedStreet, filters, searchQuery])

  useEffect(() => {
    if (selectedHouse && !filteredHouses.some((house) => house.id === selectedHouse.id)) {
      setSelectedHouse(null)
    }
  }, [filteredHouses, selectedHouse])

  const handleLoadStreetGeometry = async () => {
    if (streetGeometryState.status === 'loading') {
      return
    }
    setStreetGeometryState({ status: 'loading', data: [], error: null })
    try {
      const geometry = await fetchStreetGeometry(streets)
      setStreetGeometryState({ status: 'ready', data: geometry, error: null })
    } catch (error) {
      console.error("Failed to load street geometry", error);
      setStreetGeometryState({
        status: 'error',
        data: [],
        error: error?.message || 'Unable to load street geometry.'
      })
    }
  }

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '380px 1fr',
      height: '100vh',
      gap: '20px',
      padding: '20px',
      overflow: 'hidden'
    }}>
      <Sidebar
        houses={filteredHouses}
        streets={streets}
        selectedHouse={selectedHouse}
        onSelectHouse={handleHouseSelect}
        selectedStreet={selectedStreet}
        onSelectStreet={setSelectedStreet}
        onAddHouse={handleAddHouse}
        onDeleteHouse={handleDeleteHouse}
        onUpdateHouse={handleUpdateHouse}
        currentUser={currentUser}
        onLogout={handleLogout}
        filters={filters}
        onUpdateFilters={setFilters}
        streetGeometryState={streetGeometryState}
        onLoadStreetGeometry={handleLoadStreetGeometry}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        hoveredHouseId={hoveredHouseId}
        onHoverHouse={setHoveredHouseId}
      />
      <main style={{ borderRadius: '16px', overflow: 'hidden' }}>
        <MapComponent
          houses={filteredHouses}
          selectedHouse={selectedHouse}
          onSelectHouse={handleHouseSelect}
          onSelectStreet={setSelectedStreet}
          selectedStreet={selectedStreet}
          streetGeometry={streetGeometryState.data}
          onHoverHouse={setHoveredHouseId}
        />
      </main>
    </div>
  )
}

export default App
