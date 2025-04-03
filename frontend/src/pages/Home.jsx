import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getCars } from '../features/cars/carsSlice';
import CarCard from '../components/cars/CarCard';
import SearchFilters from '../components/cars/SearchFilters';
import { SITE_CONSTANTS } from '../constants/siteConstants';

const Home = () => {
  const dispatch = useDispatch();
  const { cars, isLoading, isError, message } = useSelector((state) => state.cars);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
  });

  useEffect(() => {
    dispatch(getCars());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-indigo-600 dark:bg-indigo-800 py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white">
              {SITE_CONSTANTS.HOME_TITLE}
            </h1>
            <p className="mt-2 sm:mt-3 max-w-md mx-auto text-sm sm:text-base md:text-lg lg:text-xl text-indigo-200 md:mt-5 md:max-w-3xl">
              {SITE_CONSTANTS.HOME_SUBTITLE}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <SearchFilters filters={filters} setFilters={setFilters} />

        {isError ? (
          <div className="text-center text-red-600 dark:text-red-400 mt-4 sm:mt-8">
            {message}
          </div>
        ) : (
          <div className="mt-4 sm:mt-8 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.isArray(cars) && cars.length > 0 ? (
              cars
                .filter(
                  (car) =>
                    (!filters.category || car.category === filters.category) &&
                    (!filters.search ||
                      car.make.toLowerCase().includes(filters.search.toLowerCase()) ||
                      car.model.toLowerCase().includes(filters.search.toLowerCase()))
                )
                .map((car) => <CarCard key={car._id} car={car} />)
            ) : (
              <div className="col-span-3 text-center text-gray-600 dark:text-gray-400 mt-8">
                Araç bulunamadı
              </div>
            )}
          </div>
        )}

        {Array.isArray(cars) && cars.length === 0 && !isLoading && !isError && (
          <div className="text-center text-gray-600 dark:text-gray-400 mt-8">
            Henüz araç bulunmamaktadır
          </div>
        )}
      </div>
    </div>
  );
};

export default Home; 