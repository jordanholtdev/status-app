import SearchBar from '../components/SearchBar';
import Dashboard from '../components/Dashboard';
import { useEffect, useState } from 'react';
import { useGetFlights } from '../hooks/useGetFilghts';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import PropTypes from 'prop-types';

const Create = ({ session }) => {
    const navigate = useNavigate();
    const { isLoading, flightList, getFlights } = useGetFlights();
    const [isSelected, setIsSelected] = useState(null);
    const [selectedResult, setSelectedResult] = useState();
    const [results, setResults] = useState([]);

    useEffect(() => {
        setResults([...flightList]);
    }, [flightList]);

    const onSearchSubmit = async (term) => {
        setIsSelected(false);
        getFlights(term);
    };

    // handles the selection of a single result
    const handleResultClick = async (selection) => {
        // set the selection state to true
        // set the selected result
        // remove the unselected results from the results array
        setIsSelected(true);
        setSelectedResult(selection);
        const newResults = [];
        newResults.push(selection);
        setResults(newResults);
    };

    // this function inserts the result into the database
    const insertResultSelection = async () => {
        const { user } = session;
        console.log('the selected result is:', selectedResult);
        // insert the selected data into the database
        let { data, error } = await supabase
            .from('testing')
            .insert([
                {
                    name: selectedResult.word,
                    user_id: user.id,
                    info: selectedResult,
                },
            ])
            .select();

        if (error) {
            console.error(error);
        }
        if (data) {
            console.log('selection insereted', data);
            // reset the selection state

            setIsSelected(false);
            // send user to their list if successful
            navigate('/flights');
        }
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
                                    {results.slice(0, 5).map((flight, idx) => (
                                        <li
                                            key={idx}
                                            onClick={() => {
                                                handleResultClick(flight);
                                            }}
                                            className={`text-gray-400 hover:bg-zinc-800 py-4 px-2 focus:ring focus:ring-violet-300`}
                                        >
                                            <div className='flex flex-row space-x-4'>
                                                <div className='border-l-4 mt-1 border-zinc-400 hover:border-gray-600 px-4 text-md text-gray-400'>
                                                    {flight.word}
                                                </div>
                                                <div className='text-sm text-gray-900 px-4 py-2 bg-zinc-500 rounded-lg'>
                                                    {flight.score}
                                                </div>
                                                <div className='text-sm font-medium text-gray-500 py-2'>
                                                    Airline:{' '}
                                                    {flight.numSyllables}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                {isSelected ? (
                                    <button
                                        onClick={insertResultSelection}
                                        className='bg-green-700 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium mt-4'
                                    >
                                        Add flight
                                    </button>
                                ) : (
                                    <></>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

Create.propTypes = {
    session: PropTypes.object.isRequired,
};

export default Create;
