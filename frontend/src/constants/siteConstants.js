// LocalStorage'dan ayarları yükle
let savedSettings;
try {
  const saved = localStorage.getItem('siteSettings');
  if (saved) {
    savedSettings = JSON.parse(saved);
  }
} catch (error) {
  // Hata durumunda sessizce devam et
}

// Site ayarları için başlangıç değerleri
let SITE_SETTINGS = savedSettings || {
  // Genel Site Ayarları
  siteName: 'RentaCar',
  siteLogo: '',
  siteDescription: 'Araç Kiralama Sistemi',
  companyEmail: "info@rentacar.com",
  companyPhone: "+90 555 555 55 55",
  companyAddress: "İstanbul, Türkiye",
  footerText: "© {year} {siteName}. Tüm hakları saklıdır.",
  adminWhatsapp: "",
  siteUrl: window.location.origin,
  socialMedia: {
    facebook: '',
    twitter: '',
    instagram: ''
  },
  // Özel Metinler
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
  }
};

// Site ayarlarını güncellemek için fonksiyon
export const updateSiteSettings = (newSettings) => {
  try {
    Object.assign(SITE_SETTINGS, newSettings);
    localStorage.setItem('siteSettings', JSON.stringify(SITE_SETTINGS));
  } catch (error) {
    // Hata durumunda sessizce devam et
  }
};

