import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { SITE_CONSTANTS } from '../constants/siteConstants';
import { updateUser } from '../features/auth/authSlice';
import { getMyReservations, updateReservationStatus } from '../features/reservations/reservationsSlice';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { reservations, isLoading } = useSelector((state) => state.reservations);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setPhone(user.phone || '');
    dispatch(getMyReservations()).finally(() => setLoading(false));
  }, [user, navigate, dispatch]);

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      setPhone(value);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (phone && (!phone.startsWith('05') || phone.length !== 11)) {
        toast.error('Geçerli bir telefon numarası girin (05XX XXX XX XX)');
        return;
      }

      const response = await axios.put(
        'http://localhost:5000/api/auth/profile',
        { phone },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      dispatch(updateUser({ ...user, phone: response.data.phone }));
      setIsEditing(false);
      toast.success('Profil başarıyla güncellendi');
    } catch (error) {
      toast.error('Profil güncellenirken bir hata oluştu');
    }
  };

  const handleCancelRental = async (rentalId) => {
    try {
      await dispatch(updateReservationStatus({ 
        id: rentalId, 
        status: 'cancelled' 
      })).unwrap();
      
      // Rezervasyonları yeniden yükle
      dispatch(getMyReservations());
    } catch (error) {
      toast.error('Rezervasyon iptal edilirken bir hata oluştu');
    }
  };

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">
        {SITE_CONSTANTS.PROFILE_TITLE}
      </h1>

      {/* Profil Bilgileri Kartı */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden p-4 sm:p-6 mb-6 sm:mb-8 transition-shadow duration-300 hover:shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            {SITE_CONSTANTS.PROFILE_INFO}
          </h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 transform hover:scale-105"
            >
              Düzenle
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {SITE_CONSTANTS.LABEL_NAME}
            </p>
            <p className="text-base sm:text-lg text-gray-900 dark:text-white">{user.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {SITE_CONSTANTS.LABEL_EMAIL}
            </p>
            <p className="text-base sm:text-lg text-gray-900 dark:text-white break-all">{user.email}</p>
          </div>
          <div className="space-y-1 md:col-span-2">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {SITE_CONSTANTS.LABEL_PHONE}
            </p>
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="05XX XXX XX XX"
                  className="w-full px-4 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200"
                />
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={handleUpdateProfile}
                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                  >
                    Kaydet
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setPhone(user.phone || '');
                    }}
                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-all duration-200"
                  >
                    İptal
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-base sm:text-lg text-gray-900 dark:text-white">
                {user.phone || 'Telefon numarası eklenmemiş'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Rezervasyonlar Kartı */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl">
        <div className="px-4 sm:px-6 py-5">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            {SITE_CONSTANTS.PROFILE_RENTALS}
          </h2>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700">
          {reservations.length === 0 ? (
            <p className="text-center py-8 text-gray-500 dark:text-gray-400">
              {SITE_CONSTANTS.NO_RENTALS}
            </p>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {reservations.map((rental) => (
                <li key={rental._id} className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {rental.car.brand} {rental.car.model}
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                        </p>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          rental.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          rental.status === 'approved' ? 'bg-green-100 text-green-800' :
                          rental.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {rental.status === 'pending' ? 'Beklemede' :
                           rental.status === 'approved' ? 'Onaylandı' :
                           rental.status === 'cancelled' ? 'İptal Edildi' :
                           rental.status}
                        </span>
                      </div>
                    </div>
                    {rental.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancelRental(rental._id)}
                        className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 transform hover:scale-105"
                      >
                        {SITE_CONSTANTS.BUTTON_CANCEL_RENTAL}
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 