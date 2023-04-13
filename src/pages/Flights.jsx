import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Dashboard from '../components/Dashboard';
import FlightsList from '../components/FlightsList';
import Notifications from '../components/Notifications';
import PropTypes from 'prop-types';
import Footer from '../components/Footer';

const List = ({ session }) => {
    const [loading, setLoading] = useState();
    const [flights, setFlights] = useState([]);

    // fetch the saved flights from db
    // fetch only flights belonging to user
    useEffect(() => {
        async function getSavedFlights() {
            setLoading(true);
            const { user } = session;

            let { data, error } = await supabase
                .from('flights')
                .select(`*`)
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

    // allow user to delete item from list

    const handleDelete = async (flight) => {
        const { error } = await supabase
            .from('flights')
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
            <Notifications />
            <div className='px-4 py-5 sm:px-6 max-w-md'>
                <h3 className='text-base font-semibold leading-6 text-white'>
                    Flights
                </h3>
                <p className='mt-1 max-w-2xl text-sm text-gray-500'>
                    Your flights.
                </p>
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
            <Footer />
        </div>
    );
};

List.propTypes = {
    session: PropTypes.object.isRequired,
};

export default List;
