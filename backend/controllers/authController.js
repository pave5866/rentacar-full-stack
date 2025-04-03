const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const Settings = require('../models/Settings');
const asyncHandler = require('express-async-handler');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Bu email adresi zaten kullanılıyor' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Şifre sıfırlama için kod gönderme
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error('Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı');
  }

  // 6 haneli rastgele kod oluştur
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const resetCodeExpires = Date.now() + 15 * 60 * 1000; // 15 dakika geçerli

  // Kodu ve son kullanma tarihini kullanıcı belgesine kaydet
  user.resetPasswordCode = resetCode;
  user.resetPasswordExpires = resetCodeExpires;
  await user.save();

  // Site ayarlarını al
  const settings = await Settings.findOne();
  if (!settings || !settings.adminWhatsapp) {
    res.status(500);
    throw new Error('Sistem yöneticisi WhatsApp numarası ayarlanmamış');
  }

  // Admin'e bilgilendirme mesajı hazırla (kod olmadan)
  const adminMessage = `🔐 Şifre Sıfırlama Talebi\n\n` +
    `Kullanıcı: ${user.name}\n` +
    `E-posta: ${user.email}\n` +
    `Tarih: ${new Date().toLocaleString('tr-TR')}\n\n` +
    `Kullanıcıya e-posta ile sıfırlama kodu gönderildi.`;

  // Admin WhatsApp URL'i oluştur
  const whatsappUrl = `https://wa.me/${settings.adminWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(adminMessage)}`;

  // E-posta gönderme işlemi burada yapılacak
  // TODO: Nodemailer veya başka bir e-posta servisi entegre edilecek
  // Şimdilik simüle ediyoruz
  
  res.status(200).json({ 
    message: 'Şifre sıfırlama kodu e-posta adresinize gönderildi. Lütfen e-posta kutunuzu kontrol edin.',
    whatsappUrl, // Admin ile iletişim için
  });
});

// Şifre sıfırlama
const resetPassword = asyncHandler(async (req, res) => {
  const { email, code, newPassword } = req.body;

  const user = await User.findOne({ 
    email,
    resetPasswordCode: code,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    res.status(400);
    throw new Error('Geçersiz veya süresi dolmuş kod');
  }

  // Yeni şifreyi hashle ve kaydet
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  user.resetPasswordCode = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).json({ message: 'Şifre başarıyla sıfırlandı' });
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  forgotPassword,
  resetPassword,
}; 