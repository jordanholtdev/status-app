import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import PropTypes from 'prop-types';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import AppDialog from './Dialog';

const SearchBar = (props) => {
    const [term, setTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState(Date);
    const [error, setError] = useState({
        error: false,
        message: '',
        title: '',
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        const currentDate = new Date();
        const formattedDate = formatDate(currentDate);
        setSelectedDate(formattedDate);
    }, []);

    const formatDate = (date) => {
        const formattedDate = date.toISOString().split('T')[0];
        return formattedDate;
    };

    const onFormSubmit = (e) => {
        e.preventDefault();
        console.log('onFormSubmit', term, selectedDate);
        let sanitizedTerm;
        let sanitizedDate;
        try {
            sanitizedTerm = DOMPurify.sanitize(term);
            sanitizedDate = DOMPurify.sanitize(selectedDate);
        } catch (err) {
            setError({
                error: true,
                title: 'Input Error',
                body: 'Failed to sanitize term. Please try again.',
            });
            console.error('Failed to sanitize term:', err);
            setIsDialogOpen(true);
            // handle the error here, e.g. show an error message to the user
            return;
        }

        // strip out any whitespace in the sanitized term
        sanitizedTerm = sanitizedTerm.replace(/\s/g, '');

        if (!sanitizedTerm) {
            setIsDialogOpen(true);
            setError({
                error: true,
                title: 'Input Error',
                body: 'The submitted search term cannot be used. Please try again using a different search term.',
            });
            console.error('No search term available');
            return;
        }
        console.log('onFormSubmit', sanitizedTerm, sanitizedDate);
        const flightLookupQuery = {
            ident: sanitizedTerm,
            selected_date: sanitizedDate,
        };

        props.onSubmit(flightLookupQuery);
        setTerm('');
        setIsDialogOpen(false);
        setError(false);
    };

    const handleDateChange = (e) => {
        // format the date to YYYY-MM-DD for the API
        const date = new Date(e.target.value);
        const formattedDate = formatDate(date);

        setSelectedDate(formattedDate);
    };

    // handle dialog close event here
    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    return (
        <div>
            <form
                className='ui form'
                onSubmit={onFormSubmit}
                id='search'
                role='search'
            >
                <div className='border-b border-gray-900/10 pb-6'>
                    <AppDialog
                        open={isDialogOpen}
                        onClose={handleDialogClose}
                        message={error || {}}
                    />
                    <div className='grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-1'>
                        <div className='flex flex-col pt-6'>
                            <div className='flex flex-col items-center'>
                                <div className='relative lg:w-1/2 w-8/12'>
                                    <label
                                        htmlFor='flight number'
                                        className='mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white'
                                    >
                                        Flight number
                                    </label>
                                    <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                                        <MagnifyingGlassIcon className='h-4 w-4 text-white' />
                                    </div>
                                    <input
                                        required={true}
                                        type='text'
                                        className='focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 block w-full p-4 pl-10 text-sm text-gray-900 border rounded-lg dark:bg-zinc-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 autofill:bg-yellow-200'
                                        placeholder='Search for flight number or ident'
                                        value={term}
                                        onChange={(e) =>
                                            setTerm(e.target.value)
                                        }
                                        name='flight number'
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col pt-4'>
                            <div className='flex flex-col items-center'>
                                <div className='relative lg:w-1/2 w-8/12'>
                                    <label
                                        className='mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white'
                                        htmlFor='date'
                                    >
                                        Date
                                    </label>
                                    {/* <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                                        <CalendarDaysIcon className='h-4 w-4 text-white' />
                                    </div> */}
                                    <input
                                        required={true}
                                        type='date'
                                        name='date'
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        onFocus={(e) =>
                                            (e.currentTarget.type = 'date')
                                        }
                                        onBlur={(e) =>
                                            (e.currentTarget.type = 'text')
                                        }
                                        className='block w-full p-4 pl-10 text-sm text-gray-900 border rounded-lg bg-zinc-700 border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 focus:outline-none focus:border-sky-500'
                                    />
                                </div>
                                <div className='lg:w-1/2 w-8/12 pt-4'>
                                    <button
                                        type='submit'
                                        className='bg-blue-700 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium mt-4 focus:bg-slate-600'
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

SearchBar.propTypes = {
    onSubmit: PropTypes.func.isRequired,
};

export default SearchBar;
