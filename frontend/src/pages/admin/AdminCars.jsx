import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { SITE_CONSTANTS } from '../../constants/siteConstants';

const AdminCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    image: '',
    category: '',
    transmission: '',
    fuelType: '',
    seats: '',
    mileage: '',
    isAvailable: true,
  });
  const [imagePreview, setImagePreview] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/cars');
      setCars(response.data);
    } catch (error) {
      toast.error('Araçlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu aracı silmek istediğinize emin misiniz?')) {
      try {
        await axios.delete(`http://localhost:5000/api/cars/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        toast.success('Araç başarıyla silindi');
        fetchCars();
      } catch (error) {
        toast.error('Araç silinirken bir hata oluştu');
      }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Dosya boyutu kontrolü (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Dosya boyutu 10MB\'dan küçük olmalıdır');
      return;
    }

    // Dosya tipi kontrolü
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Sadece JPG, PNG, GIF ve WEBP formatları desteklenir!');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', file);
      
      // Eğer düzenleme modundaysa ve eski bir resim varsa, onu da gönder
      if (selectedCar?.image && selectedCar.image.includes('/uploads/')) {
        formData.append('oldImage', selectedCar.image);
      }

      const response = await axios.post(
        'http://localhost:5000/api/cars/upload-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setFormData(prev => ({
        ...prev,
        image: response.data.imageUrl
      }));
      
      setImagePreview(URL.createObjectURL(file));
      setUploadedImage(file);
      
    } catch (error) {
      toast.error('Resim yüklenirken bir hata oluştu');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCar) {
        await axios.put(
          `http://localhost:5000/api/cars/${selectedCar._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        toast.success(SITE_CONSTANTS.SUCCESS_UPDATE_CAR);
      } else {
        await axios.post('http://localhost:5000/api/cars', formData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        toast.success(SITE_CONSTANTS.SUCCESS_CREATE_CAR);
      }
      setIsModalOpen(false);
      fetchCars();
    } catch (error) {
      toast.error(error.response?.data?.message || SITE_CONSTANTS.ERROR_SAVE_CAR);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Araçlar
        </h1>
        <button
          onClick={() => {
            setSelectedCar(null);
            setFormData({
              brand: '',
              model: '',
              year: new Date().getFullYear(),
              price: '',
              image: '',
              category: '',
              transmission: '',
              fuelType: '',
              seats: '',
              mileage: '',
              isAvailable: true,
            });
            setImagePreview('');
            setUploadedImage(null);
            setIsModalOpen(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          {SITE_CONSTANTS.ADD_NEW_CAR}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {SITE_CONSTANTS.BRAND_MODEL}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {SITE_CONSTANTS.YEAR}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {SITE_CONSTANTS.CATEGORY}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {SITE_CONSTANTS.PRICE}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {SITE_CONSTANTS.STATUS}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {SITE_CONSTANTS.ACTIONS}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {cars.map((car) => (
              <tr key={car._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {car.brand} / {car.model}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400">{car.year}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {car.category === 'economy' && 'Ekonomi'}
                    {car.category === 'luxury' && 'Lüks'}
                    {car.category === 'sports' && 'Spor'}
                    {car.category === 'suv' && 'SUV'}
                    {car.category === 'standard' && 'Standart'}
                    {car.category === 'van' && 'Van'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    ₺{Number(car.price).toLocaleString('tr-TR')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    car.isAvailable
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {car.isAvailable ? 'Müsait' : 'Kirada'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedCar(car);
                      setFormData(car);
                      setImagePreview(car.image);
                      setUploadedImage(null);
                      setIsModalOpen(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                  >
                    {SITE_CONSTANTS.EDIT}
                  </button>
                  <button
                    onClick={() => handleDelete(car._id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    {SITE_CONSTANTS.DELETE}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-900 dark:text-white">
              {selectedCar ? SITE_CONSTANTS.EDIT_CAR : SITE_CONSTANTS.ADD_CAR}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {SITE_CONSTANTS.BRAND}
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {SITE_CONSTANTS.MODEL}
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {SITE_CONSTANTS.YEAR}
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {SITE_CONSTANTS.PRICE_LABEL}
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {SITE_CONSTANTS.IMAGE_URL}
                  </label>
                  <div className="mt-1 flex items-center space-x-4">
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-20 w-20 object-cover rounded"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full text-sm text-gray-500 dark:text-gray-400
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-indigo-50 file:text-indigo-700
                        hover:file:bg-indigo-100
                        dark:file:bg-gray-700 dark:file:text-gray-300
                        dark:hover:file:bg-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {SITE_CONSTANTS.CATEGORY_LABEL}
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  >
                    <option value="">{SITE_CONSTANTS.SELECT_CATEGORY}</option>
                    <option value="economy">{SITE_CONSTANTS.ECONOMY}</option>
                    <option value="standard">{SITE_CONSTANTS.STANDARD}</option>
                    <option value="luxury">{SITE_CONSTANTS.LUXURY}</option>
                    <option value="sports">{SITE_CONSTANTS.SPORT}</option>
                    <option value="suv">{SITE_CONSTANTS.SUV}</option>
                    <option value="van">{SITE_CONSTANTS.VAN}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {SITE_CONSTANTS.TRANSMISSION}
                  </label>
                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  >
                    <option value="">{SITE_CONSTANTS.SELECT_TRANSMISSION}</option>
                    <option value="manual">{SITE_CONSTANTS.MANUAL}</option>
                    <option value="automatic">{SITE_CONSTANTS.AUTOMATIC}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {SITE_CONSTANTS.FUEL_TYPE}
                  </label>
                  <select
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  >
                    <option value="">{SITE_CONSTANTS.SELECT_FUEL_TYPE}</option>
                    <option value="gasoline">{SITE_CONSTANTS.GASOLINE}</option>
                    <option value="diesel">{SITE_CONSTANTS.DIESEL}</option>
                    <option value="electric">{SITE_CONSTANTS.ELECTRIC}</option>
                    <option value="hybrid">{SITE_CONSTANTS.HYBRID}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {SITE_CONSTANTS.SEATS}
                  </label>
                  <input
                    type="number"
                    name="seats"
                    value={formData.seats}
                    onChange={handleInputChange}
                    min="2"
                    max="9"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {SITE_CONSTANTS.MILEAGE}
                  </label>
                  <input
                    type="number"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    {SITE_CONSTANTS.IS_AVAILABLE}
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  {SITE_CONSTANTS.CANCEL}
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  {selectedCar ? SITE_CONSTANTS.SAVE : SITE_CONSTANTS.CREATE}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCars; 