import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Dashboard from '../components/Dashboard';
import Loading from '../components/Loading';
import Notifications from '../components/Notifications';
import SearchBar from '../components/SearchBar';
import SearchResultsList from '../components/SearchResultsList';

const Create = ({ session }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [flightList, setFlightList] = useState([]);
    const [isSelected, setIsSelected] = useState(null);
    const [selectedResult, setSelectedResult] = useState();
    const [lookupResults, setLookupResults] = useState();
    const [results, setResults] = useState([]);

    useEffect(() => {
        setResults([...flightList]);
    }, [flightList]);

    const onSearchSubmit = async (flightLookupQuery) => {
        setIsLoading(true);
        setIsSelected(false);

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
            // set lookup results state
            // if lookup scheduled render details
            // If not scheduled (past date out of range) render details
            // If lookup was completed but returned no results, render no result found
            setLookupResults(data);
            if (data.lookupComplete === true) {
                setFlightList(data.results.flights);
                setIsLoading(false);
            } else if (data.isScheduled === true) {
                setIsLoading(false);
            } else if (data.lookupStatus === 'Not Scheduled') {
                setIsLoading(false);
            } else {
                console.log('no results');
            }
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

    const scheduleResultSelection = async () => {
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
            // route user to flight list if successful
            console.log(data);
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
                            ) : results.length > 0 &&
                              lookupResults?.lookupComplete === true ? (
                                <div>
                                    <ul className='divide-y divide-dashed divide-zinc-700'>
                                        <SearchResultsList
                                            onSelectResult={handleResultClick}
                                            results={results}
                                        />
                                    </ul>
                                    {isSelected ? (
                                        <button
                                            onClick={scheduleResultSelection}
                                            className='bg-green-700 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium mt-4'
                                        >
                                            Add flight
                                        </button>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            ) : results.length === 0 &&
                              lookupResults?.isScheduled === true ? (
                                <div className='overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg p-4'>
                                    <div className='text-sm text-gray-500'>
                                        We have scheduled your search. View your
                                        upcoming{' '}
                                        <Link
                                            to='/scheduled'
                                            className='text-gray-400 hover:bg-gray-700 hover:text-white '
                                        >
                                            scheduled searches here.
                                        </Link>
                                        .
                                    </div>
                                </div>
                            ) : results.length === 0 &&
                              lookupResults?.lookupStatus ===
                                  'Not Scheduled' ? (
                                <div className='overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg p-4'>
                                    <div className='text-sm text-gray-500'>
                                        Not Scheduled. Date too far in the past
                                        - 10 days historical{' '}
                                    </div>
                                </div>
                            ) : (
                                <></>
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
