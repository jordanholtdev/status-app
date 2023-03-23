import Dashboard from '../components/Dashboard';

const List = ({ session }) => {
    return (
        <div>
            <Dashboard key={session.user.id} session={session} />
        </div>
    );
};

export default List;
