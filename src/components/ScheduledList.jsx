import PropTypes from 'prop-types';
import { formatDate, subtractTwoDays } from '../controller';
import { ClockIcon } from '@heroicons/react/24/outline';

const ScheduledList = (props) => {
    const onDeleteClick = (flight) => {
        props.onDeleteFlight(flight);
    };

    return (
        <div className='w-full sm:w-1/2 px-2'>
            {props.scheduledFlights.map((flight, idx) => (
                <div key={idx}>
                    <div className='grid grid-rows-1 py-2'>
                        <div className='flex pl-3 pr-4 text-sm hover:bg-zinc-700/70 py-2 rounded-md bg-zinc-800/70 '>
                            <div
                                className={
                                    'flex w-0 flex-1 items-center justify-center'
                                }
                            >
                                <div className='flex h-full pr-2'>
                                    <ClockIcon className='h-6 w-6 text-zinc-400 ' />
                                </div>
                                <div className='flex-1 h-full'>
                                    <div className='container'>
                                        <div className='text-slate-300 text-lg leading-none font-semibold tracking-wide'>
                                            Flight: {flight.ident}
                                        </div>

                                        <div className='flex space-x-2 space-y-2 mt-1'>
                                            <div className='text-slate-500 text-sm'>
                                                Flight date:{' '}
                                                {flight.flight_date}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex-1 h-full'>
                                    <div className='text-green-400/80 text-md font-medium'>
                                        Search submitted:{' '}
                                        {formatDate(flight.created_at)}
                                    </div>
                                    <div className='text-base text-gray-500 mt-1'>
                                        <div className='text-slate-500 flex-1 text-sm'>
                                            Search Scheduled for:{' '}
                                            {subtractTwoDays(
                                                flight.flight_date
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className='flex-none'>
                                    <a
                                        onClick={() => onDeleteClick(flight)}
                                        type='button'
                                        className='px-2 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                    >
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            strokeWidth='1.5'
                                            stroke='currentColor'
                                            className='w-6 h-6 fill-slate-600 hover:cursor-pointer hover:fill-slate-500'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
                                            />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

ScheduledList.propTypes = {
    onDeleteFlight: PropTypes.func.isRequired,
    scheduledFlights: PropTypes.array.isRequired,
};

export default ScheduledList;
