const BASE_URL = 'https://api.datamuse.com/words?rel_rhy=';

export const fetchFlights = (flight) => {
    // replace with logic for fetching data
    return fetch(`${BASE_URL}${flight}`).then((res) => res.json());
};
