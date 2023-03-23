import Dashboard from '../components/Dashboard';
import PropTypes from 'prop-types';

const List = ({ session }) => {
    return (
        <div>
            <Dashboard key={session.user.id} session={session} />
        </div>
    );
};

List.propTypes = {
    session: PropTypes.object.isRequired,
};

export default List;
