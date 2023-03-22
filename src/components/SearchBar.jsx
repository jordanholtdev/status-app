import { useState } from 'react';

const SearchBar = (props) => {
    const [term, setTerm] = useState('');

    const onFormSubmit = (e) => {
        e.preventDefault();
        props.onSubmit(term);
        setTerm('');
    };

    return (
        <div>
            <form
                className='ui form'
                onSubmit={onFormSubmit}
                id='search'
                role='search'
            >
                <div className='field'>
                    <label className='block text-sm font-medium leading-6'>
                        <input
                            type='text'
                            className='rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-400 ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-zinc-800'
                            placeholder='AB123'
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
