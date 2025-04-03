import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { SITE_CONSTANTS, updateSiteSettings } from '../../constants/siteConstants';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: SITE_CONSTANTS.SITE_NAME,
    siteDescription: SITE_CONSTANTS.SITE_DESCRIPTION,
    companyPhone: SITE_CONSTANTS.COMPANY_PHONE,
    companyEmail: SITE_CONSTANTS.COMPANY_EMAIL,
    companyAddress: SITE_CONSTANTS.COMPANY_ADDRESS,
    siteUrl: window.location.origin,
    adminWhatsapp: '',
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: ''
    },
    texts: {
      // Başlıklar
      homeTitle: "En İyi Araçlar, En Uygun Fiyatlar",
      homeSubtitle: "İhtiyacınıza uygun aracı hemen kiralayın",
      profileTitle: "Profilim",
      adminDashboard: "Admin Panel",
      
      // Butonlar
      rentNow: "Hemen Kirala",
      examine: "Detayları Gör",
      save: "Kaydet",
      cancel: "İptal",
      delete: "Sil",
      edit: "Düzenle",
      create: "Oluştur",
      
      // Mesajlar
      successSave: "Başarıyla kaydedildi",
      successUpdate: "Başarıyla güncellendi",
      successDelete: "Başarıyla silindi",
      errorSave: "Kaydedilirken bir hata oluştu",
      errorUpdate: "Güncellenirken bir hata oluştu",
      errorDelete: "Silinirken bir hata oluştu",
      
      // Form Etiketleri
      labelName: "Ad Soyad",
      labelEmail: "E-posta",
      labelPhone: "Telefon",
      labelAddress: "Adres",
      labelPassword: "Şifre",
      
      // Araç Özellikleri
      transmission: {
        manual: "Manuel",
        automatic: "Otomatik"
      },
      fuelType: {
        gasoline: "Benzin",
        diesel: "Dizel",
        electric: "Elektrik",
        hybrid: "Hibrit"
      },
      category: {
        economy: "Ekonomi",
        standard: "Standart",
        luxury: "Lüks",
        sports: "Spor",
        suv: "SUV",
        van: "Van"
      }
    },
    adminEmail: '',
  });

  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const initializeSettings = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/settings');
        if (response.data) {
          // Logo URL'sini kontrol et
          if (response.data.siteLogo) {
            try {
              // Logo dosyasının varlığını kontrol et
              const logoResponse = await axios.head(`http://localhost:5000${response.data.siteLogo}`);
              if (logoResponse.status !== 200) {
                response.data.siteLogo = ''; // Logo bulunamadıysa boş string ata
              }
            } catch (error) {
              response.data.siteLogo = ''; // Hata durumunda boş string ata
            }
          }
          
          setSettings(response.data);
          updateSiteSettings(response.data);
        }
      } catch (error) {
        toast.error('Ayarlar yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    initializeSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        'http://localhost:5000/api/settings',
        settings,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          timeout: 5000,
        }
      );
      
      if (response.data) {
        updateSiteSettings(response.data);
        setSettings(response.data);
        toast.success('Ayarlar başarıyla güncellendi');
        
        // Sayfayı yenile
        window.location.reload();
      }
    } catch (error) {
      toast.error('Ayarlar güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setSettings((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setSettings((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Dosya boyutu kontrolü (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Dosya boyutu 10MB\'dan küçük olmalıdır');
      return;
    }

    // Dosya tipi kontrolü
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Sadece JPG, PNG, GIF, SVG ve WEBP formatları desteklenir!');
      return;
    }

    const formData = new FormData();
    formData.append('logo', file);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/settings/upload-logo',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      // Settings state'ini güncelle
      setSettings(prev => ({
        ...prev,
        siteLogo: response.data.logoUrl
      }));

      // Site ayarlarını güncelle
      await axios.put(
        'http://localhost:5000/api/settings',
        { ...settings, siteLogo: response.data.logoUrl },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      updateSiteSettings({ ...settings, siteLogo: response.data.logoUrl });
      toast.success('Logo başarıyla yüklendi');
      
      // Sayfayı yenile
      window.location.reload();
    } catch (error) {
      toast.error('Logo yüklenirken bir hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Site Ayarları
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Genel Site Ayarları */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Genel Site Ayarları</h2>
            
            {/* Site Adı */}
            <div className="mb-4">
              <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Site Adı
              </label>
              <input
                type="text"
                name="siteName"
                id="siteName"
                value={settings.siteName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
              />
            </div>

            {/* Site Açıklaması */}
            <div className="mb-4">
              <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Site Açıklaması
              </label>
              <textarea
                name="siteDescription"
                id="siteDescription"
                value={settings.siteDescription}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
              />
            </div>

            {/* Şirket Telefonu */}
            <div className="mb-4">
              <label htmlFor="companyPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Şirket Telefonu
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  name="companyPhone"
                  id="companyPhone"
                  value={settings.companyPhone}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                />
                <a
                  href={`tel:${settings.companyPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 p-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Şirket E-postası */}
            <div className="mb-4">
              <label htmlFor="companyEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Şirket E-postası
              </label>
              <div className="flex items-center">
                <input
                  type="email"
                  name="companyEmail"
                  id="companyEmail"
                  value={settings.companyEmail}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                />
                <a
                  href={`mailto:${settings.companyEmail}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 p-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Şirket Adresi */}
            <div className="mb-4">
              <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Şirket Adresi
              </label>
              <div className="flex items-center">
                <textarea
                  name="companyAddress"
                  id="companyAddress"
                  value={settings.companyAddress}
                  onChange={handleChange}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.companyAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 p-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Site Logosu
            </label>
            <div className="mt-1 flex items-center space-x-4">
              {settings.siteLogo ? (
                <img 
                  src={settings.siteLogo.startsWith('http') ? settings.siteLogo : `http://localhost:5000${settings.siteLogo}`}
                  alt="Site Logo" 
                  className="h-12 w-12 object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'http://localhost:5000/default-logo.svg';
                  }}
                />
              ) : (
                <div className="animate-pulse h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
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
            <p className="mt-1 text-sm text-gray-500">
              PNG, JPG veya GIF. Maksimum 5MB.
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Admin WhatsApp Numarası
            </label>
            <input
              type="tel"
              name="adminWhatsapp"
              value={settings.adminWhatsapp}
              onChange={handleChange}
              placeholder="Örnek: 905xxxxxxxxx"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
            <p className="mt-1 text-sm text-gray-500">Başında 90 olacak şekilde yazın. Örnek: 905321234567</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Admin Email (Bildirimler İçin)
            </label>
            <input
              type="email"
              name="adminEmail"
              value={settings.adminEmail}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
            />
          </div>

          {/* Site Metinleri */}
          <div className="md:col-span-2 mt-8">
            <h2 className="text-xl font-semibold mb-4">Site Metinleri</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Ana Sayfa Başlığı
            </label>
            <input
              type="text"
              name="texts.homeTitle"
              value={settings.texts.homeTitle}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Ana Sayfa Alt Başlığı
            </label>
            <input
              type="text"
              name="texts.homeSubtitle"
              value={settings.texts.homeSubtitle}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Sosyal Medya */}
          <div className="md:col-span-2 mt-8">
            <h2 className="text-xl font-semibold mb-4">Sosyal Medya</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Facebook URL
            </label>
            <input
              type="url"
              name="socialMedia.facebook"
              value={settings.socialMedia.facebook}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Twitter URL
            </label>
            <input
              type="url"
              name="socialMedia.twitter"
              value={settings.socialMedia.twitter}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Instagram URL
            </label>
            <input
              type="url"
              name="socialMedia.instagram"
              value={settings.socialMedia.instagram}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Ayarları Kaydet
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings; 