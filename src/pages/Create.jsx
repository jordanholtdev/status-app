import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import PropTypes from 'prop-types';
import Loading from '../components/Loading';
import AppDialog from '../components/Dialog';
import Notifications from '../components/Notifications';
import SearchBar from '../components/SearchBar';
import SearchResultsList from '../components/SearchResultsList';

const Create = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [flightList, setFlightList] = useState([]);
    const [isSelected, setIsSelected] = useState(null);
    const [selectedResult, setSelectedResult] = useState();
    const [lookupResults, setLookupResults] = useState();
    const [results, setResults] = useState([]);
    const [errorMessage, setErrorMessage] = useState({
        error: false,
        message: '',
        title: '',
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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
            setIsLoading(false);
            console.log(error);
            setErrorMessage({
                error: true,
                title: 'Lookup Error',
                body: error.message,
            });
            setIsDialogOpen(true);
        }
        // if the lookup was successful, check to see if there are any results
        // if there are no results, set the error message state
        // if there are results, set the lookup results state
        if (data) {
            if (data.results.length === 0) {
                setIsLoading(false);
                setErrorMessage({
                    error: true,
                    title: 'Lookup not completed',
                    body: data.lookupStatus,
                });
                setIsDialogOpen(true);
            } else if (data.isScheduled === true) {
                setIsLoading(false);
                setErrorMessage({
                    error: true,
                    title: 'Lookup Scheduled',
                    body: 'The submitted flight number has been scheduled for lookup. You can view your scheduled lookups on the Scheduled page.',
                });
                setIsDialogOpen(true);
            } else {
                setLookupResults(data);
                setFlightList(data.results.flights);
                setIsLoading(false);
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
            navigate('/flights');
        }
    };

    return (
        <div>
            <Notifications />
            <AppDialog
                open={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                message={errorMessage}
                onClose={() => {
                    setIsDialogOpen(false);
                }}
            />
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
                                    <SearchResultsList
                                        onSelectResult={handleResultClick}
                                        results={results}
                                    />
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
