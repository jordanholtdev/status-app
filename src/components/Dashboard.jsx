import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import {
    Bars3Icon,
    BellIcon,
    XMarkIcon,
    PaperAirplaneIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function Dashboard({ session }) {
    const [username, setUsername] = useState(null);
    const [website, setWebsite] = useState(null);
    const [avatar_url, setAvatarUrl] = useState(null);

    // retrieve the profile information
    // set username local state
    const user = {
        name: username,
        email: website,
        imageUrl:
            avatar_url ??
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    };
    const navigation = [
        { name: 'Add', href: '/add-flight', current: true },
        { name: 'Flights', href: '/flights', current: false },
        { name: 'Scheduled', href: '/scheduled', current: false },
    ];
    const userNavigation = [{ name: 'Your Account', href: '/' }];

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
                setUsername(data.username);
                setWebsite(data.website);
                setAvatarUrl(data.avatar_url);
            }
        }

        getProfile();
    }, [session]);

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ');
    }

    return (
        // TODO: include mobile hamburger menu & adjust username styles
        <div className='min-h-full bg-gray-900'>
            <Disclosure as='nav' className='bg-green-700'>
                {({ open }) => (
                    <>
                        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                            <div className='flex h-16 items-center justify-between'>
                                <div className='flex items-center'>
                                    <div className='flex-shrink-0'>
                                        <PaperAirplaneIcon
                                            className='h-6 w-6 stroke-current text-white'
                                            aria-hidden='true'
                                        />
                                    </div>
                                    <div className='hidden md:block'>
                                        <div className='ml-10 flex items-baseline space-x-4'>
                                            {navigation.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    className={classNames(
                                                        item.current
                                                            ? 'sm:bg-green-800 text-white'
                                                            : 'text-gray-300 hover:bg-green-600 hover:text-white',
                                                        'rounded-md px-3 py-2 text-sm font-medium'
                                                    )}
                                                    to={item.href}
                                                >
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className='hidden md:block'>
                                    <div className='ml-4 flex items-center md:ml-6'>
                                        <button
                                            type='button'
                                            className='rounded-full bg-green-600 p-1 text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-600'
                                        >
                                            <span className='sr-only'>
                                                View notifications
                                            </span>
                                            <BellIcon
                                                className='h-6 w-6'
                                                aria-hidden='true'
                                            />
                                        </button>

                                        {/* Profile dropdown */}
                                        <Menu
                                            as='div'
                                            className='relative ml-3'
                                        >
                                            <div>
                                                <Menu.Button className='flex max-w-xs items-center rounded-full bg-green-600 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-700'>
                                                    <span className='sr-only'>
                                                        Open user menu
                                                    </span>
                                                    <img
                                                        className='h-8 w-8 rounded-full'
                                                        src={user.imageUrl}
                                                        alt=''
                                                    />
                                                </Menu.Button>
                                            </div>
                                            <Transition
                                                // as={Fragment}
                                                enter='transition ease-out duration-100'
                                                enterFrom='transform opacity-0 scale-95'
                                                enterTo='transform opacity-100 scale-100'
                                                leave='transition ease-in duration-75'
                                                leaveFrom='transform opacity-100 scale-100'
                                                leaveTo='transform opacity-0 scale-95'
                                            >
                                                <Menu.Items className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                                                    {userNavigation.map(
                                                        (item) => (
                                                            <Menu.Item
                                                                key={item.name}
                                                            >
                                                                {({
                                                                    active,
                                                                }) => (
                                                                    <Link
                                                                        key={
                                                                            item.name
                                                                        }
                                                                        className={classNames(
                                                                            active
                                                                                ? 'bg-gray-100'
                                                                                : '',
                                                                            'block px-4 py-2 text-sm text-green-700'
                                                                        )}
                                                                        to={
                                                                            item.href
                                                                        }
                                                                    >
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </Link>
                                                                )}
                                                            </Menu.Item>
                                                        )
                                                    )}
                                                    <Menu.Item>
                                                        <button
                                                            type='button'
                                                            onClick={() =>
                                                                supabase.auth.signOut()
                                                            }
                                                            className={classNames(
                                                                'block px-4 py-2 text-sm text-gray-700 hover:text-red-500'
                                                            )}
                                                        >
                                                            Sign out
                                                        </button>
                                                    </Menu.Item>
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>
                                    </div>
                                </div>
                                <div className='-mr-2 flex md:hidden'>
                                    {/* Mobile menu button */}
                                    <Disclosure.Button className='inline-flex items-center justify-center rounded-md bg-green-600 p-2 text-gray-300 hover:bg-green-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-500'>
                                        <span className='sr-only'>
                                            Open main menu
                                        </span>
                                        {open ? (
                                            <XMarkIcon
                                                className='block h-6 w-6 stroke:current text-white'
                                                aria-hidden='true'
                                            />
                                        ) : (
                                            <Bars3Icon
                                                className='block h-6 w-6 stroke:current text-white'
                                                aria-hidden='true'
                                            />
                                        )}
                                    </Disclosure.Button>
                                </div>
                            </div>
                        </div>

                        <Disclosure.Panel className='md:hidden'>
                            <div className='space-y-1 px-2 pb-3 pt-2 sm:px-3'>
                                {navigation.map((item) => (
                                    <Disclosure.Button
                                        key={item.name}
                                        as='a'
                                        href={item.href}
                                        className={classNames(
                                            item.current
                                                ? 'bg-green-800 text-white'
                                                : 'text-gray-300 hover:bg-green-600 hover:text-white',
                                            'block rounded-md px-3 py-2 text-base font-medium'
                                        )}
                                        aria-current={
                                            item.current ? 'page' : undefined
                                        }
                                    >
                                        {item.name}
                                    </Disclosure.Button>
                                ))}
                            </div>
                            <div className='border-t border-green-700 pb-3 pt-4'>
                                <div className='flex items-center px-5'>
                                    <div className='flex-shrink-0'>
                                        <img
                                            className='h-10 w-10 rounded-full'
                                            src={user.imageUrl}
                                            alt=''
                                        />
                                    </div>
                                    <div className='ml-3'>
                                        <div className='text-base font-medium leading-none text-white'>
                                            {user.name}
                                        </div>
                                        <div className='text-sm font-medium leading-none text-gray-400'>
                                            {user.email}
                                        </div>
                                    </div>
                                    <button
                                        type='button'
                                        className='ml-auto flex-shrink-0 rounded-full bg-green-600 p-1 text-gray-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-200 focus:ring-offset-2 focus:ring-offset-green-600'
                                    >
                                        <span className='sr-only'>
                                            View notifications
                                        </span>
                                        <BellIcon
                                            className='h-6 w-6 stroke:current text-white'
                                            aria-hidden='true'
                                        />
                                    </button>
                                </div>
                                <div className='mt-3 space-y-1 px-2'>
                                    {userNavigation.map((item) => (
                                        <Disclosure.Button
                                            key={item.name}
                                            as='a'
                                            href={item.href}
                                            className='block rounded-md px-3 py-2 text-base font-medium text-gray-200 hover:bg-green-600 hover:text-white'
                                        >
                                            {item.name}
                                        </Disclosure.Button>
                                    ))}
                                </div>
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
        </div>
    );
}

Dashboard.propTypes = {
    session: PropTypes.object.isRequired,
};
