import { useState } from 'react';
import PropTypes from 'prop-types';

const SearchBar = (props) => {
    const [term, setTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState(Date);

    const onFormSubmit = (e) => {
        e.preventDefault();

        const flightLookupQuery = {
            term: term,
            selected_date: selectedDate,
        };

        props.onSubmit(flightLookupQuery);
        setTerm('');
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
        console.log(selectedDate);
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
                    <div className='grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-1'>
                        <div className='col-span-full'>
                            <label
                                htmlFor='flight number'
                                className='block text-base font-medium leading-6 text-zinc-400 my-1.5'
                            >
                                Flight number
                            </label>
                            <input
                                required={true}
                                type='text'
                                className='rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-400 ring-1 ring-inset ring-zinc-600 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-zinc-800'
                                placeholder='AB123'
                                value={term}
                                onChange={(e) => setTerm(e.target.value)}
                                name='flight number'
                            />
                        </div>

                        <div className='sm:col-span-4'>
                            <div className='mt-2'></div>
                            <label
                                className='block text-base font-medium leading-6 text-zinc-400 my-1.5'
                                htmlFor='date'
                            >
                                Date
                            </label>
                            <input
                                required={true}
                                type='date'
                                name='date'
                                value={selectedDate}
                                onChange={handleDateChange}
                                className='rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-400 ring-1 ring-inset ring-zinc-600 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-zinc-800'
                            />
                        </div>
                    </div>
                </div>
                <button
                    type='submit'
                    className='bg-blue-700 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium mt-4'
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

SearchBar.propTypes = {
    onSubmit: PropTypes.func.isRequired,
};

export default SearchBar;
