import { useState } from 'react';
import { fetchFlights } from '../api/fetchFlights';

export const useGetFlights = () => {
    const [flightList, setFlightList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getFlights = (flight) => {
        setIsLoading(true);
        fetchFlights(flight)
            .then(setFlightList)
            .then(() => setIsLoading(false));
    };

    return { isLoading, flightList, getFlights };
};
