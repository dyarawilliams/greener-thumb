import { useState } from 'react';
import PropTypes from 'prop-types';
import { buildSpeciesListUrl, plantsFromSpeciesList } from './speciesList';

const FormSection = ({ setPlants, setMessage }) => {
    const [formData, setFormData] = useState({
        edible: '',
        pets_kids: '',
        lifespan: '',
        water_schedule: '',
        sunlight: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                shuffleArray(validData);
                setPlants(validData.slice(0, 4));
                setMessage(null);
            } else {
                setPlants([]);
                setMessage("No results returned, please modify your selection and try again.");
            }
        } catch (error) {
            console.error('Error:', error);
            setPlants([]);
            setMessage("Internal Server Error");
        }
    };

    return (
        <div className="form-section">
            <h1>Greener Thumb</h1>
            <h2>Murder Fewer Houseplants...maybe</h2>
            <form id="plant-form" onSubmit={handleSubmit}>
                {['edible', 'pets_kids', 'lifespan', 'water_schedule', 'sunlight'].map((field) => (
                    <div className="question" key={field}>
                        <label htmlFor={field}>{field === 'pets_kids' ? 'PETS OR KIDS' : field.replace('_', ' ').toUpperCase()}</label>
                        <select name={field} id={field} value={formData[field]} onChange={handleChange}>
                            <option value="">No preference</option>
                            {field === 'edible' && <>
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                            </>}
                            {field === 'pets_kids' && <>
                                <option value="0">Yes</option>
                                <option value="1">No</option>
                            </>}
                            {field === 'lifespan' && <>
                                <option value="perennial">Preferably forever - perennial</option>
                                <option value="annual">{"I'm here for a fun time, not a long time - annual"}</option>
                            </>}
                            {field === 'water_schedule' && <>
                                <option value="frequent">Yes - I have a regular schedule</option>
                                <option value="average">Yes - every so often</option>
                                <option value="minimum">Maybe - if I remember, but don&apos;t count on it...</option>
                            </>}
                            {field === 'sunlight' && <>
                                <option value="full_sun">Full sun!</option>
                                <option value="full_shade">All shade, all the time</option>
                                <option value="part_shade">Equal parts sun and shade (or I dunno...)</option>
                            </>}
                        </select>
                    </div>
                ))}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

FormSection.propTypes = {
    setPlants: PropTypes.func.isRequired,
    setMessage: PropTypes.func.isRequired,
};

export default FormSection;
