import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getCarById } from '../features/cars/carsSlice';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { StarIcon } from '@heroicons/react/24/solid';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [dates, setDates] = useState({
    startDate: '',
    endDate: '',
  });
  const [ratings, setRatings] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [availability, setAvailability] = useState(null);
  const [availabilityError, setAvailabilityError] = useState('');
  const [ratingError, setRatingError] = useState('');

  const { car, isLoading, isError, message } = useSelector((state) => state.cars);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    dispatch(getCarById(id));
    fetchRatings();
  }, [dispatch, id, isError, message]);

  // Tarih değişikliklerini izle
  useEffect(() => {
    if (dates.startDate && dates.endDate) {
      checkAvailability();
    }
  }, [dates.startDate, dates.endDate]);

  const checkAvailability = async () => {
    if (!dates.startDate || !dates.endDate) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/api/cars/${id}/availability`,
        {
          params: {
            startDate: new Date(dates.startDate).toISOString(),
            endDate: new Date(dates.endDate).toISOString()
          }
        }
      );

      setAvailability(response.data);
    } catch (error) {
      setAvailabilityError(error.response?.data?.message || 'Müsaitlik kontrolü yapılırken bir hata oluştu');
    }
  };

  const fetchRatings = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/ratings/${id}`);
      setRatings(response.data);
      
      // Kullanıcının daha önce yaptığı değerlendirmeyi kontrol et
      if (user) {
        const userRating = response.data.find(r => r.user._id === user._id);
        if (userRating) {
          setUserRating(userRating.rating);
          setComment(userRating.comment || '');
        }
      }
    } catch (error) {
      setRatingError('Değerlendirmeler yüklenirken bir hata oluştu');
    }
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Değerlendirme yapmak için giriş yapmalısınız');
      navigate('/login');
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/ratings/${id}`, {
        rating: userRating
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      toast.success('Değerlendirmeniz başarıyla eklendi');
      setShowRatingForm(false);
      fetchRatings();
      dispatch(getCarById(id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Değerlendirme eklenirken bir hata oluştu');
    }
  };

  const handleDeleteRating = async (ratingId) => {
    try {
      await axios.delete(`http://localhost:5000/api/ratings/${ratingId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      toast.success('Değerlendirme başarıyla silindi');
      fetchRatings();
      dispatch(getCarById(id));
    } catch (error) {
      toast.error('Değerlendirme silinirken bir hata oluştu');
    }
  };

  const handleRent = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Lütfen önce giriş yapın');
      navigate('/login');
      return;
    }

    if (!user.phone) {
      toast.error('Kiralama yapmak için profil bilgilerinizde telefon numaranızı güncellemeniz gerekmektedir');
      navigate('/profile');
      return;
    }

    if (!dates.startDate || !dates.endDate) {
      toast.error('Lütfen tarih seçin');
      return;
    }

    const start = new Date(dates.startDate);
    const end = new Date(dates.endDate);

    if (start >= end) {
      toast.error('Bitiş tarihi başlangıç tarihinden sonra olmalıdır');
      return;
    }

    try {
      // Rezervasyonu oluştur
      const response = await axios.post('http://localhost:5000/api/reservations', {
        carId: id,
        startDate: dates.startDate,
        endDate: dates.endDate,
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      toast.success('Rezervasyon başarıyla oluşturuldu');
      navigate('/profile');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Rezervasyon oluşturulurken bir hata oluştu');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Araç bulunamadı
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Sol Kolon - Resim */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="aspect-square w-full flex items-center justify-center p-4">
              <img
                src={car.image ? `http://localhost:5000${car.image}` : 'https://via.placeholder.com/400x400'}
                alt={`${car.brand} ${car.model}`}
                className="max-w-full max-h-full object-contain rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400x400?text=Resim+Yok';
                }}
              />
            </div>
          </div>

          {/* Sağ Kolon - Detaylar */}
          <div className="flex flex-col space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{car.name}</h1>
              <div className="flex items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 text-yellow-400`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  ({car.rating?.count || 0})
                </span>
              </div>
              <div className="flex items-center space-x-4">
              </div>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Özellikler
                </h2>
                <ul className="mt-3 space-y-2">
                  <li className="text-gray-500 dark:text-gray-400">
                    Kategori: {car.category}
                  </li>
                  <li className="text-gray-500 dark:text-gray-400">
                    Yıl: {car.year}
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Fiyat
                </h2>
                <p className="mt-2 text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  ₺{car.price}
                  <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                    {' '}
                    / gün
                  </span>
                </p>
              </div>
            </div>

            {car && user && user.role !== 'admin' && (
              <form onSubmit={handleRent} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="startDate"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                      Başlangıç Tarihi
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={dates.startDate}
                      onChange={(e) =>
                        setDates({ ...dates, startDate: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="endDate"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                      Bitiş Tarihi
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={dates.endDate}
                      onChange={(e) =>
                        setDates({ ...dates, endDate: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                      min={dates.startDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                {availability && !availability.isAvailable && (
                  <div className="text-red-600 bg-red-50 dark:bg-red-900 dark:text-red-200 p-3 rounded-md">
                    Seçilen tarihler için onaylanmış bir rezervasyon bulunmaktadır
                  </div>
                )}
                <button
                  type="submit"
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white ${
                    availability && !availability.isAvailable
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  } transition-colors duration-200`}
                  disabled={availability && !availability.isAvailable}
                >
                  {availability && !availability.isAvailable ? 'Bu Tarihler Dolu' : 'Kirala'}
                </button>
              </form>
            )}

            {car && !user && (
              <div className="mt-8">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Kiralamak için Giriş Yapın
                </button>
              </div>
            )}

            {/* Değerlendirmeler Bölümü */}
            <div className="mt-8 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Değerlendirmeler
              </h2>
              
              {user && !ratings.find(r => r.user._id === user._id) && (
                <button
                  onClick={() => setShowRatingForm(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  Değerlendirme Yap
                </button>
              )}

              {showRatingForm && (
                <form onSubmit={handleRatingSubmit} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm space-y-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Puanınız
                    </label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setUserRating(star)}
                          className={`text-2xl ${
                            star <= userRating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowRatingForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      disabled={!userRating}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Gönder
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-4">
                {ratings.length > 0 ? (
                  ratings.map((rating) => (
                    <div key={rating._id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900 dark:text-white mr-2">
                            {rating.user.name}
                          </span>
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < rating.rating ? 'text-yellow-400' : 'text-gray-300'}>
                                ★
                              </span>
                            ))}
                          </div>
                          {user && user.role === 'admin' && (
                            <button
                              onClick={() => handleDeleteRating(rating._id)}
                              className="ml-2 text-red-500 hover:text-red-700"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(rating.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                      {rating.isVerifiedRental && (
                        <span className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Doğrulanmış Kiralama
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                    Henüz değerlendirme yapılmamış
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails; 