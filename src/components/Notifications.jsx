import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const Notifications = () => {
    const [isNotification, setIsNotification] = useState(false);
    const [notification, setNotification] = useState({});

    useEffect(() => {
        supabase
            .channel('any')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'flights' },
                (payload) => {
                    switch (payload.eventType) {
                        case 'INSERT':
                            setIsNotification(true);
                            setNotification({
                                eventType: payload.eventType,
                                message: `${payload.new.name} sucessfully added.`,
                            });
                            break;
                        case 'UPDATE':
                            setIsNotification(true);
                            setNotification({
                                eventType: payload.eventType,
                                message: `Your flight information has been updated.`,
                            });
                            break;
                        case 'DELETE': {
                            setIsNotification(true);
                            setNotification({
                                eventType: payload.eventType,
                                message: `Item permanently removed.`,
                            });
                            break;
                        }
                        default:
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
                                <span
                                    className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                                        notification.eventType === 'INSERT'
                                            ? 'bg-green-400'
                                            : 'bg-yellow-400'
                                    } opacity-75`}
                                ></span>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    strokeWidth='1.5'
                                    stroke={`${
                                        notification.eventType === 'INSERT'
                                            ? 'green'
                                            : 'yellow'
                                    }`}
                                    className='w-6 h-6 animate-pulse'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        d='M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5'
                                    />
                                </svg>
                            </span>
                        </div>
                        <div className='flex justify-center items-center px-2'>
                            <p className='text-slate-600'>
                                {notification.message}
                            </p>
                            <div
                                className='px-2 mx-2'
                                onClick={() => onClearNotification()}
                            >
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    viewBox='0 0 24 24'
                                    fill='currentColor'
                                    className='w-5 h-5 fill-gray-300/70 hover:fill-yellow-300 hover:first-letter:first-line:cursor-pointer'
                                >
                                    <path
                                        fillRule='evenodd'
                                        d='M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z'
                                        clipRule='evenodd'
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

export default Notifications;
