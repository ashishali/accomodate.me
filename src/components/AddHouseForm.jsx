import React, { useState, useEffect } from 'react';
import { geocodeAddress } from '../utils/geocoding';

const AddHouseForm = ({ onCancel, onSubmit, initialData = null, currentUser }) => {
    const [formData, setFormData] = useState({
        address: '',
        diet: 'Non-Vegetarian',
        lookingForRoommates: true,
        roommatePreference: 'Any',
        university: '',
        residentCount: 1
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                address: initialData.address,
                diet: initialData.dietPreference,
                lookingForRoommates: initialData.lookingForRoommates,
                roommatePreference: initialData.roommatePreference,
                university: initialData.residents[0]?.university || '',
                residentCount: initialData.residents.length || 1
            });
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let location = null;
            let streetName = '';

            // Only geocode if address changed or it's new
            if (!initialData || initialData.address !== formData.address) {
                location = await geocodeAddress(formData.address);
                if (!location) {
                    setError("Could not find this address in New Jersey. Please try being more specific.");
                    setLoading(false);
                    return;
                }
                streetName = formData.address.split(',')[0].trim();
            } else {
                // Keep existing location data
                location = {
                    lat: initialData.position[0],
                    lng: initialData.position[1]
                };
                streetName = initialData.street;
            }

            // Generate residents
            const residents = [];
            for (let i = 0; i < formData.residentCount; i++) {
                // First resident is the "owner" / user
                if (i === 0) {
                    residents.push({
                        id: initialData?.residents[0]?.id || `r-new-${Date.now()}-0`,
                        name: initialData?.residents[0]?.name || currentUser?.name || 'Anonymous',
                        university: formData.university || 'Unknown University',
                        diet: formData.diet,
                        lookingFor: formData.lookingForRoommates ? formData.roommatePreference : 'None',
                        image: initialData?.residents[0]?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`
                    });
                } else {
                    // Dummy residents
                    residents.push({
                        id: `r-new-${Date.now()}-${i}`,
                        name: `Housemate ${i + 1}`,
                        university: 'Housemate',
                        diet: 'Unknown',
                        lookingFor: 'None',
                        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now() + i}`
                    });
                }
            }

            const houseData = {
                id: initialData ? initialData.id : `new-${Date.now()}`,
                street: streetName,
                address: formData.address,
                position: [location.lat, location.lng],
                lookingForRoommates: formData.lookingForRoommates,
                roommatePreference: formData.lookingForRoommates ? formData.roommatePreference : 'None',
                dietPreference: formData.diet,
                residents: residents,
                ownerId: initialData?.ownerId // Preserve owner if editing
            };

            onSubmit(houseData);
        } catch (err) {
            setError("Failed to process listing. Please check your connection.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>
                {initialData ? 'Edit Listing' : 'List Your Space (NJ)'}
            </h3>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px' }}>
                Full Address (Street, City, Zip)
                <input
                    type="text"
                    required
                    placeholder="e.g. 1 Castle Point Ter, Hoboken, NJ"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'white' }}
                />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px' }}>
                Total Residents
                <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={formData.residentCount}
                    onChange={e => setFormData({ ...formData, residentCount: parseInt(e.target.value) || 1 })}
                    style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'white' }}
                />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px' }}>
                University
                <input
                    type="text"
                    required
                    placeholder="e.g. Rutgers, Princeton, Montclair State"
                    value={formData.university}
                    onChange={e => setFormData({ ...formData, university: e.target.value })}
                    style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'white' }}
                />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px' }}>
                House Diet
                <select
                    value={formData.diet}
                    onChange={e => setFormData({ ...formData, diet: e.target.value })}
                    style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'white' }}
                >
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Vegetarian">Vegetarian</option>
                </select>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                <input
                    type="checkbox"
                    checked={formData.lookingForRoommates}
                    onChange={e => setFormData({ ...formData, lookingForRoommates: e.target.checked })}
                />
                Looking for roommates?
            </label>

            {formData.lookingForRoommates && (
                <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px' }}>
                    Roommate Preference
                    <select
                        value={formData.roommatePreference}
                        onChange={e => setFormData({ ...formData, roommatePreference: e.target.value })}
                        style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'white' }}
                    >
                        <option value="Any">Any</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </label>
            )}

            {error && (
                <div style={{ color: '#fca5a5', fontSize: '12px', background: 'rgba(252, 165, 165, 0.1)', padding: '8px', borderRadius: '4px' }}>
                    {error}
                </div>
            )}

            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: 'var(--color-surface)', color: 'var(--color-text-muted)', cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: 'var(--color-primary)', color: 'white', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
                >
                    {loading ? 'Processing...' : (initialData ? 'Update Listing' : 'Create Listing')}
                </button>
            </div>
        </form>
    );
};

export default AddHouseForm;
