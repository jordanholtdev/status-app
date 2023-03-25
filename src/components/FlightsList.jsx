import PropTypes from 'prop-types';

const FlightsList = (props) => {
    const onDeleteClick = (flight) => {
        props.onDeleteFlight(flight);
    };

    return (
        <div>
            <div className='sm:columns-1 w-60'>
                {props.flightResults.map((flight, idx) => (
                    <div
                        key={idx}
                        className='container mx-auto overflow-hidden bg-zinc-800 shadow rounded-lg py-1 mt-4 w-full ring-1 ring-gray-700'
                    >
                        <div>
                            <p className='mt-1 max-w-2xl text-sm text-gray-400'>
                                {flight.name}
                            </p>
                            <p onClick={() => onDeleteClick(flight)}>
                                Delete me
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

FlightsList.propTypes = {
    onDeleteFlight: PropTypes.func.isRequired,
    flightResults: PropTypes.array.isRequired,
};

export default FlightsList;
