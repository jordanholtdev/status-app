import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import SearchBar from './SearchBar';
import { useGetFlights } from '../hooks/useGetFilghts';

export default function Dashboard({ session }) {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState(null);
    const { isLoading, flightList, getFlights } = useGetFlights();

    useEffect(() => {
        async function getProfile() {
            setLoading(true);
            const { user } = session;

            let { data, error } = await supabase
                .from('profiles')
                .select(`username, website, avatar_url`)
                .eq('id', user.id)
                .single();

            if (error) {
                console.warn(error);
            } else if (data) {
                setUsername(data.username);
            }

            setLoading(false);
        }

        getProfile();
    }, [session]);

    const onSearchSubmit = async (term) => {
        getFlights(term);
    };

    const handleFlightClick = (flight) => {
        console.log('entered user choice into database:', flight);
        // enter flight into database
    };

    return (
        <div className='min-h-full bg-gray-900'>
            <nav className='bg-gray-700'>
                <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                    <div className='flex h-16 items-center justify-between'>
                        <div className='flex items-center'>
                            <div>
                                <div className='ml-1 flex items-baseline space-x-6'>
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        strokeWidth='1.5'
                                        stroke='currentColor'
                                        className='w-6 h-6'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            d='M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5'
                                        />
                                    </svg>
                                    <button
                                        type='button'
                                        className='text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium'
                                    >
                                        Account
                                    </button>
                                    <button
                                        type='button'
                                        onClick={() => supabase.auth.signOut()}
                                        className='text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium'
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <header className='shadow bg-gray-900'>
                <div className='mx-auto max-w-7xl py-6 px-6 sm:px-6 lg:px-8'>
                    <h1 className='text-3xl font-bold tracking-tight text-slate-50'>
                        Dashboard
                    </h1>
                </div>
            </header>
            <main className='min-h-screen px-6'>
                <div className='mx-auto max-w-7xl py-6 sm:px-6 lg:px-8'>
                    <SearchBar onSubmit={onSearchSubmit} />
                    {isLoading ? (
                        <div>Loading...</div>
                    ) : (
                        <ul>
                            {flightList.map((flight, idx) => (
                                <li
                                    key={idx}
                                    onClick={() =>
                                        handleFlightClick(flight.word)
                                    }
                                    className='text-gray-400'
                                >
                                    <p>{flight.word}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>
        </div>
    );
}
