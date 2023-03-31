import SearchBar from '../components/SearchBar';
import SearchResultsList from '../components/SearchResultsList';
import Dashboard from '../components/Dashboard';
import Notifications from '../components/Notifications';
import Loading from '../components/Loading';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import PropTypes from 'prop-types';

const Create = ({ session }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [flightList, setFlightList] = useState([]);
    const [isSelected, setIsSelected] = useState(null);
    const [selectedResult, setSelectedResult] = useState();
    const [results, setResults] = useState([]);

    useEffect(() => {
        setResults([...flightList]);
    }, [flightList]);

    const onSearchSubmit = async (flightLookupQuery) => {
        setIsLoading(true);
        setIsSelected(false);
        // getFlights(term);

        const { data, error } = await supabase.functions.invoke(
            'flight-lookup',
            {
                body: flightLookupQuery,
            }
        );

        if (error) {
            console.error(error);
        }
        if (data) {
            console.log(
                'search submit function invoking edge function flight-lookup:',
                data,
                error
            );
            setFlightList(data.results);
            setIsLoading(false);
        }
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

    const insertResultSelection = async () => {
        const { data, error } = await supabase.functions.invoke(
            'schedule-flight',
            {
                body: { flight: selectedResult, depart_date: '2023-03-04' },
            }
        );

        if (error) {
            console.error(error);
        }
        if (data) {
            // reset the selection state
            setIsSelected(false);
            // send user to their list if successful
            navigate('/flights');
        }
    };

    return (
        <div>
            <Dashboard key={session.user.id} session={session} />
            <Notifications />
            <div className='px-4 py-5 sm:px-6 max-w-md'>
                <h2 className='text-base font-semibold leading-6 text-white'>
                    Search for a flight
                </h2>
                <p className='mt-1 max-w-2xl text-sm text-gray-500'>
                    Enter a date & flight number
                </p>
            </div>
            <div className='border-t border-zinc-600'>
                <div className='flex justify-center mt-7 min-w-full'>
                    <div className='w-full sm:w-9/12 px-4'>
                        <div>
                            <SearchBar onSubmit={onSearchSubmit} />
                            {isLoading ? (
                                <Loading />
                            ) : (
                                <div className='py-8'>
                                    {results.length === 0 ? (
                                        <></>
                                    ) : (
                                        <p className='text-sm text-gray-300 block leading-5 font-medium py-4'>
                                            Select & save a result:
                                        </p>
                                    )}

                                    <ul className='divide-y divide-dashed divide-zinc-700'>
                                        <SearchResultsList
                                            onSelectResult={handleResultClick}
                                            results={results}
                                        />
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
        </div>
    );
};

Create.propTypes = {
    session: PropTypes.object.isRequired,
};

export default Create;
