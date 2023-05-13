import { useState } from 'react';
import { ArrowDownIcon } from '@heroicons/react/24/outline';
import DOMPurify from 'dompurify';
import PropTypes from 'prop-types';

const ExportButton = ({ flights }) => {
    const [loading, setLoading] = useState(false);

    function sanitizeFlightsData(data) {
        if (!data) return null;
        const sanitizedData = Array.isArray(data) ? [...data] : { ...data };
        const keys = Object.keys(sanitizedData);

        keys.forEach((key) => {
            if (typeof sanitizedData[key] === 'string') {
                sanitizedData[key] = DOMPurify.sanitize(sanitizedData[key]);
            } else if (typeof sanitizedData[key] === 'object') {
                sanitizedData[key] = sanitizeFlightsData(sanitizedData[key]);
            }
        });

        return sanitizedData;
    }

    const convertToJSON = (data) => {
        return JSON.stringify(data);
    };

    const handleExport = () => {
        setLoading(true);

        if (flights.length === 0) {
            console.error('No flights to export');
            return;
        }

        try {
            const sanitizedFlights = sanitizeFlightsData(flights);
            const jsonData = convertToJSON(sanitizedFlights);

            const blob = new Blob([jsonData], {
                type: 'application/json',
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const timestamp = new Date()
                .toLocaleString()
                .replace(/[/:;\s*,]/g, '-'); // Replace colons and slashes with dashes
            link.download = `flight-list-${timestamp}.json`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error exporting flight list:', err);
        }

        setLoading(false);
    };

    return (
        // only show button if there are flights to export
        flights.length > 0 && (
            <button
                disabled={loading}
                onClick={handleExport}
                className='text-slate-700 hover:text-white border border-slate-700 hover:bg-slate-800 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center mr-2 mb-2 dark:border-slate-500 dark:text-slate-500 dark:hover:text-white dark:hover:bg-slate-600 dark:fslate:ring-blue-800 inline-flex items-center'
            >
                {loading ? 'Exporting...' : 'Export'}
                <ArrowDownIcon className={'h-5 w-5 ml-2'} />
            </button>
        )
    );
};

ExportButton.propTypes = {
    flights: PropTypes.array.isRequired,
};

export default ExportButton;
