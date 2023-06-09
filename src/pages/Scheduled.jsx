import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import PageHeader from '../components/PageHeader';
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
            <PageHeader title='Scheduled' subtitle='Scheduled searches' />
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