// Site sabitlerini dinamik olarak oluştur
export const SITE_CONSTANTS = {
  // Genel Site Bilgileri
  get SITE_NAME() { return SITE_SETTINGS.siteName || 'RentaCar'; },
  get SITE_LOGO() { return SITE_SETTINGS.siteLogo || ''; },
  get SITE_DESCRIPTION() { return SITE_SETTINGS.siteDescription || 'Araç Kiralama Sistemi'; },
  get COMPANY_EMAIL() { return SITE_SETTINGS.companyEmail || 'info@rentacar.com'; },
  get COMPANY_PHONE() { return SITE_SETTINGS.companyPhone || '+90 555 555 55 55'; },
  get COMPANY_ADDRESS() { return SITE_SETTINGS.companyAddress || 'İstanbul, Türkiye'; },
  get FOOTER_RIGHTS() { 
    const text = SITE_SETTINGS.footerText || "© {year} {siteName}. Tüm hakları saklıdır.";
    return text
      .replace('{year}', new Date().getFullYear())
      .replace('{siteName}', SITE_SETTINGS.siteName || 'RentaCar');
  },
  get SITE_URL() { return SITE_SETTINGS.siteUrl || window.location.origin; },
  get ADMIN_WHATSAPP() { return SITE_SETTINGS.adminWhatsapp || ''; },
  get SOCIAL_MEDIA() { return SITE_SETTINGS.socialMedia || {}; },

  // Başlıklar
  get HOME_TITLE() { return SITE_SETTINGS.texts?.homeTitle || "En İyi Araçlar, En Uygun Fiyatlar"; },
  get HOME_SUBTITLE() { return SITE_SETTINGS.texts?.homeSubtitle || "İhtiyacınıza uygun aracı hemen kiralayın"; },
  get PROFILE_TITLE() { return SITE_SETTINGS.texts?.profileTitle || "Profilim"; },
  get ADMIN_DASHBOARD() { return SITE_SETTINGS.texts?.adminDashboard || "Admin Panel"; },

  // Butonlar
  get BUTTON_RENT_NOW() { return SITE_SETTINGS.texts.rentNow; },
  get BUTTON_EXAMINE() { return SITE_SETTINGS.texts.examine; },
  get BUTTON_SAVE() { return SITE_SETTINGS.texts.save; },
  get BUTTON_CANCEL() { return SITE_SETTINGS.texts.cancel; },
  get BUTTON_DELETE() { return SITE_SETTINGS.texts.delete; },
  get BUTTON_EDIT() { return SITE_SETTINGS.texts.edit; },
  get BUTTON_CREATE() { return SITE_SETTINGS.texts.create; },

  // Mesajlar
  get SUCCESS_SAVE() { return SITE_SETTINGS.texts.successSave; },
  get SUCCESS_UPDATE() { return SITE_SETTINGS.texts.successUpdate; },
  get SUCCESS_DELETE() { return SITE_SETTINGS.texts.successDelete; },
  get ERROR_SAVE() { return SITE_SETTINGS.texts.errorSave; },
  get ERROR_UPDATE() { return SITE_SETTINGS.texts.errorUpdate; },
  get ERROR_DELETE() { return SITE_SETTINGS.texts.errorDelete; },

  // Form Etiketleri
  get LABEL_NAME() { return SITE_SETTINGS.texts.labelName; },
  get LABEL_EMAIL() { return SITE_SETTINGS.texts.labelEmail; },
  get LABEL_PHONE() { return SITE_SETTINGS.texts.labelPhone; },
  get LABEL_ADDRESS() { return SITE_SETTINGS.texts.labelAddress; },
  get LABEL_PASSWORD() { return SITE_SETTINGS.texts.labelPassword; },

  // Araç Özellikleri
  getTransmissionText(key) {
    return SITE_SETTINGS.texts.transmission[key] || 'Belirtilmemiş';
  },
  getFuelTypeText(key) {
    return SITE_SETTINGS.texts.fuelType[key] || 'Belirtilmemiş';
  },
  getCategoryText(key) {
    return SITE_SETTINGS.texts.category[key] || 'Belirtilmemiş';
  },

  // Navigasyon
  NAV_HOME: "Ana Sayfa",
  NAV_CARS: "Araçlar",
  NAV_ADMIN: "Admin Panel",
  NAV_PROFILE: "Profilim",
  NAV_LOGIN: "Giriş Yap",
  NAV_REGISTER: "Kayıt Ol",
  NAV_LOGOUT: "Çıkış Yap",
  NAV_SETTINGS: "Ayarlar",
  NAV_CONTACT: "İletişim",

  // Tablo Başlıkları
  BRAND_MODEL: 'Marka & Model',
  YEAR: 'Yıl',
  CATEGORY: 'Kategori',
  PRICE: 'Günlük Fiyat',
  STATUS: 'Durum',
  ACTIONS: 'İşlemler',

  // Durumlar
  AVAILABLE: 'Müsait',
  RENTED: 'Kirada',
  PER_DAY: 'gün',

  // Araç İşlemleri
  ADD_NEW_CAR: 'Yeni Araç Ekle',
  EDIT_CAR: 'Aracı Düzenle',
  ADD_CAR: 'Araç Ekle',
  DELETE_CAR: 'Aracı Sil',
  SAVE_CAR: 'Kaydet',

  // Form Etiketleri
  BRAND: 'Marka',
  MODEL: 'Model',
  PRICE_LABEL: 'Günlük Fiyat',
  IMAGE_URL: 'Resim URL',
  CATEGORY_LABEL: 'Kategori',
  TRANSMISSION: 'Vites',
  FUEL_TYPE: 'Yakıt Tipi',
  SEATS: 'Koltuk Sayısı',
  MILEAGE: 'Kilometre',
  IS_AVAILABLE: 'Müsait mi?',

  // Form Seçenekleri
  SELECT_CATEGORY: 'Kategori Seçin',
  SELECT_TRANSMISSION: 'Vites Tipi Seçin',
  SELECT_FUEL_TYPE: 'Yakıt Tipi Seçin',
  
  // Kategori Seçenekleri
  ECONOMY: 'Ekonomi',
  STANDARD: 'Standart',
  LUXURY: 'Lüks',
  SUV: 'SUV',
  SPORT: 'Spor',
  VAN: 'Van',

  // Vites Seçenekleri
  MANUAL: 'Manuel',
  AUTOMATIC: 'Otomatik',

  // Yakıt Tipleri
  GASOLINE: 'Benzin',
  DIESEL: 'Dizel',
  ELECTRIC: 'Elektrik',
  HYBRID: 'Hibrit',

  // Butonlar
  EDIT: 'Düzenle',
  DELETE: 'Sil',
  CANCEL: 'İptal',
  SAVE: 'Kaydet',
  CREATE: 'Oluştur',

  // Durumlar
  AVAILABLE: 'Müsait',
  RENTED: 'Kirada',
  PER_DAY: 'gün',

  // Hata Mesajları
  ERROR_LOADING_CARS: 'Araçlar yüklenirken bir hata oluştu',
  ERROR_DELETE_CAR: 'Araç silinirken bir hata oluştu',
  ERROR_SAVE_CAR: 'Araç kaydedilirken bir hata oluştu',
  
  // Başarı Mesajları
  SUCCESS_DELETE_CAR: 'Araç başarıyla silindi',
  SUCCESS_CREATE_CAR: 'Araç başarıyla oluşturuldu',
  SUCCESS_UPDATE_CAR: 'Araç başarıyla güncellendi',

  // Onay Mesajları
  CONFIRM_DELETE_CAR: 'Bu aracı silmek istediğinizden emin misiniz?',

  // Ana Sayfa
  DAILY_TEXT: "Günlük",
  EXAMINE_BUTTON: "Detayları Gör",

  // Footer
  FOOTER_CONTACT: "İletişim",
  FOOTER_ADDRESS: "Adres",

  // Arama Filtreleri
  SEARCH_LABEL: "Araç Ara",
  SEARCH_PLACEHOLDER: "Marka veya model ara...",
  ALL_CATEGORIES: "Tüm Kategoriler",

  // Araç Detay
  LABEL_DAILY_PRICE: "Günlük Fiyat",
  LABEL_LICENSE_PLATE: "Plaka",
  LABEL_START_DATE: "Başlangıç Tarihi",
  LABEL_END_DATE: "Bitiş Tarihi",
  BUTTON_RENT_NOW: "Hemen Kirala",

  // Profil
  PROFILE_INFO: "Kişisel Bilgiler",
  PROFILE_RENTALS: "Kiralamalarım",
  LABEL_NAME: "Ad Soyad",
  LABEL_EMAIL: "Email",
  LABEL_PASSWORD: "Şifre",
  PLACEHOLDER_EMAIL: "Email adresiniz",
  PLACEHOLDER_PASSWORD: "Şifreniz",
  NO_RENTALS: "Henüz bir kiralama işleminiz bulunmuyor.",
  BUTTON_CANCEL_RENTAL: "İptal Et",

  // Admin Panel
  ADMIN_CARS: "Araçlar",
  ADMIN_RENTALS: "Kiralamalar",
  STATUS_PENDING: "Beklemede",
  STATUS_CONFIRMED: "Onaylandı",
  STATUS_COMPLETED: "Tamamlandı",
  STATUS_CANCELLED: "İptal Edildi",

  // Başarı Mesajları
  SUCCESS_LOGIN: "Başarıyla giriş yapıldı",
  SUCCESS_REGISTER: "Hesabınız başarıyla oluşturuldu",
  SUCCESS_RENTAL: "Araç kiralama işlemi başarılı",
  SUCCESS_RENTAL_CANCEL: "Kiralama işlemi iptal edildi",
  SUCCESS_RENTAL_UPDATE: "Kiralama durumu güncellendi",
  SUCCESS_CAR_DELETE: "Araç başarıyla silindi",

  // Hata Mesajları
  ERROR_LOGIN_FAILED: "Giriş başarısız",
  ERROR_REGISTER_FAILED: "Kayıt başarısız",
  ERROR_PASSWORD_MATCH: "Şifreler eşleşmiyor",
  ERROR_LOGIN_REQUIRED: "Bu işlem için giriş yapmanız gerekiyor",
  ERROR_DATES_REQUIRED: "Başlangıç ve bitiş tarihi seçmelisiniz",
  ERROR_INVALID_DATES: "Geçersiz tarih aralığı",
  ERROR_RENTAL_FAILED: "Kiralama işlemi başarısız",
  ERROR_RENTAL_CANCEL: "Kiralama iptali başarısız",
  ERROR_RENTAL_UPDATE: "Kiralama durumu güncellenemedi",
  ERROR_CAR_DELETE: "Araç silinemedi",
  ERROR_CAR_FETCH: "Araç bilgileri alınamadı",
  ERROR_CAR_NOT_FOUND: "Araç bulunamadı",
  ERROR_RENTALS_FETCH: "Kiralama bilgileri alınamadı",
  ERROR_ADMIN_DATA_FETCH: "Admin panel verileri alınamadı",

  // İletişim Sayfası
  CONTACT_TITLE: "Bize Ulaşın",
  CONTACT_SUBTITLE: "Herhangi bir sorunuz veya öneriniz için bizimle iletişime geçebilirsiniz.",
  CONTACT_INFO_TITLE: "İletişim Bilgilerimiz",
  CONTACT_INFO_DESC: "Aşağıdaki kanallardan bize ulaşabilirsiniz:",
  CONTACT_FORM_TITLE: "İletişim Formu",
  CONTACT_FORM_NAME: "Adınız Soyadınız",
  CONTACT_FORM_EMAIL: "E-posta Adresiniz",
  CONTACT_FORM_MESSAGE: "Mesajınız",
  CONTACT_FORM_SUBMIT: "Mesaj Gönder",
  CONTACT_SUCCESS: "Mesajınız başarıyla gönderildi",
  CONTACT_ERROR: "Mesajınız gönderilirken bir hata oluştu",
}; 