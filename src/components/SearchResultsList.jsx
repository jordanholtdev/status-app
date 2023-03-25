const SearchResultsList = (props) => {
    const onResultClick = (flight) => {
        props.onClick(flight);
    };

    const renderDate = (date) => {
        const options = {
            weekday: 'short',
            // year: 'numeric',
            month: 'short',
            day: 'numeric',
            timeZone: 'UTC',
            hour: 'numeric',
            minute: 'numeric',
        };
        const formatDate = new Date(date);
        return formatDate.toLocaleString('en-US', options);
    };

    return props.results.slice(0, 5).map((flight, idx) => (
        <li
            key={idx}
            onClick={() => {
                onResultClick(flight);
            }}
            className={`flex items-center justify-between py-3 pl-3 pr-4 text-sm hover:bg-zinc-800/70`}
        >
            <div className={'flex w-0 flex-1 items-center'}>
                <div className='flex-none w-12'>✈</div>
                <div className='flex-1'>
                    <div className='container'>
                        <div className='border-zinc-300 text-slate-300 text-lg font-semibold tracking-wide'>
                            {/* Flight number */}
                            {flight.word}
                        </div>
                        <div className='text-base text-gray-500'>
                            {/* Flight origin airport */}
                            {flight.score}
                        </div>
                    </div>
                </div>
                <div className='flex-1 basis-1/3'>
                    <div className='container'>
                        <div className='text-green-500/80 text-lg font-medium'>
                            {/* Flight Scheduled off - date / time */}
                            {renderDate('2021-12-31T19:59:59Z')}
                        </div>
                        <div className='flex'>
                            <div className='text-slate-500 flex-1'>
                                {/* Flight status */}
                                Origin:{' '}
                                <span className='text-sm font-semibold text-slate-300'>
                                    YYZ
                                </span>
                            </div>
                            <div className='text-slate-500 flex-1'>
                                {/* Flight status */}
                                Dest:{' '}
                                <span className='text-sm font-semibold text-slate-300'>
                                    JFK
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    ));
};

export default SearchResultsList;
