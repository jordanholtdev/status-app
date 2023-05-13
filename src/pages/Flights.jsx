import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import FlightsList from '../components/FlightsList';
import {
    ChevronRightIcon,
    MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import Notifications from '../components/Notifications';
import PropTypes from 'prop-types';

const List = ({ session }) => {
    const [loading, setLoading] = useState();
    const [flights, setFlights] = useState([]);
    const [sortedData, setSortedData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortType, setSortType] = useState('asc');
    const [filter, setFilter] = useState({
        column: 'id',
        direction: 'asc',
        id: '',
        origin_name: '',
        created_at: '',
        ident: '',
        destination_name: '',
        status: '',
        scheduled_out: '',
        route_distance: '',
    });

    // fetch the saved flights from db
    // fetch only flights belonging to user
    useEffect(() => {
        async function getSavedFlights() {
            setLoading(true);
            const { user } = session;

            let { data, error } = await supabase
                .from('flights')
                .select(`*`)
                .eq('user_id', user.id);

            if (error) {
                console.warn(error);
            } else if (data) {
                setFlights(data);
            }

            setLoading(false);
        }

        getSavedFlights();
    }, [session]);

    useEffect(() => {
        const defaultSort = {
            column: 'id',
            direction: 'asc',
        };
        const storedSort = localStorage.getItem('defaultSort');
        if (storedSort) {
            setFilter(JSON.parse(storedSort));
        } else {
            setFilter(defaultSort);
            localStorage.setItem('defaultSort', JSON.stringify(defaultSort));
        }
    }, []);

    // Sort the flights by the selected column and sort type
    useEffect(() => {
        const sortedFlights = flights.sort((a, b) => {
            if (sortType === 'asc') {
                if (a[filter.column] < b[filter.column]) return -1;
                if (a[filter.column] > b[filter.column]) return 1;
                return 0;
            } else {
                if (a[filter.column] < b[filter.column]) return 1;
                if (a[filter.column] > b[filter.column]) return -1;
                return 0;
            }
        });

        setSortedData(sortedFlights);
        localStorage.setItem('defaultSort', JSON.stringify(filter));
    }, [flights, sortType, filter.column]);

    // Search filter
    const searchFilter = (query) => {
        const normalizedQuery = query.toLowerCase().trim();
        return flights.filter(
            (flight) =>
                flight.origin_name.toLowerCase().includes(normalizedQuery) ||
                flight.destination_name
                    .toLowerCase()
                    .includes(normalizedQuery) ||
                flight.ident.toLowerCase().includes(normalizedQuery) ||
                flight.status.toLowerCase().includes(normalizedQuery)
        );
    };

    // Filter the flights by the values entered in the filter inputs
    const filteredFlights = useMemo(() => {
        let result = sortedData.length ? sortedData : flights;

        try {
            // Filter by other criteria

            // Apply search filter
            result = searchFilter(searchQuery).filter((filteredFlight) => {
                return sortedData.some((flight) => {
                    return filteredFlight.id === flight.id;
                });
            });

            // Apply sorting logic
            if (filter.column === 'scheduled_out') {
                if (sortType === 'asc') {
                    result.sort(
                        (a, b) =>
                            new Date(a.scheduled_out).getTime() -
                            new Date(b.scheduled_out).getTime()
                    );
                } else {
                    result.sort(
                        (a, b) =>
                            new Date(b.scheduled_out).getTime() -
                            new Date(a.scheduled_out).getTime()
                    );
                }
            } else if (filter.column === 'created_at') {
                if (sortType === 'asc') {
                    result.sort(
                        (a, b) =>
                            new Date(a.created_at).getTime() -
                            new Date(b.created_at).getTime()
                    );
                } else {
                    result.sort(
                        (a, b) =>
                            new Date(b.created_at).getTime() -
                            new Date(a.created_at).getTime()
                    );
                }
            } else if (filter.column === 'route_distance') {
                if (sortType === 'asc') {
                    result.sort((a, b) => a.route_distance - b.route_distance);
                } else {
                    result.sort((a, b) => b.route_distance - a.route_distance);
                }
            } else if (filter.column === 'id') {
                if (sortType === 'asc') {
                    result.sort((a, b) => a.id - b.id);
                } else {
                    result.sort((a, b) => b.id - a.id);
                }
            }
        } catch (error) {
            console.warn(error);
        }

        return result;
    }, [flights, searchQuery, filter, sortType, sortedData]);

    // handle sort by column
    // if column is already selected, toggle sort type
    // if column is not selected, set sort type to asc
    const handleSort = (column) => {
        if (filter.column === column) {
            setSortType(sortType === 'asc' ? 'desc' : 'asc');
        } else if (column === 'default') {
            // case to remove current sorting and set back to default
            setFilter({
                column: 'id',
                direction: 'asc',
            });
            setSortType('asc');
        } else {
            setFilter({
                column,
                direction: 'asc',
            });
        }
    };

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // allow user to delete item from list

    const handleDelete = async (flight) => {
        // Ask user to confirm deletion of flight
        const confirm = window.confirm(
            `Are you sure you want to delete ${flight.ident} to ${flight.destination_city}?`
        );

        if (confirm) {
            const { error } = await supabase
                .from('flights')
                .delete()
                .eq('id', flight.id);

            if (error) {
                console.warn(error);
            }
            setFlights(flights.filter((item) => item.id !== flight.id));
        }
    };

    return (
        <div>
            <Notifications />
            <div className='px-4 py-5 sm:px-6 max-w-md'>
                <h3 className='text-base font-semibold leading-6 text-white'>
                    Flights
                </h3>
                <p className='mt-1 max-w-2xl text-sm text-gray-500'>
                    You currently have {flights.length} flights saved.
                </p>
                <o className='mt-1 max-w-2xl text-sm text-gray-500'>
                    You can search, sort, and filter your flights below.
                </o>
            </div>
            <div className='border-t border-zinc-600'>
                <div>
                    <div className='flex flex-col pt-6'>
                        <div className='flex justify-center'>
                            <div className='relative lg:w-1/2'>
                                <label
                                    htmlFor='search-input'
                                    className='mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white'
                                >
                                    Search
                                </label>
                                <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                                    <MagnifyingGlassIcon className='h-4 w-4 text-white' />
                                </div>
                                <input
                                    type='text'
                                    id='search-input'
                                    placeholder='Search flights, destinations, or origins...'
                                    className='block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                    value={searchQuery}
                                    onChange={handleSearchInputChange}
                                />
                            </div>
                        </div>
                        <div className='flex w-full justify-center pt-6'>
                            <button
                                type='button'
                                className={
                                    filter.column === 'scheduled_out'
                                        ? sortType === 'asc'
                                            ? 'sort-asc text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center mr-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800 inline-flex items-center'
                                            : filter.direction === 'default' // added condition to check if no sort type is selected
                                            ? 'text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800 inline-flex items-center'
                                            : 'sort-desc text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center mr-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800 inline-flex items-center'
                                        : 'text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800 inline-flex items-center'
                                }
                                onClick={() =>
                                    handleSort(
                                        filter.column === 'default'
                                            ? 'default'
                                            : 'scheduled_out'
                                    )
                                }
                            >
                                {filter.column === 'default'
                                    ? 'Default'
                                    : 'Departs'}
                                <ChevronRightIcon
                                    className={
                                        filter.column === 'scheduled_out'
                                            ? sortType === 'asc'
                                                ? 'sort-asc -rotate-90 transform h-5 w-5 ml-2'
                                                : 'sort-desc rotate-90 transform h-5 w-5 ml-2'
                                            : 'h-5 w-5 ml-2'
                                    }
                                />
                            </button>
                            <button
                                type='button'
                                className={
                                    filter.column === 'created_at'
                                        ? sortType === 'asc'
                                            ? 'sort-asc text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center mr-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800 inline-flex items-center'
                                            : filter.direction === 'default' // added condition to check if no sort type is selected
                                            ? 'text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800 inline-flex items-center'
                                            : 'sort-desc text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center mr-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800 inline-flex items-center'
                                        : 'text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800 inline-flex items-center'
                                }
                                onClick={() =>
                                    handleSort(
                                        filter.column === 'default'
                                            ? 'default'
                                            : 'created_at'
                                    )
                                }
                            >
                                {filter.column === 'default'
                                    ? 'Default'
                                    : 'Created'}
                                <ChevronRightIcon
                                    className={
                                        filter.column === 'created_at'
                                            ? sortType === 'asc'
                                                ? 'sort-asc -rotate-90 transform h-5 w-5 ml-2'
                                                : 'sort-desc rotate-90 transform h-5 w-5 ml-2'
                                            : 'h-5 w-5 ml-2'
                                    }
                                />
                            </button>
                            <button
                                type='button'
                                className={
                                    filter.column === 'route_distance'
                                        ? sortType === 'asc'
                                            ? 'sort-asc text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center mr-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800 inline-flex items-center'
                                            : filter.direction === 'default' // added condition to check if no sort type is selected
                                            ? 'text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800 inline-flex items-center'
                                            : 'sort-desc text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center mr-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800 inline-flex items-center'
                                        : 'text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800 inline-flex items-center'
                                }
                                onClick={() =>
                                    handleSort(
                                        filter.column === 'default'
                                            ? 'default'
                                            : 'route_distance'
                                    )
                                }
                            >
                                Distance
                                <ChevronRightIcon
                                    className={
                                        filter.column === 'route_distance'
                                            ? sortType === 'asc'
                                                ? 'sort-asc -rotate-90 transform h-5 w-5 ml-2'
                                                : 'sort-desc rotate-90 transform h-5 w-5 ml-2'
                                            : 'h-5 w-5 ml-2'
                                    }
                                />
                            </button>
                            <button
                                type='button'
                                className={
                                    filter.column === ''
                                        ? 'text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800 inline-flex items-center'
                                        : 'text-gray-400 hover:text-gray-300 border border-gray-400 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center mr-2 mb-2 dark:border-gray-500 dark:text-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800 inline-flex items-center'
                                }
                                onClick={() => handleSort('default')}
                            >
                                Default
                            </button>
                        </div>
                    </div>
                </div>
                <div className='flex justify-center min-w-full mt-5 '>
                    {loading ? (
                        <div className='text-white'>Loading</div>
                    ) : (
                        <FlightsList
                            onDeleteFlight={handleDelete}
                            flightResults={filteredFlights || flights}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

List.propTypes = {
    session: PropTypes.object.isRequired,
};

export default List;
