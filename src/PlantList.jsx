import PropTypes from 'prop-types';
import { formatCareValue, formatScientificName, plantImageSrc } from './speciesList';

const SPLASH_PLANT_SRC = '/img/splash_plant1.jpg';

const PlantList = ({ plants, message }) => {
    return (
        <div className="image-section">
            {plants !== null ? (
                plants.length > 0 ? (
                    plants.map((plant, index) => {
                        const commonName = plant.common_name || '';
                        const scientificName = formatScientificName(plant.scientific_name);
                        const cycle = formatCareValue(plant.cycle);
                        const watering = formatCareValue(plant.watering);
                        const sunlight = formatCareValue(plant.sunlight);
                        const title = scientificName
                            ? (commonName ? `${commonName} (${scientificName})` : scientificName)
                            : commonName;

                        return (
                            <div className="plant" key={index}>
                                <h3>{title}</h3>
                                <img src={plantImageSrc(plant)} alt={plant.common_name || 'Plant'} />
                                {cycle ? <p>Lifecycle: {cycle}</p> : null}
                                {watering ? <p>Watering: {watering}</p> : null}
                                {sunlight ? <p>Sunlight: {sunlight}</p> : null}
                            </div>
                        );
                    })
                ) : (
                    <p>{message}</p>
                )
            ) : (
                <img src={SPLASH_PLANT_SRC} alt="Greener Thumb Home" className='image-placeholder' />
            )}
        </div>
    );
};

PlantList.propTypes = {
    plants: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        common_name: PropTypes.string,
        scientific_name: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.string),
            PropTypes.string,
        ]),
        default_image: PropTypes.shape({
            small_url: PropTypes.string,
        }),
        cycle: PropTypes.string,
        watering: PropTypes.string,
        sunlight: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.string),
            PropTypes.string,
        ]),
    })),
    message: PropTypes.string,
};

export default PlantList;
