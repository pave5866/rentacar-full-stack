import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { SITE_CONSTANTS } from '../constants/siteConstants';

const AdminDashboard = () => {
  const [cars, setCars] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [carsResponse, rentalsResponse] = await Promise.all([
          axios.get('/api/cars'),
          axios.get('/api/rentals'),
        ]);
        setCars(carsResponse.data);
        setRentals(rentalsResponse.data);
      } catch (error) {
        toast.error(SITE_CONSTANTS.ERROR_ADMIN_DATA_FETCH);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleDeleteCar = async (carId) => {
    try {
      await axios.delete(`/api/cars/${carId}`);
      setCars(cars.filter((car) => car._id !== carId));
      toast.success(SITE_CONSTANTS.SUCCESS_CAR_DELETE);
    } catch (error) {
      toast.error(SITE_CONSTANTS.ERROR_CAR_DELETE);
    }
  };

  const handleUpdateRentalStatus = async (rentalId, status) => {
    try {
      await axios.put(`/api/rentals/${rentalId}`, { status });
      setRentals(
        rentals.map((rental) =>
          rental._id === rentalId ? { ...rental, status } : rental
        )
      );
      toast.success(SITE_CONSTANTS.SUCCESS_RENTAL_UPDATE);
    } catch (error) {
      toast.error(SITE_CONSTANTS.ERROR_RENTAL_UPDATE);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        {SITE_CONSTANTS.ADMIN_DASHBOARD}
      </h1>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {SITE_CONSTANTS.ADMIN_CARS}
            </h2>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            {cars.length === 0 ? (
              <p className="text-center py-6 text-gray-500 dark:text-gray-400">
                {SITE_CONSTANTS.NO_CARS}
              </p>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {cars.map((car) => (
                  <li key={car._id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {car.brand} {car.model}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {car.year} · {car.category} · ₺{car.dailyPrice}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteCar(car._id)}
                        className="ml-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        {SITE_CONSTANTS.BUTTON_DELETE}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {SITE_CONSTANTS.ADMIN_RENTALS}
            </h2>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            {rentals.length === 0 ? (
              <p className="text-center py-6 text-gray-500 dark:text-gray-400">
                {SITE_CONSTANTS.NO_RENTALS}
              </p>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {rentals.map((rental) => (
                  <li key={rental._id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {rental.car.brand} {rental.car.model}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {rental.user.name} · {new Date(rental.startDate).toLocaleDateString()} -{' '}
                          {new Date(rental.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <select
                          value={rental.status}
                          onChange={(e) => handleUpdateRentalStatus(rental._id, e.target.value)}
                          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                          <option value="pending">{SITE_CONSTANTS.STATUS_PENDING}</option>
                          <option value="confirmed">{SITE_CONSTANTS.STATUS_CONFIRMED}</option>
                          <option value="completed">{SITE_CONSTANTS.STATUS_COMPLETED}</option>
                          <option value="cancelled">{SITE_CONSTANTS.STATUS_CANCELLED}</option>
                        </select>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 