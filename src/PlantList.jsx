import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { PLACEHOLDER_PLANT_SRC, formatCareValue, formatScientificName, plantImageSrc } from './speciesList';

const ERROR_MESSAGE = 'Internal Server Error';

function presentCare(value) {
    const raw = formatCareValue(value);
    if (!raw) {
        return '';
    }
    return raw
        .split(', ')
        .map((part) => {
            const words = part.replaceAll('_', ' ').replaceAll('-', ' ');
            return words.charAt(0).toUpperCase() + words.slice(1);
        })
        .join(', ');
}

function viewState(plants, message, isSearching) {
    if (isSearching) {
        return 'loading';
    }
    if (plants === null) {
        return 'idle';
    }
    if (plants.length > 0) {
        return 'results';
    }
    if (message === ERROR_MESSAGE) {
        return 'error';
    }
    return 'empty';
}

const defaultImageShape = PropTypes.shape({
    small_url: PropTypes.string,
    medium_url: PropTypes.string,
    regular_url: PropTypes.string,
    thumbnail: PropTypes.string,
    original_url: PropTypes.string,
});

function PlantPhoto({ plant, alt }) {
    const preferred = plantImageSrc(plant);
    const [failedSrc, setFailedSrc] = useState(null);
    const src = failedSrc === preferred ? PLACEHOLDER_PLANT_SRC : preferred;

    return (
        <div className={src === PLACEHOLDER_PLANT_SRC ? 'plant-photo is-fallback' : 'plant-photo'}>
            <img
                src={src}
                alt={alt}
                onError={() => {
                    if (src !== PLACEHOLDER_PLANT_SRC) {
                        setFailedSrc(preferred);
                    }
                }}
            />
        </div>
    );
}

PlantPhoto.propTypes = {
    plant: PropTypes.shape({
        default_image: defaultImageShape,
    }),
    alt: PropTypes.string.isRequired,
};

const PlantList = ({ plants, message, isSearching }) => {
    const headingRef = useRef(null);
    const hasSearched = useRef(false);
    const state = viewState(plants, message, isSearching);

    useEffect(() => {
        if (isSearching) {
            hasSearched.current = true;
            return;
        }
        if (hasSearched.current) {
            hasSearched.current = false;
            headingRef.current?.focus();
        }
    }, [isSearching, plants, message]);

    let heading = 'Your matches';
    if (state === 'loading') {
        heading = 'Searching for plants';
    } else if (state === 'results') {
        heading = plants.length === 1 ? '1 plant match' : `${plants.length} plant matches`;
    } else if (state === 'empty') {
        heading = 'No plants matched';
    } else if (state === 'error') {
        heading = 'Could not load plants';
    }

    return (
        <section
            className="results"
            id="results"
            data-state={state}
            aria-busy={isSearching}
            aria-labelledby="results-title"
        >
            <div className="shell">
                <div className="results-copy">
                    <h2
                        id="results-title"
                        className="section-title"
                        tabIndex={-1}
                        ref={headingRef}
                        aria-describedby={state === 'empty' || state === 'error' ? 'results-message' : undefined}
                    >
                        {heading}
                    </h2>
                </div>
                {state === 'idle' ? (
                    <div className="notice notice-idle">
                        <h3>Nothing here yet</h3>
                        <p>Choose any preferences you care about, then search. Matches will show up in this spot.</p>
                    </div>
                ) : null}
                {state === 'loading' ? (
                    <>
                        <p className="searching-label">Searching for plants…</p>
                        <ul className="plant-grid" aria-hidden="true">
                            {[0, 1, 2, 3].map((item) => (
                                <li key={item}>
                                    <div className="plant-card">
                                        <div className="skeleton skeleton-photo" />
                                        <div className="plant-body">
                                            <div className="skeleton skeleton-line" />
                                            <div className="skeleton skeleton-line skeleton-line-short" />
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </>
                ) : null}
                {state === 'results' ? (
                    <ul className="plant-grid">
                        {plants.map((plant, index) => {
                            const commonName = typeof plant.common_name === 'string' ? plant.common_name : '';
                            const scientificName = formatScientificName(plant.scientific_name);
                            const title = commonName || scientificName || 'Unnamed plant';
                            const showScientific = Boolean(scientificName) && scientificName !== title;
                            const care = [
                                ['Lifecycle', presentCare(plant.cycle)],
                                ['Watering', presentCare(plant.watering)],
                                ['Sunlight', presentCare(plant.sunlight)],
                            ].filter(([, value]) => value);
                            const alt = commonName
                                ? `Photo of ${commonName}`
                                : scientificName
                                    ? `Photo of ${scientificName}`
                                    : 'Plant photo';

                            return (
                                <li key={plant.id ?? `${title}-${index}`}>
                                    <article className="plant-card">
                                        <PlantPhoto plant={plant} alt={alt} />
                                        <div className="plant-body">
                                            <h3>{title}</h3>
                                            {showScientific ? (
                                                <p className="scientific"><em>{scientificName}</em></p>
                                            ) : null}
                                            {care.length > 0 ? (
                                                <dl className="care">
                                                    {care.map(([label, value]) => (
                                                        <div key={label}>
                                                            <dt>{label}</dt>
                                                            <dd>{value}</dd>
                                                        </div>
                                                    ))}
                                                </dl>
                                            ) : null}
                                        </div>
                                    </article>
                                </li>
                            );
                        })}
                    </ul>
                ) : null}
                {state === 'empty' || state === 'error' ? (
                    <div className={state === 'error' ? 'notice notice-error' : 'notice notice-empty'} role={state === 'error' ? 'alert' : 'status'}>
                        <p id="results-message">{message}</p>
                    </div>
                ) : null}
            </div>
        </section>
    );
};

const plantShape = PropTypes.shape({
    id: PropTypes.number,
    common_name: PropTypes.string,
    scientific_name: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.string,
    ]),
    default_image: defaultImageShape,
    cycle: PropTypes.string,
    watering: PropTypes.string,
    sunlight: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.string,
    ]),
});

PlantList.propTypes = {
    plants: PropTypes.oneOfType([
        PropTypes.oneOf([null]),
        PropTypes.arrayOf(plantShape),
    ]),
    message: PropTypes.oneOfType([
        PropTypes.oneOf([null]),
        PropTypes.string,
    ]),
    isSearching: PropTypes.bool.isRequired,
};

export default PlantList;
