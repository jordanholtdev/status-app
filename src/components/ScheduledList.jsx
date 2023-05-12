import PropTypes from 'prop-types';
import { formatDate, subtractTwoDays } from '../controller';

const ScheduledList = (props) => {
    const onDeleteClick = (flight) => {
        props.onDeleteFlight(flight);
    };

    return (
        <div className='divide-y divide-dashed divide-zinc-700 w-full sm:w-1/2 px-2'>
            {props.scheduledFlights.map((flight, idx) => (
                <div key={idx}>
                    <div className='grid grid-rows-2'>
                        <div className='flex pt-3 pl-3 pr-4 text-sm hover:bg-zinc-800/70'>
                            <div
                                className={
                                    'flex w-0 flex-1 items-center justify-center'
                                }
                            >
                                <div className='flex-none h-full w-10'>
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        viewBox='0 0 24 24'
                                        fill='currentColor'
                                        className='w-6 h-6 fill-zinc-400 hover:fill-zinc-200 hover:cursor-pointer'
                                    >
                                        <path
                                            fillRule='evenodd'
                                            d='M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-4.131A15.838 15.838 0 016.382 15H2.25a.75.75 0 01-.75-.75 6.75 6.75 0 017.815-6.666zM15 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z'
                                            clipRule='evenodd'
                                        />
                                        <path d='M5.26 17.242a.75.75 0 10-.897-1.203 5.243 5.243 0 00-2.05 5.022.75.75 0 00.625.627 5.243 5.243 0 005.022-2.051.75.75 0 10-1.202-.897 3.744 3.744 0 01-3.008 1.51c0-1.23.592-2.323 1.51-3.008z' />
                                    </svg>
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
                                            className='w-6 h-6 fill-slate-600'
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
