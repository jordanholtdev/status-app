// Function to format the date
// It takes in a date string and returns a formatted date string in the format of YYYY-MM-DD
export const formatDate = (date) => {
    const newDate = new Date(date);
    const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    };
    const formattedDate = newDate.toLocaleDateString('en-US', options);

    return formattedDate;
};

// Function to convert seconds to HH:MM:SS
// It takes in a number of seconds and returns a string in the format of HH:MM:SS
export const convertSecondsToHHMMSS = (seconds) => {
    const date = new Date(null);
    date.setSeconds(seconds);
    const result = date.toISOString().substr(11, 8);
    return result;
};

export const minuteZeroes = (num) => {
    return (num < 10 ? '0' : '') + num;
};

export const makeTime = (time) => {
    if (isNaN(time)) {
        return '';
    }
    let millis = new Date(time);
    let hours = millis.getUTCHours();
    let minutes = millis.getMinutes();
    return `${hours}:${minuteZeroes(minutes)} GMT`;
};

// create a function that accepts a date
// then subtracts two days from the date and returns the new date as a string in the format YYYY-MM-DD
export const subtractTwoDays = (date) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 2);
    const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    const formattedDate = newDate.toLocaleDateString('en-US', options);
    return formattedDate;
};

export const getDepartureTime = (flight) => {
    if (flight.actual_off) {
        let time = {
            estimated: false,
            time: Date.parse(flight.actual_off),
        };
        return time;
    }
    let time = {
        estimated: true,
        time: Date.parse(flight.predicted_off || flight.estimated_off),
    };
    return time;
};

export const getArrivalTime = (flight) => {
    if (flight.actual_on) {
        let time = {
            estimated: false,
            time: Date.parse(flight.actual_on),
        };
        return time;
    }
    let time = {
        estimated: true,
        time: Date.parse(flight.predicted_on || flight.estimated_on),
    };
    return time;
};

export const hasDeparted = (flight) => {
    const now = Date.now();

    const departureTime =
        flight.actual_off || flight.predicted_off || flight.estimated_off;

    return (
        (flight.actual_off && !hasLanded(flight)) ||
        now - Date.parse(departureTime) > 1800000
    );
};

const hasLanded = (flight) => {
    return flight.actual_on;
};

const isAirborne = (flight) => {
    return hasDeparted(flight) && !hasLanded(flight) && !flight.true_cancel;
};

export const flightStatus = (flight) => {
    const now = Date.now();

    const arrivalTime =
        flight.predicted_in || flight.scheduled_in || flight.estimated_in;

    if (hasLanded(flight)) {
        if (flight.actual_in) {
            return <span className='actual'>Parked</span>;
        } else if (hasDeparted(flight) && now > Date.parse(arrivalTime)) {
            return <span className='estimated'>Parked (estimated)</span>;
        }
        return <span className='actual'>Landed</span>;
    } else if (isAirborne(flight)) {
        return <span className='actual'>En Route</span>;
    }

    return <span className='actual'>Scheduled</span>;
};

// function that takes in the json weather object, parses the data and returns it
export const parseWeather = (forecast) => {
    // check if data is available before parsing
    if (!forecast) return null;
    let commonProperties = {
        lat: forecast.coord_lat,
        lon: forecast.coord_lon,
        city: forecast.destination_city,
        forecast_city: forecast.forecast_city,
        country: forecast.country,
        sunrise: convertTime(forecast.sunrise),
        sunset: convertTime(forecast.sunset),
    };

    // check to see if the forecast.weather property is present
    // if it is, parse the data, flatten it, and add it to the commonProperties object
    if (forecast.weather) {
        const weather = JSON.parse(forecast.weather);
        // the properties in the array of weather objects are unkown so we need to flatten them
        const weatherProperties = weather.weather[0];
        const weatherPropertiesFlattened = Object.keys(
            weatherProperties
        ).reduce((acc, key) => {
            return {
                ...acc,
                [key]: weatherProperties[key],
            };
        }, {});
        // iterate through the weatherPropertiesFlattened object and add the properties to the commonProperties object
        for (const property in weatherPropertiesFlattened) {
            // check to see if icon or id exists in the weatherPropertiesFlattened object and remove them
            if (property === 'icon' || property === 'id') continue;
            commonProperties[property] = weatherPropertiesFlattened[property];
        }
        // add the remaining properties to the commonProperties object
        commonProperties['weather_status'] = calculateWeatherCondition(
            weather.weather[0].description,
            weather.wind.speed,
            weather.pop
        );
        commonProperties['temp'] = weather.main.temp;
        commonProperties['feels_like'] = weather.main.feels_like;
        commonProperties['temp_min'] = `${weather.main.temp_min}°C`;
        commonProperties['temp_max'] = `${weather.main.temp_max}°C`;
        commonProperties['pressure'] = weather.main.pressure;
        commonProperties['humidity'] = weather.main.humidity;
        commonProperties['wind_speed'] = weather.wind.speed;
        commonProperties['wind_deg'] = weather.wind.deg;
        commonProperties['clouds'] = weather.clouds.all;
        commonProperties['visibility'] = weather.visibility;
        commonProperties['pop'] = weather.pop;
        commonProperties['wind_dir'] = calculateWindDirection(weather.wind.deg);
    }
    return commonProperties;
};

// function that calculates the wind direction based on the wind degree
export const calculateWindDirection = (wind_deg) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round((wind_deg % 360) / 45);
    return directions[index % 8];
};

// function that converts the timeformat 1684372101 to a human readable format
export const convertTime = (time) => {
    const date = new Date(time * 1000);
    const hours = date.getHours();
    const minutes = '0' + date.getMinutes();
    const formattedTime = hours + ':' + minutes.substr(-2);
    return formattedTime;
};

// function that calculates the overall weather condition based on the weather description, wind speed and rain
export const calculateWeatherCondition = (weather, wind_speed, rain) => {
    const weatherConditions = [
        { keyword: 'rain', value: 'rainy' },
        { keyword: 'snow', value: 'snowy' },
        { keyword: 'cloud', value: 'cloudy' },
        { keyword: 'clear', value: 'clear' },
        { keyword: 'thunderstorm', value: 'thunderstorm' },
        { keyword: 'drizzle', value: 'drizzle' },
        { keyword: 'fog', value: 'fog' },
        { keyword: 'mist', value: 'mist' },
        { keyword: 'haze', value: 'haze' },
        { keyword: 'smoke', value: 'smoke' },
        { keyword: 'sand', value: 'sand' },
        { keyword: 'ash', value: 'ash' },
        { keyword: 'squall', value: 'squall' },
        { keyword: 'tornado', value: 'tornado' },
        { keyword: 'volcanic', value: 'volcanic' },
        { keyword: 'dust', value: 'dust' },
    ];

    // Check for wind speed above 10 m/s and add warning
    let weatherCondition = '';
    if (wind_speed > 10) {
        weatherCondition = `High wind speed (${wind_speed} km/h)`;
        weatherConditions.forEach((condition) => {
            if (weather.includes(condition.keyword)) {
                weatherCondition += ` with ${condition.value}`;
            }
        });
        weatherCondition += ' warning';
    } else if (rain > 10) {
        weatherCondition = `Heavy rain (${rain} mm)`;
        weatherConditions.forEach((condition) => {
            if (weather.includes(condition.keyword)) {
                weatherCondition += ` with ${condition.value}`;
            }
        });
    } else {
        // Check weather description for other conditions
        weatherConditions.forEach((condition) => {
            if (weather.includes(condition.keyword)) {
                weatherCondition = condition.value;
            }
        });
    }

    return weatherCondition;
};
