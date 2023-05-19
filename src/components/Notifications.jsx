import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { BellIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Notifications = () => {
    const [isNotification, setIsNotification] = useState(false);
    const [notification, setNotification] = useState({});

    useEffect(() => {
        // listen to changes in your database
        supabase
            .channel('any')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'flights' },
                (payload) => {
                    switch (payload.eventType) {
                        case 'UPDATE':
                            setIsNotification(true);
                            setNotification({
                                eventType: payload.eventType,
                                message: `Flights updated`,
                            });
                            break;
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel;
        };
    }, []);

    // clear notification
    const onClearNotification = () => {
        setNotification({});
        setIsNotification(false);
    };
    return (
        <div>
            {notification.length === 0 ? (
                <></>
            ) : (
                isNotification && (
                    <div className='flex flex-row p-4'>
                        <div className='text-slate-400 p-2'>
                            <span
                                className='relative flex h-6 w-6'
                                onClick={() =>
                                    onClearNotification(notification)
                                }
                            >
                                <BellIcon
                                    className={`h-6 w-6 animate-ping absolute inline-flex rounded-full ${
                                        notification.eventType === 'INSERT'
                                            ? 'bg-green-400'
                                            : 'bg-yellow-400'
                                    } opacity-75`}
                                    aria-hidden='true'
                                />
                            </span>
                        </div>
                        <div className='flex justify-center items-center px-2'>
                            <p className='text-gray-100 text-sm'>
                                {notification.message}
                            </p>
                            <div
                                className='px-1 mx-2'
                                onClick={() => onClearNotification()}
                            >
                                <XMarkIcon className='h-4 w-4 hover:cursor-pointer text-gray-200 hover:text-white' />
                            </div>
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

export default Notifications;
