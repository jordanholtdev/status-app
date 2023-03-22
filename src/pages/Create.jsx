import SearchBar from '../components/SearchBar';
import Dashboard from '../components/Dashboard';
import { useState } from 'react';
import { useGetFlights } from '../hooks/useGetFilghts';
import { supabase } from '../supabaseClient';

const Create = ({ session }) => {
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
            <Dashboard key={session.user.id} session={session} />
            <div className='px-4 py-5 sm:px-6 max-w-md'>
                <h3 className='text-base font-semibold leading-6 text-white'>
                    Add flight
                </h3>
                <p className='mt-1 max-w-2xl text-sm text-gray-500'>
                    Select a flight to track.
                </p>
            </div>
            <div className='border-t border-zinc-600'>
                <div className='flex justify-center min-w-full mt-10 '>
                    <div>
                        <p className='text-sm text-gray-300 block leading-5 font-medium py-2'>
                            Enter a flight number:
                        </p>
                        <SearchBar onSubmit={onSearchSubmit} />
                        {isLoading ? (
                            <div>Loading</div>
                        ) : (
                            <div className='py-8'>
                                <p className='text-sm text-gray-300 block leading-5 font-medium py-2'>
                                    Select a result from below:
                                </p>
                                <ul>
                                    {flightList.map((flight, idx) => (
                                        <li
                                            key={idx}
                                            onClick={() =>
                                                handleResultClick(flight)
                                            }
                                            className='text-gray-400 hover:bg-slate-700 w-4/12 py-1 px-2'
                                        >
                                            <p className='border-l-4 border-blue-800 hover:border-violet-600 px-4'>
                                                {flight.word}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Create;
