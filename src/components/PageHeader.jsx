import PropTypes from 'prop-types';

const PageHeader = ({ title, subtitle }) => (
    <div className='py-5 flex justify-center px-4 lg:px-16'>
        <div className='mx-auto w-full'>
            <h2 className='text-base font-semibold leading-6 text-white'>
                {title}
            </h2>
            <p className='mt-1 max-w-2xl text-sm text-gray-500'>{subtitle}</p>
        </div>
    </div>
);

PageHeader.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
};

export default PageHeader;
