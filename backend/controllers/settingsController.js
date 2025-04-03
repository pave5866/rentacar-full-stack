const Settings = require('../models/Settings');
const fs = require('fs');
const path = require('path');

// Varsayılan ayarlar
const DEFAULT_SETTINGS = {
  siteName: 'RentaCar',
  siteLogo: '/default-logo.svg', // Varsayılan logo
  siteDescription: 'Araç Kiralama Sistemi',
  companyPhone: '+90 555 555 55 55',
  companyEmail: 'info@rentacar.com',
  companyAddress: 'İstanbul, Türkiye',
  footerText: '© {year} {siteName}. Tüm hakları saklıdır.',
  siteUrl: 'http://localhost:5173',
  adminWhatsapp: '905555555555',
  socialMedia: {
    facebook: '',
    twitter: '',
    instagram: ''
  }
};

// Logo dosyasının varlığını kontrol et
const checkLogoExists = (logoPath) => {
  if (!logoPath) return false;
  const fullPath = path.join(__dirname, '..', logoPath.replace(/^\//, ''));
  return fs.existsSync(fullPath);
};

// @desc    Get settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = await Settings.create(DEFAULT_SETTINGS);
    }

    // Logo kontrolü
    if (settings.siteLogo && !settings.siteLogo.includes('default-logo.svg')) {
      const logoExists = checkLogoExists(settings.siteLogo);
      if (!logoExists) {
        settings.siteLogo = DEFAULT_SETTINGS.siteLogo;
        await settings.save();
      }
    }

    res.status(200).json(settings);
  } catch (error) {
    console.error('Ayarlar getirilirken hata:', error);
    res.status(500).json({ message: 'Ayarlar getirilemedi' });
  }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings(req.body);
    } else {
      settings = Object.assign(settings, req.body);
    }

    // Logo kontrolü
    if (settings.siteLogo && !settings.siteLogo.includes('default-logo.svg')) {
      const logoExists = checkLogoExists(settings.siteLogo);
      if (!logoExists) {
        settings.siteLogo = DEFAULT_SETTINGS.siteLogo;
      }
    }

    const updatedSettings = await settings.save();
    res.status(200).json(updatedSettings);
  } catch (error) {
    console.error('Ayarlar güncellenirken hata:', error);
    res.status(400).json({ 
      message: 'Ayarlar güncellenirken bir hata oluştu',
      error: error.message 
    });
  }
};

// @desc    Upload logo
// @route   POST /api/settings/upload-logo
// @access  Private/Admin
const uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Lütfen bir dosya seçin' });
    }

    // Eski logoyu sil
    let settings = await Settings.findOne();
    if (settings && settings.siteLogo && !settings.siteLogo.includes('default-logo.svg')) {
      const oldLogoPath = path.join(__dirname, '..', settings.siteLogo.replace(/^\//, ''));
      if (fs.existsSync(oldLogoPath)) {
        fs.unlinkSync(oldLogoPath);
      }
    }

    // Yeni logo yolunu kaydet
    const logoUrl = `/uploads/${req.file.filename}`;
    
    if (!settings) {
      settings = new Settings({ siteLogo: logoUrl });
    } else {
      settings.siteLogo = logoUrl;
    }
    
    await settings.save();
    
    res.status(200).json({ 
      message: 'Logo başarıyla yüklendi',
      logoUrl 
    });
  } catch (error) {
    console.error('Logo yüklenirken hata:', error);
    res.status(500).json({ message: 'Logo yüklenemedi' });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  uploadLogo
}; 