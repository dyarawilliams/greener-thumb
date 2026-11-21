import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { buildSpeciesListUrl, pickPlantCards, plantsFromSpeciesList } from './speciesList';

const QUESTIONS = [
    {
        name: 'edible',
        legend: 'Do you want a plant you can eat?',
        options: [
            { value: '', label: 'No preference' },
            { value: '1', label: 'Yes' },
            { value: '0', label: 'No' },
        ],
    },
    {
        name: 'pets_kids',
        legend: 'Will pets or kids share the room?',
        options: [
            { value: '', label: 'No preference' },
            { value: '0', label: 'Yes — safe to have around' },
            { value: '1', label: 'No' },
        ],
    },
    {
        name: 'lifespan',
        legend: 'How long should it live?',
        options: [
            { value: '', label: 'No preference' },
            { value: 'perennial', label: 'Preferably forever - perennial' },
            { value: 'annual', label: "I'm here for a fun time, not a long time - annual" },
        ],
    },
    {
        name: 'water_schedule',
        legend: 'How often can you water?',
        options: [
            { value: '', label: 'No preference' },
            { value: 'frequent', label: 'Yes - I have a regular schedule' },
            { value: 'average', label: 'Yes - every so often' },
            { value: 'minimum', label: "Maybe - if I remember, but don't count on it..." },
        ],
    },
    {
        name: 'sunlight',
        legend: 'How much light does the spot get?',
        options: [
            { value: '', label: 'No preference' },
            { value: 'full_sun', label: 'Full sun!' },
            { value: 'full_shade', label: 'All shade, all the time' },
            { value: 'part_shade', label: 'Equal parts sun and shade (or I dunno...)' },
        ],
    },
];

const FormSection = ({ setPlants, setMessage, setIsSearching, isSearching }) => {
    const [formData, setFormData] = useState({
        edible: '',
        pets_kids: '',
        lifespan: '',
        water_schedule: '',
        sunlight: ''
    });
    const inFlight = useRef(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (inFlight.current) {
            return;
        }
        inFlight.current = true;
        setIsSearching(true);
        setMessage(null);
        const apiUrl = buildSpeciesListUrl(formData, import.meta.env.VITE_PERENUAL_API_KEY);

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            const validData = plantsFromSpeciesList(data);

            if (!validData) {
                setPlants([]);
                setMessage("Internal Server Error");
                return;
            }

            if (validData.length > 0) {
                setPlants(pickPlantCards(validData, 4));
                setMessage(null);
            } else {
                setPlants([]);
                setMessage("No results returned, please modify your selection and try again.");
            }
        } catch (error) {
            console.error('Error:', error);
            setPlants([]);
            setMessage("Internal Server Error");
        } finally {
            inFlight.current = false;
            setIsSearching(false);
        }
    };

    return (
        <section className="finder" id="finder" tabIndex={-1} aria-labelledby="finder-title">
            <div className="shell finder-card">
                <p className="section-kicker">The finder</p>
                <h2 id="finder-title" className="section-title">What does your space look like?</h2>
                <p className="section-intro">
                    Every question is optional. Leave a choice on No preference and it stays out of the search.
                </p>
                <form id="plant-form" onSubmit={handleSubmit}>
                    {QUESTIONS.map((question) => (
                        <fieldset className="question" key={question.name}>
                            <legend>{question.legend}</legend>
                            <div className="choices">
                                {question.options.map((option) => {
                                    const id = `${question.name}-${option.value || 'any'}`;
                                    return (
                                        <label className="choice" key={id} htmlFor={id}>
                                            <input
                                                type="radio"
                                                id={id}
                                                name={question.name}
                                                value={option.value}
                                                checked={formData[question.name] === option.value}
                                                onChange={handleChange}
                                            />
                                            <span>{option.label}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </fieldset>
                    ))}
                    <div className="form-actions">
                        <button type="submit" className="button button-primary" disabled={isSearching}>
                            {isSearching ? 'Searching…' : 'Show plant matches'}
                        </button>
                        <p className="form-note">Up to four indoor plants.</p>
                    </div>
                </form>
            </div>
        </section>
    );
};

FormSection.propTypes = {
    setPlants: PropTypes.func.isRequired,
    setMessage: PropTypes.func.isRequired,
    setIsSearching: PropTypes.func.isRequired,
    isSearching: PropTypes.bool.isRequired,
};

export default FormSection;
