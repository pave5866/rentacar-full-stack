import { Link } from 'react-router-dom';
import { SITE_CONSTANTS } from '../../constants/siteConstants';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Admin Panel
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/cars"
          className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Araçlar
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Araçları görüntüle, ekle, düzenle ve sil
          </p>
        </Link>

        <Link
          to="/admin/reservations"
          className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Kiralamalar
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Tüm rezervasyonları görüntüle ve yönet
          </p>
        </Link>

        <Link
          to="/admin/settings"
          className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Site Ayarları
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Site ayarlarını düzenle
          </p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard; 