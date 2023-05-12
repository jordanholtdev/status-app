import { Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import Dashboard from '../components/Dashboard';
import { useEffect } from 'react';

const Layout = ({ session }) => {
    useEffect(() => {
        async function getScheduledFlights() {
            const { user } = session;

            console.log(user);
        }

        getScheduledFlights();
    }, [session]);
    return (
        <>
            <Dashboard key={session.user.id} session={session} />
            <Outlet />
        </>
    );
};

Layout.propTypes = {
    session: PropTypes.object.isRequired,
};

export default Layout;
