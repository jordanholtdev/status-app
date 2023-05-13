import { Disclosure } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import {
    convertSecondsToHHMMSS,
    formatDate,
    getArrivalTime,
    getDepartureTime,
    makeTime,
} from '../controller';
import PropTypes from 'prop-types';

const FlightsList = (props) => {
    const handleDelete = (flight) => {
        props.onDeleteFlight(flight);
    };

    // function that returns the flight status color
    const flightStatusColor = (flight) => {
        if (flight.status === 'Scheduled') {
            return 'bg-blue-400';
        } else if (flight.status === 'En Route') {
            return 'bg-yellow-400';
        } else if (
            flight.status === 'Arrived' ||
            flight.status === 'Arrived / Gate Arrival'
        ) {
            return 'bg-green-400';
        } else if (flight.status === 'Cancelled') {
            return 'bg-red-400';
        } else {
            return 'bg-gray-400';
        }
    };

    return (
        <div className='container w-3/4 lg:w-1/2'>
            {props.flightResults.map((flight, idx) => (
                <div key={idx}>
                    <div
                        className={`flex py-3 px-3 rounded-md text-sm hover:bg-zinc-800/70 my-4 bg-zinc-800 ring-offset-2`}
                    >
                        <div className='w-full'>
                            <Disclosure>
                                {({ open }) => (
                                    <>
                                        <Disclosure.Button className={`w-full`}>
                                            <div className='flex-1 divide-y divide-gray-100'>
                                                <div className='px-2 py-2 sm:grid grid grid-cols-2 sm:grid-cols-4 sm:gap-6'>
                                                    <div className='container'>
                                                        <div className='text-slate-300 text-lg tracking-wide leading-none font-semibold pt-1 text-left'>
                                                            <span>Flight:</span>{' '}
                                                            {flight.ident}
                                                        </div>
                                                        <div className='flex space-x-2 space-y-2 mt-1'>
                                                            <div>
                                                                <div className='flex'>
                                                                    <p
                                                                        className={`text-gray-400 text-md decoration-4`}
                                                                    >
                                                                        Status:
                                                                    </p>
                                                                    {'  '}
                                                                    <p
                                                                        className={`text-slate-400 text-sm opacity-80 font-medium px-1`}
                                                                    >
                                                                        {
                                                                            flight.status
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <div className='flex'>
                                                                    <p
                                                                        className={`text-gray-400 text-md decoration-4`}
                                                                    >
                                                                        Progress:
                                                                    </p>
                                                                    {'  '}
                                                                    <p
                                                                        className={`text-slate-400 text-sm opacity-80 font-medium px-1`}
                                                                    >
                                                                        {
                                                                            flight.progress_percent
                                                                        }
                                                                        %
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <span className='relative flex h-2 w-2'>
                                                                <span
                                                                    className={`${flightStatusColor(
                                                                        flight
                                                                    )} animate-ping absolute inline-flex h-full w-full rounded-full opacity-75
                                                                    `}
                                                                ></span>
                                                                <span
                                                                    className={`${flightStatusColor(
                                                                        flight
                                                                    )} relative inline-flex rounded-full h-2 w-2`}
                                                                ></span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className='flex-1 h-full text-left'>
                                                        <div className='text-green-400/80 text-md font-medium'>
                                                            {formatDate(
                                                                flight.scheduled_off
                                                            )}
                                                        </div>
                                                        <div className='text-slate-400/80 text-sm font-medium mt-1'>
                                                            Departure time:{' '}
                                                            {makeTime(
                                                                getDepartureTime(
                                                                    flight
                                                                ).time
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className='flex-2 h-full'>
                                                        <div className='text-base text-gray-500 text-left'>
                                                            <div className='text-slate-500 flex-1 text-sm'>
                                                                Depart:{' '}
                                                                <span className='text-slate-400'>
                                                                    {
                                                                        flight.origin_name
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className='text-slate-500 flex-1 text-sm'>
                                                                Arrive:{' '}
                                                                <span className='text-slate-400'>
                                                                    {
                                                                        flight.destination_name
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='flex justify-center items-center'>
                                                        <ChevronRightIcon
                                                            className={
                                                                open
                                                                    ? 'rotate-90 transform w-6 h-6 text-green-400 rounded-full bg-zinc-800'
                                                                    : 'w-6 h-6 text-zinc-500 hover:text-zinc-400'
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </Disclosure.Button>

                                        <Disclosure.Panel className='text-gray-500'>
                                            <div className='grid grid-rows-1 sm:grid sm:grid-cols-2 grid-cols-2 lg:grid-cols-4 grid-flow-row-dense text-zinc-400/80 px-2 py-2 gap-2 sm:gap-6'>
                                                <div className='flex-1 col-span-1'>
                                                    <div className='text-slate-400/80 text-sm font-medium'>
                                                        From:{' '}
                                                        {
                                                            flight.origin_code_iata
                                                        }
                                                    </div>
                                                    <div className='text-slate-400/80 text-sm font-medium'>
                                                        {/* actual_off == null (not departed yet) */}
                                                        Dest:{' '}
                                                        {
                                                            flight.destination_code_iata
                                                        }
                                                    </div>
                                                    <div className='text-slate-400/80 text-sm font-medium'>
                                                        Aircraft:{' '}
                                                        {flight.aircraft_type}
                                                    </div>
                                                    <div className='text-slate-400/80 text-sm font-medium'>
                                                        Distance (mi):{' '}
                                                        {flight.route_distance}
                                                    </div>
                                                </div>
                                                <div className='row-span-1 col-span-1 flex space-x-2 space-y-2'>
                                                    <div className='text-slate-500'>
                                                        <div className='text-slate-500 text-sm'>
                                                            Origin:{' '}
                                                            <span className='text-green-500'>
                                                                {
                                                                    flight.origin_name
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className='text-slate-500 text-sm'>
                                                            Destination Airport:{' '}
                                                            <span className='text-green-500'>
                                                                {
                                                                    flight.destination_name
                                                                }
                                                            </span>
                                                        </div>
                                                        Destination City:{' '}
                                                        <span className='text-green-500'>
                                                            {
                                                                flight.destination_city
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='row-span-1 col-span-1 text-sm flex space-x-2 space-y-2'>
                                                    <div className='text-slate-500 text-sm'>
                                                        <div className='text-slate-500 text-sm'>
                                                            Depart:{' '}
                                                            <span className='text-green-500'>
                                                                {makeTime(
                                                                    getDepartureTime(
                                                                        flight
                                                                    ).time
                                                                )}
                                                            </span>
                                                        </div>
                                                        Arrival:{' '}
                                                        <span className='text-green-500'>
                                                            {makeTime(
                                                                getArrivalTime(
                                                                    flight
                                                                ).time
                                                            )}
                                                        </span>
                                                        <div className='text-slate-500 text-sm'>
                                                            Runway-to-runway:{' '}
                                                            <span className='text-green-500'>
                                                                {convertSecondsToHHMMSS(
                                                                    flight.filed_ete
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-span-1'>
                                                    <div className='flex'>
                                                        <p className='text-red-500'>{`Delete flight:`}</p>
                                                        <a
                                                            onClick={() =>
                                                                handleDelete(
                                                                    flight
                                                                )
                                                            }
                                                            type='button'
                                                            className='px-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                                                        >
                                                            <svg
                                                                xmlns='http://www.w3.org/2000/svg'
                                                                fill='none'
                                                                viewBox='0 0 24 24'
                                                                strokeWidth='1.5'
                                                                stroke='currentColor'
                                                                className='w-6 h-6 fill-slate-700 hover:fill-slate-500 hover:cursor-pointer'
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
                                        </Disclosure.Panel>
                                    </>
                                )}
                            </Disclosure>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

FlightsList.propTypes = {
    onDeleteFlight: PropTypes.func.isRequired,
    flightResults: PropTypes.array.isRequired,
};

export default FlightsList;
