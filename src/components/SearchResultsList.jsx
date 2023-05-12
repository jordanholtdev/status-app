import { RadioGroup } from '@headlessui/react';
import { formatDate } from '../controller';
import { CheckIcon, PaperAirplaneIcon } from '@heroicons/react/20/solid';
import PropTypes from 'prop-types';

const SearchResultsList = (props) => {
    SearchResultsList.propTypes = {
        results: PropTypes.array.isRequired,
        onSelectResult: PropTypes.func.isRequired,
    };

    const onResultClick = (flight) => {
        props.onSelectResult(flight);
    };

    return (
        <RadioGroup value={props.results}>
            <RadioGroup.Label>Plan</RadioGroup.Label>
            {props.results.slice(0, 5).map((flight, idx) => (
                <RadioGroup.Option
                    key={props.results.indexOf(flight)}
                    value={props.results}
                    className='rounded-md ui-active:bg-zinc-800/70 ui-active:text-white ui-not-active:bg-zinc-800 ui-not-active:text-black'
                >
                    <li
                        key={idx}
                        onClick={() => {
                            onResultClick(flight);
                        }}
                        className={`flex items-center justify-between rounded-md my-2 py-3 pl-3 pr-4 text-sm ui-active:ring-2 ui-active:ring-white ui-active:ring-opacity-60 ui-active:ring-offset-sky-300`}
                    >
                        <div className={'flex w-0 flex-1 items-center'}>
                            <div className='flex-none w-12'>
                                <PaperAirplaneIcon className='h-6 w-6 ui-active:text-green-400' />
                            </div>
                            <div className='flex-1'>
                                <div className='container'>
                                    <div className='border-zinc-300 text-slate-300 text-lg font-semibold tracking-wide'>
                                        {/* Flight number */}
                                        {flight.ident}
                                    </div>
                                    <div className='text-base text-gray-500'>
                                        {/* Flight origin airport */}
                                        To {flight.destination.city}
                                    </div>
                                </div>
                            </div>
                            <div className='flex-1 basis-1/3'>
                                <div className='container'>
                                    <div className='text-green-500/80 text-lg font-medium'>
                                        {/* Flight Scheduled off - date / time */}
                                        {formatDate(flight.scheduled_off)}
                                    </div>
                                    <div className='flex'>
                                        <div className='text-slate-500 flex-1'>
                                            {/* Flight status */}
                                            Origin:{' '}
                                            <span className='text-sm font-semibold text-slate-300'>
                                                {flight.origin.name}
                                            </span>
                                        </div>
                                        <div className='text-slate-500 flex-1'>
                                            {/* Flight status */}
                                            Dest:{' '}
                                            <span className='text-sm font-semibold text-slate-300'>
                                                {flight.destination.name}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <CheckIcon className='hidden ui-active:block h-6 w-6 shrink-0 text-green-500' />
                            </div>
                        </div>
                    </li>
                </RadioGroup.Option>
            ))}
        </RadioGroup>
    );
};

export default SearchResultsList;
