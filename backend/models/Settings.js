const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'RentaCar'
  },
  siteLogo: {
    type: String
  },
  siteDescription: {
    type: String,
    default: 'Araç Kiralama Sistemi'
  },
  companyEmail: {
    type: String,
    default: 'info@rentacar.com'
  },
  adminEmail: {  // Admin'in kişisel email adresi
    type: String,
    default: ''
  },
  // SMTP Ayarları (Yorum satırında bekleyecek)
  /*
  smtpSettings: {
    host: String,
    port: Number,
    secure: Boolean,
    auth: {
      user: String,
      pass: String
    }
  },
  */
  companyPhone: {
    type: String,
    default: ''
  },
  adminWhatsapp: {
    type: String,
    default: ''
  },
  companyAddress: {
    type: String,
    default: ''
  },
  footerText: {
    type: String,
    required: [true, 'Footer metni zorunludur'],
    default: '© {year} {siteName}. Tüm hakları saklıdır.'
  },
  siteUrl: {
    type: String,
    required: [true, 'Site URL zorunludur']
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String
  },
  texts: {
    // Başlıklar
    homeTitle: {
      type: String,
      default: "En İyi Araçlar, En Uygun Fiyatlar"
    },
    homeSubtitle: {
      type: String,
      default: "İhtiyacınıza uygun aracı hemen kiralayın"
    },
    profileTitle: {
      type: String,
      default: "Profilim"
    },
    adminDashboard: {
      type: String,
      default: "Admin Panel"
    },
    
    // Butonlar
    rentNow: {
      type: String,
      default: "Hemen Kirala"
    },
    examine: {
      type: String,
      default: "Detayları Gör"
    },
    save: {
      type: String,
      default: "Kaydet"
    },
    cancel: {
      type: String,
      default: "İptal"
    },
    delete: {
      type: String,
      default: "Sil"
    },
    edit: {
      type: String,
      default: "Düzenle"
    },
    create: {
      type: String,
      default: "Oluştur"
    },
    
    // Mesajlar
    successSave: {
      type: String,
      default: "Başarıyla kaydedildi"
    },
    successUpdate: {
      type: String,
      default: "Başarıyla güncellendi"
    },
    successDelete: {
      type: String,
      default: "Başarıyla silindi"
    },
    errorSave: {
      type: String,
      default: "Kaydedilirken bir hata oluştu"
    },
    errorUpdate: {
      type: String,
      default: "Güncellenirken bir hata oluştu"
    },
    errorDelete: {
      type: String,
      default: "Silinirken bir hata oluştu"
    },
    
    // Form Etiketleri
    labelName: {
      type: String,
      default: "Ad Soyad"
    },
    labelEmail: {
      type: String,
      default: "E-posta"
    },
    labelPhone: {
      type: String,
      default: "Telefon"
    },
    labelAddress: {
      type: String,
      default: "Adres"
    },
    labelPassword: {
      type: String,
      default: "Şifre"
    },
    
    // Araç Özellikleri
    transmission: {
      manual: {
        type: String,
        default: "Manuel"
      },
      automatic: {
        type: String,
        default: "Otomatik"
      }
    },
    fuelType: {
      gasoline: {
        type: String,
        default: "Benzin"
      },
      diesel: {
        type: String,
        default: "Dizel"
      },
      electric: {
        type: String,
        default: "Elektrik"
      },
      hybrid: {
        type: String,
        default: "Hibrit"
      }
    },
    category: {
      economy: {
        type: String,
        default: "Ekonomi"
      },
      standard: {
        type: String,
        default: "Standart"
      },
      luxury: {
        type: String,
        default: "Lüks"
      },
      sports: {
        type: String,
        default: "Spor"
      },
      suv: {
        type: String,
        default: "SUV"
      },
      van: {
        type: String,
        default: "Van"
      }
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema); 