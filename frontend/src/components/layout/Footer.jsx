import { SITE_CONSTANTS } from '../../constants/siteConstants';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-lg mt-auto w-full">
      <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="text-center md:text-left w-full md:w-auto">
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200">
              {SITE_CONSTANTS.SITE_NAME}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {SITE_CONSTANTS.SITE_DESCRIPTION}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-8 w-full md:w-auto">
            <div className="text-center sm:text-left">
              <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2 text-sm sm:text-base">
                {SITE_CONSTANTS.FOOTER_CONTACT}
              </h4>
              <div className="flex flex-col space-y-2">
                <a 
                  href={`mailto:${SITE_CONSTANTS.COMPANY_EMAIL}`}
                  className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-center sm:justify-start space-x-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{SITE_CONSTANTS.COMPANY_EMAIL}</span>
                </a>
                <a 
                  href={`tel:${SITE_CONSTANTS.COMPANY_PHONE}`}
                  className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-center sm:justify-start space-x-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{SITE_CONSTANTS.COMPANY_PHONE}</span>
                </a>
              </div>
            </div>
            
            <div className="text-center sm:text-left">
              <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2 text-sm sm:text-base">
                {SITE_CONSTANTS.FOOTER_ADDRESS}
              </h4>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE_CONSTANTS.COMPANY_ADDRESS)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-center sm:justify-start space-x-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{SITE_CONSTANTS.COMPANY_ADDRESS}</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-6 sm:mt-8 border-t border-gray-200 dark:border-gray-700 pt-4">
          <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} {SITE_CONSTANTS.SITE_NAME}. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 