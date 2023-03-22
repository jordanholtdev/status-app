import SearchBar from './SearchBar';
import { useState } from 'react';
import { useGetFlights } from '../hooks/useGetFilghts';
import { supabase } from '../supabaseClient';

const Search = ({ session }) => {
    const { isLoading, flightList, getFlights } = useGetFlights();
    const { selectedResult, setSelectedResult } = useState(null);

    const onSearchSubmit = async (term) => {
        getFlights(term);
    };

    // this function takes the selected result
    // inserts the result into the database
    const handleResultClick = async (selection) => {
        // obtain the user object for the id
        const { user } = session;
        // function takes in the selected flight
        console.log('entered user choice into database:', selection);
        // insert the selected data into the database
        let { data, error } = await supabase
            .from('testing')
            .insert([
                { name: selection.word, user_id: user.id, info: selection },
            ])
            .select();

        console.log(data);
    };

    return (
        <div>
            <div>
                <SearchBar onSubmit={onSearchSubmit} />
            </div>
            <div>
                {isLoading ? (
                    <div>Loading</div>
                ) : (
                    <ul>
                        {flightList.map((flight, idx) => (
                            <li
                                key={idx}
                                onClick={() => handleResultClick(flight)}
                                className='text-gray-400 hover:bg-slate-700 w-4/12 py-1 px-2'
                            >
                                <p className='border-l-4 border-blue-800 hover:border-violet-600 px-4'>
                                    {flight.word}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Search;
