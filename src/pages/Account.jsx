import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Dashboard from '../components/Dashboard';

export default function Account({ session }) {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState(null);
    const [website, setWebsite] = useState(null);
    const [avatar_url, setAvatarUrl] = useState(null);

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
                setWebsite(data.website);
                setAvatarUrl(data.avatar_url);
            }

            setLoading(false);
        }

        getProfile();
    }, [session]);

    async function updateProfile(event) {
        event.preventDefault();

        setLoading(true);
        const { user } = session;

        const updates = {
            id: user.id,
            username,
            website,
            avatar_url,
            updated_at: new Date(),
        };

        let { error } = await supabase.from('profiles').upsert(updates);

        if (error) {
            alert(error.message);
        }
        setLoading(false);
    }

    return (
        <div className='overflow-hiddend'>
            <Dashboard key={session.user.id} session={session} />
            <div className='px-4 py-5 sm:px-6'>
                <h3 className='text-base font-semibold leading-6 text-white'>
                    Account Settings
                </h3>
                <p className='mt-1 max-w-2xl text-sm text-gray-500'>
                    Personal details.
                </p>
            </div>
            <div className='border-t border-zinc-600'>
                <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                    <form onSubmit={updateProfile} className='form-widget'>
                        <div className='overflow-hidden shadow sm:rounded-md'>
                            <div className='bg-zinc-900 px-4 py-5 sm:p-6'>
                                <div className='grid grid-cols-4 gap-6'>
                                    <div className='col-span-6 sm:col-span-3'>
                                        <label
                                            htmlFor='email'
                                            className='block text-sm font-medium leading-6 text-white'
                                        >
                                            Email:
                                        </label>
                                        <input
                                            id='email'
                                            type='text'
                                            value={session.user.email}
                                            disabled
                                            className='mt-2 block w-full rounded-md border-0 py-1.5 text-gray-500 bg-zinc-800 shadow-sm ring-1 ring-zinc-600 px-2 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6'
                                        />
                                    </div>
                                    <div className='col-span-6 sm:col-span-3'>
                                        <label
                                            htmlFor='username'
                                            className='block text-sm font-medium leading-6 text-white'
                                        >
                                            Name:
                                        </label>
                                        <input
                                            id='username'
                                            type='text'
                                            required
                                            value={username || ''}
                                            onChange={(e) =>
                                                setUsername(e.target.value)
                                            }
                                            className='mt-2 block w-full rounded-md border-0 py-1.5 px-2 text-gray-500 shadow-sm ring-1 ring-zinc-600 ring-inset bg-zinc-800 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6'
                                        />
                                    </div>
                                    <div className='col-span-6 sm:col-span-3'>
                                        <label
                                            htmlFor='website'
                                            className='block text-sm font-medium leading-6 text-white'
                                        >
                                            Website
                                        </label>
                                        <input
                                            id='website'
                                            type='website'
                                            value={website || ''}
                                            onChange={(e) =>
                                                setWebsite(e.target.value)
                                            }
                                            className='mt-2 block w-full rounded-md border-0 py-1.5 text-gray-500 px-2 shadow-sm ring-1 ring-inset bg-zinc-800 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 ring-zinc-600'
                                        />
                                    </div>

                                    <div className='col-span-6 sm:col-span-3'>
                                        <button
                                            className='inline-flex justify-center rounded-md bg-green-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'
                                            type='submit'
                                            disabled={loading}
                                        >
                                            {loading ? 'Loading ...' : 'Save'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
