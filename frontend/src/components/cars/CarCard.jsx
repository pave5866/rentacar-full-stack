import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/solid';
import { SITE_CONSTANTS } from '../../constants/siteConstants';

const CarCard = ({ car }) => {
  const getCategory = (category) => {
    const categoryMap = {
      'economy': 'Ekonomi',
      'luxury': 'Lüks',
      'suv': 'SUV',
      'SUV': 'SUV',
      'sports': 'Spor',
      'standard': 'Standart',
      'van': 'Van'
    };
    return categoryMap[category] || 'Belirtilmemiş';
  };

  const getTransmission = (transmission) => {
    const transmissionMap = {
      'manual': 'Manuel',
      'automatic': 'Otomatik'
    };
    return transmissionMap[transmission] || 'Belirtilmemiş';
  };

  const getFuelType = (fuelType) => {
    const fuelTypeMap = {
      'gasoline': 'Benzin',
      'diesel': 'Dizel',
      'electric': 'Elektrik',
      'hybrid': 'Hibrit'
    };
    return fuelTypeMap[fuelType] || 'Belirtilmemiş';
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400">
      <div className="relative h-40 sm:h-48">
        <img
          src={car.image ? `http://localhost:5000${car.image}` : 'https://via.placeholder.com/400x300?text=Resim+Yok'}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/400x300?text=Resim+Yok';
          }}
        />
      </div>
      
      <div className="p-3 sm:p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              {car.brand} {car.model}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {car.year} · {getTransmission(car.transmission)} · {getFuelType(car.fuelType)}
            </p>
          </div>
          <div className="flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`h-4 w-4 sm:h-5 sm:w-5 text-yellow-400`}
                />
              ))}
            </div>
            <span className="ml-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              ({car.rating?.count || 0})
            </span>
          </div>
        </div>

        <div className="mt-3 sm:mt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{SITE_CONSTANTS.DAILY_TEXT}</p>
              <p className="text-lg sm:text-xl font-bold text-indigo-600 dark:text-indigo-400">
                ₺{Number(car.price).toLocaleString('tr-TR')}
              </p>
            </div>
            <Link
              to={`/cars/${car._id}`}
              className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:hover:bg-indigo-500 transition-colors duration-300"
            >
              {SITE_CONSTANTS.EXAMINE_BUTTON}
            </Link>
          </div>
        </div>

        <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded-full ${
            car.isAvailable
              ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
              : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
          }`}>
            {car.isAvailable ? 'Müsait' : 'Kirada'}
          </span>
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100">
            {getCategory(car.category)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CarCard; 