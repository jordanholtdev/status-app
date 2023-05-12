import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Dashboard from '../components/Dashboard';
import Notifications from '../components/Notifications';
import ScheduledList from '../components/ScheduledList';
import PropTypes from 'prop-types';

const Scheduled = ({ session }) => {
    const [loading, setLoading] = useState();
    const [scheduledFlights, setScheduledFlights] = useState([]);

    // fetch the saved flights from db
    // fetch only flights belonging to user
    useEffect(() => {
        async function getScheduledFlights() {
            setLoading(true);
            const { user } = session;

            let { data, error } = await supabase
                .from('schedule_lookup')
                .select(`*`)
                .eq('user_id', user.id)
                .eq('lookup_complete', false);

            if (error) {
                console.warn(error);
            } else if (data) {
                setScheduledFlights(data);
            }

            setLoading(false);
        }

        getScheduledFlights();
    }, [session]);

    // allow user to delete item from list

    const handleDelete = async (flight) => {
        const confirm = window.confirm(
            `Are you sure you want to delete ${flight.ident}?`
        );
        if (confirm) {
            const { error } = await supabase
                .from('schedule_lookup')
                .delete()
                .eq('id', flight.id);

            if (error) {
                console.warn(error);
            }
            setScheduledFlights(
                scheduledFlights.filter((item) => item.id !== flight.id)
            );
        }
    };

    return (
        <div>
            <Dashboard key={session.user.id} session={session} />
            <Notifications />
            <div className='px-4 py-5 sm:px-6 max-w-md'>
                <h3 className='text-base font-semibold leading-6 text-white'>
                    Scheduled
                </h3>
                <p className='mt-1 max-w-2xl text-sm text-gray-500'>
                    These are searches that are scheduled.
                </p>
            </div>
            <div className='border-t border-zinc-600'>
                <div className='flex justify-center min-w-full mt-10 '>
                    {loading ? (
                        <div className='text-white'>Loading</div>
                    ) : (
                        <ScheduledList
                            onDeleteFlight={handleDelete}
                            scheduledFlights={scheduledFlights}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

Scheduled.propTypes = {
    session: PropTypes.object.isRequired,
};

export default Scheduled;
