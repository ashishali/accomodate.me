import React, { useState } from 'react';
import HouseCard from './HouseCard';
import AddHouseForm from './AddHouseForm';

const Sidebar = ({
    houses,
    onSelectHouse,
    selectedHouse,
    streets,
    onSelectStreet,
    selectedStreet,
    filters,
    onUpdateFilters,
    streetGeometryState,
    onLoadStreetGeometry,
    searchQuery,
    onSearchChange,
    hoveredHouseId,
    onHoverHouse,
    onAddHouse,
    onDeleteHouse,
    onUpdateHouse,
    currentUser,
    onLogout
}) => {
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'add' | 'edit'

    const updateFilter = (key, value) => {
        onUpdateFilters((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <aside className="glass-panel" style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            padding: '20px',
            overflow: 'hidden'
        }}>
            <header style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '24px', marginBottom: '8px', background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        accomodate.me
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
                            Hi, {currentUser?.name?.split(' ')[0]}
                        </span>
                        <button
                            onClick={onLogout}
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--color-border)',
                                color: 'var(--color-text-muted)',
                                fontSize: '11px',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Log Out
                        </button>
                    </div>
                </div>
                {viewMode === 'list' && !selectedHouse && (
                    <button
                        onClick={() => setViewMode('add')}
                        style={{
                            background: 'var(--color-primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '36px',
                            height: '36px',
                            fontSize: '20px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
                        }}
                        title="List Your Space"
                    >
                        +
                    </button>
                )}
            </header>

            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Search streets or houses..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '12px',
                        border: '1px solid var(--color-border)',
                        background: 'var(--color-surface)',
                        color: 'var(--color-text-main)',
                        outline: 'none'
                    }}
                />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '12px', letterSpacing: '0.05em' }}>Streets</h3>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                    <button
                        onClick={() => onSelectStreet(null)}
                        style={{
                            background: !selectedStreet ? 'var(--color-primary)' : 'var(--color-surface)',
                            color: !selectedStreet ? 'white' : 'var(--color-text-muted)',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '13px',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        All
                    </button>
                    {streets.map(street => (
                        <button
                            key={street}
                            onClick={() => onSelectStreet(street)}
                            style={{
                                background: selectedStreet === street ? 'var(--color-primary)' : 'var(--color-surface)',
                                color: selectedStreet === street ? 'white' : 'var(--color-text-muted)',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '20px',
                                fontSize: '13px',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {street}
                        </button>
                    ))}
                </div>
                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <button
                        onClick={onLoadStreetGeometry}
                        disabled={streetGeometryState.status === 'loading' || streetGeometryState.status === 'ready'}
                        style={{
                            background: 'var(--color-surface)',
                            color: 'var(--color-text-main)',
                            border: '1px solid var(--color-border)',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            cursor: streetGeometryState.status === 'loading' || streetGeometryState.status === 'ready' ? 'not-allowed' : 'pointer',
                            opacity: streetGeometryState.status === 'loading' || streetGeometryState.status === 'ready' ? 0.6 : 1
                        }}
                    >
                        {streetGeometryState.status === 'ready'
                            ? 'Street geometry loaded'
                            : streetGeometryState.status === 'loading'
                                ? 'Loading street geometry...'
                                : 'Load real street geometry'}
                    </button>
                    {streetGeometryState.status === 'error' && (
                        <span style={{ fontSize: '12px', color: '#fca5a5' }}>
                            {streetGeometryState.error}
                        </span>
                    )}
                </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '12px', letterSpacing: '0.05em' }}>Filters</h3>
                <div style={{ display: 'grid', gap: '10px' }}>
                    <label style={{ display: 'grid', gap: '6px', fontSize: '12px' }}>
                        Diet
                        <select
                            value={filters.diet}
                            onChange={(event) => updateFilter('diet', event.target.value)}
                            style={{
                                background: 'var(--color-surface)',
                                color: 'var(--color-text-main)',
                                border: '1px solid var(--color-border)',
                                padding: '8px 10px',
                                borderRadius: '8px'
                            }}
                        >
                            <option value="All">All</option>
                            <option value="Vegetarian">Vegetarian</option>
                            <option value="Non-Vegetarian">Non-Vegetarian</option>
                            <option value="Mixed">Mixed</option>
                        </select>
                    </label>
                    <label style={{ display: 'grid', gap: '6px', fontSize: '12px' }}>
                        Gender preference
                        <select
                            value={filters.gender}
                            onChange={(event) => updateFilter('gender', event.target.value)}
                            style={{
                                background: 'var(--color-surface)',
                                color: 'var(--color-text-main)',
                                border: '1px solid var(--color-border)',
                                padding: '8px 10px',
                                borderRadius: '8px'
                            }}
                        >
                            <option value="Any">Any</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </label>
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
                {viewMode === 'add' ? (
                    <AddHouseForm
                        currentUser={currentUser}
                        onCancel={() => setViewMode('list')}
                        onSubmit={(newHouse) => {
                            onAddHouse(newHouse);
                            setViewMode('list');
                        }}
                    />
                ) : viewMode === 'edit' && selectedHouse ? (
                    <AddHouseForm
                        initialData={selectedHouse}
                        currentUser={currentUser}
                        onCancel={() => setViewMode('list')}
                        onSubmit={(updatedHouse) => {
                            onUpdateHouse(updatedHouse);
                            setViewMode('list');
                        }}
                    />
                ) : selectedHouse ? (
                    <div>
                        <button onClick={() => onSelectHouse(null)} style={{ marginBottom: '16px', background: 'transparent', border: 'none', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}>
                            ← Back to list
                        </button>
                        <div style={{ animation: 'fadeIn 0.3s ease' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                                <h2 style={{ fontSize: '20px', margin: 0 }}>{selectedHouse.address}</h2>
                                {currentUser && selectedHouse.ownerId === currentUser.id && (
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={() => setViewMode('edit')}
                                            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-primary)', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (window.confirm('Delete this listing?')) {
                                                    onDeleteHouse(selectedHouse.id);
                                                }
                                            }}
                                            style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                                <span style={{ background: 'rgba(148, 163, 184, 0.2)', color: 'var(--color-text-main)', padding: '4px 8px', borderRadius: '6px', fontSize: '12px' }}>
                                    Diet: {selectedHouse.dietPreference}
                                </span>
                                <span style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#c7d2fe', padding: '4px 8px', borderRadius: '6px', fontSize: '12px' }}>
                                    {selectedHouse.lookingForRoommates ? 'Looking for roommates' : 'Not looking'}
                                </span>
                                {selectedHouse.lookingForRoommates && (
                                    <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', padding: '4px 8px', borderRadius: '6px', fontSize: '12px' }}>
                                        Gender: {selectedHouse.roommatePreference}
                                    </span>
                                )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {selectedHouse.residents.map(resident => (
                                    <div key={resident.id} className="glass-panel" style={{ padding: '12px', background: 'rgba(255,255,255,0.03)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                            <img src={resident.image} alt={resident.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                                            <div>
                                                <div style={{ fontWeight: '600' }}>{resident.name}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{resident.university}</div>
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '13px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            <span style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', padding: '2px 8px', borderRadius: '4px' }}>
                                                {resident.diet}
                                            </span>
                                            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '2px 8px', borderRadius: '4px' }}>
                                                Looking for: {resident.lookingFor}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {houses.map(house => (
                            <HouseCard
                                key={house.id}
                                house={house}
                                onClick={() => onSelectHouse(house)}
                                isSelected={selectedHouse?.id === house.id}
                                style={{
                                    border: hoveredHouseId === house.id ? '1px solid var(--color-primary)' : undefined,
                                    transform: hoveredHouseId === house.id ? 'translateY(-2px)' : undefined,
                                }}
                                onMouseEnter={() => onHoverHouse(house.id)}
                                onMouseLeave={() => onHoverHouse(null)}
                            />
                        ))}
                        {!houses.length && (
                            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                                No houses match these filters.
                            </span>
                        )}
                    </div>
                )}
            </div>
        </aside >
    );
};

export default Sidebar;
