const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Site ayarlarını getir
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        siteName: 'RentaCar',
        siteDescription: 'Araç Kiralama Sistemi',
        siteUrl: process.env.SITE_URL || 'http://localhost:3000'
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Site ayarlarını güncelle (Admin)
router.put('/', protect, admin, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      settings = Object.assign(settings, req.body);
    }
    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Logo yükleme route'u
router.post('/upload-logo', protect, admin, upload.single('logo'), async (req, res) => {
  try {
    const logo = req.file;
    if (!logo) {
      return res.status(400).json({ message: 'Logo yüklemek için bir dosya göndermelisiniz' });
    }

    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        siteName: 'RentaCar',
        siteDescription: 'Araç Kiralama Sistemi',
        siteUrl: process.env.SITE_URL || 'http://localhost:3000',
        logo: logo.path
      });
    } else {
      settings.logo = logo.path;
    }

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 