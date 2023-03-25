import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Dashboard from '../components/Dashboard';
import FlightsList from '../components/FlightsList';
import PropTypes from 'prop-types';

const List = ({ session }) => {
    const [loading, setLoading] = useState();
    const [flights, setFlights] = useState([]);
    const [notification, setNotification] = useState([]);

    // fetch the saved flights from db
    // fetch only flights belonging to user
    useEffect(() => {
        async function getSavedFlights() {
            setLoading(true);
            const { user } = session;

            let { data, error } = await supabase
                .from('testing')
                .select(`name, info, id`)
                .eq('user_id', user.id);

            if (error) {
                console.warn(error);
            } else if (data) {
                setFlights(data);
            }

            setLoading(false);
        }

        getSavedFlights();
    }, [session]);

    useEffect(() => {
        supabase
            .channel('any')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'testing' },
                (payload) => {
                    console.log(
                        'Change received - Realtime!',
                        payload,
                        flights
                    );
                    switch (payload.eventType) {
                        case 'INSERT':
                            // console.log('insert realtime:');
                            setNotification(payload.new);
                            break;
                        case 'DELETE': {
                            // console.log('delete realtime:', payload.old);
                            setNotification(payload.old);
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

    // allow user to delete item from list

    const handleDelete = async (flight) => {
        const { error } = await supabase
            .from('testing')
            .delete()
            .eq('id', flight.id);

        if (error) {
            console.warn(error);
        }
        setFlights(flights.filter((item) => item.id !== flight.id));
    };

    return (
        <div>
            <Dashboard key={session.user.id} session={session} />
            <div className='px-4 py-5 sm:px-6 max-w-md'>
                <h3 className='text-base font-semibold leading-6 text-white'>
                    Add flight
                </h3>
                <p className='mt-1 max-w-2xl text-sm text-gray-500'>
                    Select a flight to track.{notification.id}
                </p>
                {notification.length === 0 ? (
                    <div>nothing</div>
                ) : (
                    <span className='relative flex h-3 w-3'>
                        <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75'></span>
                        <span className='relative inline-flex rounded-full h-3 w-3 bg-sky-500'></span>
                    </span>
                )}
            </div>
            <div className='border-t border-zinc-600'>
                <div className='flex justify-center min-w-full mt-10 '>
                    {loading ? (
                        <div className='text-white'>Loading</div>
                    ) : (
                        <FlightsList
                            onDeleteFlight={handleDelete}
                            flightResults={flights}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

List.propTypes = {
    session: PropTypes.object.isRequired,
};

export default List;
