import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import { logout, logoutAsync } from '../../features/auth/authSlice';
import { MoonIcon, SunIcon, Bars3Icon, XMarkIcon, HomeIcon, UserIcon, Cog6ToothIcon, PhoneIcon, ArrowRightOnRectangleIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { SITE_CONSTANTS } from '../../constants/siteConstants';

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutAsync());
    dispatch(logout());
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3" onClick={() => setIsMenuOpen(false)}>
              {SITE_CONSTANTS.SITE_LOGO ? (
                <img 
                  src={`http://localhost:5000${SITE_CONSTANTS.SITE_LOGO}`}
                  alt={SITE_CONSTANTS.SITE_NAME}
                  className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
                />
              ) : (
                <div className="relative h-8 w-8 sm:h-10 sm:w-10">
                  <div className="absolute inset-0 bg-indigo-500 rounded-full opacity-75 animate-ping"></div>
                  <div className="relative bg-indigo-600 h-full w-full rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              )}
              <span className="text-lg sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {SITE_CONSTANTS.SITE_NAME}
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span className="sr-only">Menüyü aç</span>
              {isMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label={darkMode ? 'Gündüz moduna geç' : 'Gece moduna geç'}
            >
              {darkMode ? (
                <SunIcon className="h-6 w-6 text-yellow-400" />
              ) : (
                <MoonIcon className="h-6 w-6 text-gray-600" />
              )}
            </button>

            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'admin' && (
                  <>
                    <Link
                      to="/admin"
                      className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      {SITE_CONSTANTS.NAV_ADMIN}
                    </Link>
                    <Link
                      to="/admin/settings"
                      className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      {SITE_CONSTANTS.NAV_SETTINGS}
                    </Link>
                  </>
                )}
                {user.role !== 'admin' && (
                  <Link
                    to="/profile"
                    className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    {SITE_CONSTANTS.NAV_PROFILE}
                  </Link>
                )}
                <Link
                  to="/contact"
                  className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  {SITE_CONSTANTS.NAV_CONTACT}
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  {SITE_CONSTANTS.NAV_LOGOUT}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/contact"
                  className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  {SITE_CONSTANTS.NAV_CONTACT}
                </Link>
                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  {SITE_CONSTANTS.NAV_LOGIN}
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  {SITE_CONSTANTS.NAV_REGISTER}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden bg-white dark:bg-gray-800 pb-4`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-center px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label={darkMode ? 'Gündüz moduna geç' : 'Gece moduna geç'}
          >
            {darkMode ? (
              <SunIcon className="h-6 w-6 text-yellow-400" />
            ) : (
              <MoonIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            )}
          </button>

          {user ? (
            <>
              {user.role === 'admin' ? (
                <>
                  <Link
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <HomeIcon className="h-6 w-6 mr-2" />
                    {SITE_CONSTANTS.NAV_ADMIN}
                  </Link>
                  <Link
                    to="/admin/settings"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Cog6ToothIcon className="h-6 w-6 mr-2" />
                    {SITE_CONSTANTS.NAV_SETTINGS}
                  </Link>
                </>
              ) : (
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <UserIcon className="h-6 w-6 mr-2" />
                  {SITE_CONSTANTS.NAV_PROFILE}
                </Link>
              )}
              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <PhoneIcon className="h-6 w-6 mr-2" />
                {SITE_CONSTANTS.NAV_CONTACT}
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowRightOnRectangleIcon className="h-6 w-6 mr-2" />
                {SITE_CONSTANTS.NAV_LOGOUT}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <PhoneIcon className="h-6 w-6 mr-2" />
                {SITE_CONSTANTS.NAV_CONTACT}
              </Link>
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowRightOnRectangleIcon className="h-6 w-6 mr-2" />
                {SITE_CONSTANTS.NAV_LOGIN}
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:text-indigo-700 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <UserPlusIcon className="h-6 w-6 mr-2" />
                {SITE_CONSTANTS.NAV_REGISTER}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 