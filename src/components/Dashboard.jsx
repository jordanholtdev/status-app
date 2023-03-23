import { useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function Dashboard({ session }) {
    // const [username, setUsername] = useState(null);

    // retrieve the profile information
    // set username local state
    useEffect(() => {
        async function getProfile() {
            const { user } = session;

            let { data, error } = await supabase
                .from('profiles')
                .select(`username, website, avatar_url`)
                .eq('id', user.id)
                .single();

            if (error) {
                console.warn(error);
            } else if (data) {
                // setUsername(data.username);
            }
        }

        getProfile();
    }, [session]);

    return (
        // TODO: include mobile hamburger menu & adjust username styles
        <div className='min-h-full bg-gray-900'>
            <nav className='bg-zinc-800'>
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
                                    <Link
                                        to='/'
                                        className='text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium'
                                    >
                                        Account
                                    </Link>
                                    <Link
                                        to='/add-flight'
                                        className='text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium'
                                    >
                                        Add
                                    </Link>
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
        </div>
    );
}

Dashboard.propTypes = {
    session: PropTypes.object.isRequired,
};
