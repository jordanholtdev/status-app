import { parseWeather } from '../utils/controller';
import PropTypes from 'prop-types';

export default function WeatherData({ flightWeatherData }) {
    // check if data is available before rendering
    if (!flightWeatherData) return null;

    const parsedWeatherData = parseWeather(flightWeatherData);

    const keys = Object.keys(parsedWeatherData);
    return (
        <div className='grid grid-cols-4 gap-1'>
            {keys.map((key) => (
                <div key={key} className='pt-1'>
                    <strong>{key}: </strong>
                    {parsedWeatherData[key]}
                </div>
            ))}
        </div>
    );
}

// validate prop types
WeatherData.propTypes = {
    flightWeatherData: PropTypes.object.isRequired,
};
