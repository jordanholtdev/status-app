import { useState } from 'react';

const SearchBar = (props) => {
    const [term, setTerm] = useState('flight number');

    const onFormSubmit = (e) => {
        e.preventDefault();
        props.onSubmit(term);
    };

    return (
        <div className='mt-5 md:col-span-2 md:mt-0'>
            <form
                className='ui form'
                onSubmit={onFormSubmit}
                id='search'
                role='search'
            >
                <div className='field'>
                    <label className='block text-sm font-medium leading-6 text-gray-400'>
                        Enter Flight Number:
                        <input
                            type='text'
                            className='block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-400 ring-1 ring-inset ring-gray-300 placeholder:text-gray-100 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-gray-800'
                            placeholder='Enter flight number'
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                        />
                    </label>
                </div>
            </form>
        </div>
    );
};

export default SearchBar;
