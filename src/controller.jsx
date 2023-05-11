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
