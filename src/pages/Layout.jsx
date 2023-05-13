import { Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import Dashboard from '../components/Dashboard';

const Layout = ({ session }) => {
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
