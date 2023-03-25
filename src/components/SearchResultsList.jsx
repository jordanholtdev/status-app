const SearchResultsList = (props) => {
    const onResultClick = (flight) => {
        props.onClick(flight);
    };

    return props.results.slice(0, 5).map((flight, idx) => (
        <li
            key={idx}
            onClick={() => {
                onResultClick(flight);
            }}
            className={`flex items-center justify-between py-3 pl-3 pr-4 text-sm`}
        >
            <div className={'flex w-0 flex-1 items-center'}>
                <div className='flex-1 border-zinc-400 hover:border-gray-600 text-md text-gray-300'>
                    {/* Flight number */}
                    {flight.word}
                </div>
                <div className='flex-1 text-sm text-gray-400'>
                    {/* Flight origin airport */}
                    {flight.score}
                </div>
                <div className='flex-1 text-sm font-medium text-gray-500'>
                    {/* Flight Scheduled off - date / time */}
                    2023-03-04
                </div>
                <div className='flex-1 text-sm font-medium text-blue-500'>
                    {/* Flight status */}
                    Some status
                </div>
            </div>
        </li>
    ));
};

export default SearchResultsList;
