const SPECIES_LIST_URL = 'https://perenual.com/api/v2/species-list';

// Form control name -> documented species-list query parameter.
// https://perenual.com/docs/api
const QUERY_PARAM_BY_FIELD = {
    edible: 'edible',
    pets_kids: 'poisonous',
    lifespan: 'cycle',
    water_schedule: 'watering',
    sunlight: 'sunlight',
};

// Allowed query values from the species-list docs.
// poisonous is 0 or 1. The "pets or kids: yes" option is 0 (not poisonous).
// cycle: perennial, annual, biennial, biannual.
// watering: frequent, average, minimum, none.
// sunlight: full_shade, part_shade, sun-part_shade, full_sun.
// edible is 0 or 1. indoor is always sent as 1.
const ALLOWED_VALUES = {
    edible: new Set(['0', '1']),
    poisonous: new Set(['0', '1']),
    cycle: new Set(['perennial', 'annual', 'biennial', 'biannual']),
    watering: new Set(['frequent', 'average', 'minimum', 'none']),
    sunlight: new Set(['full_shade', 'part_shade', 'sun-part_shade', 'full_sun']),
};

export function buildSpeciesListUrl(formData, apiKey) {
    const params = new URLSearchParams();
    params.set('key', apiKey);
    params.set('indoor', '1');

    Object.entries(formData).forEach(([field, value]) => {
        if (value === '') {
            return;
        }
        const paramName = QUERY_PARAM_BY_FIELD[field];
        if (!paramName || !ALLOWED_VALUES[paramName].has(value)) {
            return;
        }
        params.set(paramName, value);
    });

    return `${SPECIES_LIST_URL}?${params.toString()}`;
}

function containsUpgrade(value) {
    if (typeof value === 'string') {
        return value.includes('Upgrade');
    }
    if (Array.isArray(value)) {
        return value.some((entry) => typeof entry === 'string' && entry.includes('Upgrade'));
    }
    return false;
}

// Documented list body is { data: [...], to, per_page, current_page, from, last_page, total }.
// List items include common_name, scientific_name, and default_image.
// cycle, watering, and sunlight are on the details endpoint; when a list item
// still carries one of them and it is an "Upgrade" placeholder, drop that item.
export function plantsFromSpeciesList(payload) {
    if (!payload || typeof payload !== 'object' || !Array.isArray(payload.data)) {
        return null;
    }

    return payload.data.filter((item) => {
        if (!item || typeof item !== 'object') {
            return false;
        }
        return !containsUpgrade(item.cycle)
            && !containsUpgrade(item.watering)
            && !containsUpgrade(item.sunlight);
    });
}

export function formatScientificName(scientificName) {
    if (Array.isArray(scientificName)) {
        return scientificName.filter((name) => typeof name === 'string' && name !== '').join(', ');
    }
    if (typeof scientificName === 'string') {
        return scientificName;
    }
    return '';
}

export function formatCareValue(value) {
    if (typeof value === 'string') {
        return containsUpgrade(value) ? '' : value;
    }
    if (Array.isArray(value)) {
        return value
            .filter((entry) => typeof entry === 'string' && entry !== '' && !entry.includes('Upgrade'))
            .join(', ');
    }
    return '';
}

export const PLACEHOLDER_PLANT_SRC = `${import.meta.env.BASE_URL}img/placeholder_plant.jpg`;

export function plantImageSrc(plant) {
    const url = plant?.default_image?.small_url;
    return typeof url === 'string' && url !== '' ? url : PLACEHOLDER_PLANT_SRC;
}
