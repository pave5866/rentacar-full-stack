import { SITE_CONSTANTS } from '../constants/siteConstants';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            {SITE_CONSTANTS.CONTACT_TITLE}
          </h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
            {SITE_CONSTANTS.CONTACT_SUBTITLE}
          </p>
        </div>

        <div className="mt-12 bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          {/* İletişim Bilgileri */}
          <div className="p-8 bg-indigo-700 dark:bg-indigo-800 text-white">
            <h3 className="text-2xl font-medium">{SITE_CONSTANTS.CONTACT_INFO_TITLE}</h3>
            <p className="mt-4 text-lg text-indigo-100">
              {SITE_CONSTANTS.CONTACT_INFO_DESC}
            </p>
            
            <dl className="mt-8 space-y-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <dt className="text-lg font-medium text-indigo-200">Telefon</dt>
                  <dd className="mt-1">
                    <a 
                      href={`tel:${SITE_CONSTANTS.COMPANY_PHONE}`}
                      className="text-xl text-white hover:text-indigo-200 transition-colors"
                    >
                      {SITE_CONSTANTS.COMPANY_PHONE}
                    </a>
                  </dd>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <dt className="text-lg font-medium text-indigo-200">E-posta</dt>
                  <dd className="mt-1">
                    <a 
                      href={`mailto:${SITE_CONSTANTS.COMPANY_EMAIL}`}
                      className="text-xl text-white hover:text-indigo-200 transition-colors"
                    >
                      {SITE_CONSTANTS.COMPANY_EMAIL}
                    </a>
                  </dd>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <dt className="text-lg font-medium text-indigo-200">Adres</dt>
                  <dd className="mt-1">
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE_CONSTANTS.COMPANY_ADDRESS)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl text-white hover:text-indigo-200 transition-colors"
                    >
                      {SITE_CONSTANTS.COMPANY_ADDRESS}
                    </a>
                  </dd>
                </div>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 