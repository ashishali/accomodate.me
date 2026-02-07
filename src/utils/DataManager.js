import { faker } from '@faker-js/faker';

// Jersey City Focus Area (Grove St / Downtown)
const JC_CENTER = [40.7194, -74.0431];

export const STREETS = [
    { name: 'Newark Ave', start: [40.7214, -74.0450], end: [40.7200, -74.0400] },
    { name: 'Grove St', start: [40.7170, -74.0430], end: [40.7230, -74.0430] },
    { name: 'Columbus Dr', start: [40.7180, -74.0460], end: [40.7180, -74.0380] },
    { name: 'Jersey Ave', start: [40.7160, -74.0480], end: [40.7240, -74.0480] }
];

const UNIVERSITIES = ['Stevens Institute of Tech', 'NJIT', 'NYU', 'Pace University', 'Columbia'];
const DIETS = ['Vegetarian', 'Non-Vegetarian'];
const ROOMMATE_PREFS = ['Any', 'Male', 'Female'];

const deriveDietPreference = (residents) => {
    const uniqueDiets = new Set(residents.map((resident) => resident.diet));
    if (uniqueDiets.size === 1) {
        return uniqueDiets.has('Vegetarian') ? 'Vegetarian' : 'Non-Vegetarian';
    }
    return 'Mixed';
};

export const generateData = () => {
    const houses = [];

    STREETS.forEach(street => {
        // Generate 5-10 houses per street
        const numHouses = Math.floor(Math.random() * 6) + 5;

        for (let i = 0; i < numHouses; i++) {
            // Interpolate position along the street line
            const t = Math.random(); // Position ratio 0 to 1
            const lat = street.start[0] + (street.end[0] - street.start[0]) * t;
            const lng = street.start[1] + (street.end[1] - street.start[1]) * t;

            // Add slight jitter so they aren't perfectly on the line
            const jitter = 0.0004;
            const finalLat = lat + (Math.random() * jitter - jitter / 2);
            const finalLng = lng + (Math.random() * jitter - jitter / 2);

            const residents = generateResidents();
            const lookingForRoommates = Math.random() > 0.35;
            const roommatePreference = lookingForRoommates
                ? ROOMMATE_PREFS[Math.floor(Math.random() * ROOMMATE_PREFS.length)]
                : 'None';

            houses.push({
                id: `h-${street.name.replace(/\s/g, '')}-${i}`,
                street: street.name,
                address: `${Math.floor(Math.random() * 200) + 1} ${street.name}`,
                position: [finalLat, finalLng],
                residents,
                lookingForRoommates,
                roommatePreference,
                dietPreference: deriveDietPreference(residents)
            });
        }
    });

    return { houses, streets: STREETS.map(s => s.name) };
};

const generateResidents = () => {
    const numResidents = Math.floor(Math.random() * 4) + 1; // 1-4 residents
    const residents = [];

    for (let i = 0; i < numResidents; i++) {
        residents.push({
            id: `r-${i}`,
            name: faker.person.fullName(),
            university: UNIVERSITIES[Math.floor(Math.random() * UNIVERSITIES.length)],
            diet: DIETS[Math.floor(Math.random() * DIETS.length)],
            lookingFor: ROOMMATE_PREFS[Math.floor(Math.random() * ROOMMATE_PREFS.length)],
            image: faker.image.avatar()
        });
    }
    return residents;
};

export const MOCK_DATA = generateData();
