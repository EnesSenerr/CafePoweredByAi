const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Ortam değişkenlerinden JWT secret alınır, yoksa fallback
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';
const JWT_EXPIRES_IN = '7d';

// Kullanıcıya JWT token üretir
function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// Kullanıcı kayıt
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, signupMethod } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'İsim, e-posta ve şifre zorunludur.' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Bu e-posta ile zaten bir kullanıcı var.' });
    }
    
    // Signup method'u belirle (mobil veya web)
    const method = signupMethod || (req.headers['user-agent']?.includes('Expo') ? 'mobile' : 'email');
    
    const user = await User.create({ 
      name, 
      email, 
      password, 
      phone,
      signupMethod: method
    });
    
    // Son giriş zamanını güncelle
    user.lastLogin = new Date();
    await user.save();
    
    const token = generateToken(user);
    res.status(201).json({
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        phone: user.phone,
        role: user.role,
        points: user.points
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Kayıt sırasında hata oluştu.', error: error.message });
  }
};

// Kullanıcı giriş
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'E-posta ve şifre zorunludur.' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Geçersiz e-posta veya şifre.' });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Geçersiz e-posta veya şifre.' });
    }
    
    // Son giriş zamanını güncelle
    user.lastLogin = new Date();
    await user.save();
    
    const token = generateToken(user);
    res.status(200).json({
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        phone: user.phone,
        role: user.role,
        points: user.points
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Giriş sırasında hata oluştu.', error: error.message });
  }
};

// Kullanıcı profilini getir (korumalı route için)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }
    res.status(200).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role, points: user.points },
    });
  } catch (error) {
    res.status(500).json({ message: 'Profil getirilirken hata oluştu.', error: error.message });
  }
};

// Admin için kullanıcı listeleme (korumalı route)
exports.listUsers = async (req, res) => {
  try {
    // Sadece admin erişebilir
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Yetkisiz erişim.' });
    }
    const users = await User.find({}, 'id name email role points isActive createdAt');
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Kullanıcılar listelenirken hata oluştu.', error: error.message });
  }
}; 