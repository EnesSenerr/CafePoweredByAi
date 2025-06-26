const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcryptjs');

// Ortam değişkenlerinden JWT secret alınır, yoksa fallback
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';
const JWT_EXPIRES_IN = '7d';

// Kullanıcıya JWT token üretir
function generateToken(user, rememberMe = false) {
  const expiresIn = rememberMe ? '30d' : JWT_EXPIRES_IN; // Beni hatırla seçilirse 30 gün
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn }
  );
}

// Kullanıcı kayıt
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, signupMethod, rememberMe } = req.body;
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
    
    const token = generateToken(user, rememberMe);
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
    const { email, password, rememberMe } = req.body;
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
    
    const token = generateToken(user, rememberMe);
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
    
    const response = {
      id: user._id,
      name: user.name, 
      email: user.email, 
      role: user.role, 
      points: user.points,
      phone: user.phone,
      birthDate: user.birthDate,
      profileImage: user.profileImage,
      preferences: user.preferences || {
        newsletter: true,
        smsNotifications: false,
        pushNotifications: true
      }
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Profil getirilirken hata oluştu.', error: error.message });
  }
};

// Kullanıcı profili güncelleme
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, birthDate, preferences } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    // E-posta değişikliği kontrolü
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanılıyor.' });
      }
    }

    // Güncellenecek alanları ayarla
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (birthDate !== undefined) user.birthDate = birthDate;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    user.updatedAt = new Date();
    await user.save();

    res.status(200).json({
      message: 'Profil başarıyla güncellendi.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
        phone: user.phone,
        birthDate: user.birthDate,
        profileImage: user.profileImage,
        preferences: user.preferences
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Profil güncellenirken hata oluştu.', error: error.message });
  }
};

// Profil resmi yükleme
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Resim dosyası bulunamadı.' });
    }

    console.log('Profil resmi yükleme - req.file:', req.file);

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    // Dosya yolunu kaydet (multer tarafından ayarlanır)
    const profileImageUrl = `/uploads/profiles/${req.file.filename}`;
    console.log('Profil resmi URL oluşturuldu:', profileImageUrl);
    
    user.profileImage = profileImageUrl;
    user.updatedAt = new Date();
    await user.save();

    console.log('Kullanıcı profil resmi kaydedildi:', user.profileImage);

    res.status(200).json({
      message: 'Profil resmi başarıyla güncellendi.',
      profileImageUrl
    });
  } catch (error) {
    console.error('Profil resmi yükleme hatası:', error);
    res.status(500).json({ message: 'Profil resmi yüklenirken hata oluştu.', error: error.message });
  }
};

// Şifre değiştirme
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Mevcut şifre ve yeni şifre zorunludur.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Yeni şifre en az 6 karakter olmalıdır.' });
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    // Mevcut şifre kontrolü
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mevcut şifre yanlış.' });
    }

    // Yeni şifreyi kaydet
    user.password = newPassword;
    user.updatedAt = new Date();
    await user.save();

    res.status(200).json({ message: 'Şifre başarıyla değiştirildi.' });
  } catch (error) {
    res.status(500).json({ message: 'Şifre değiştirilirken hata oluştu.', error: error.message });
  }
};

// Admin için kullanıcı listeleme (korumalı route)
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'id name email role points isActive createdAt phone lastLogin');
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Kullanıcılar listelenirken hata oluştu.', error: error.message });
  }
};

// Admin için kullanıcı oluşturma
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role = 'customer', phone, points = 0 } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Ad, e-posta ve şifre zorunludur.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Şifre en az 6 karakter olmalıdır.' });
    }

    // E-posta kontrolü
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanılıyor.' });
    }

    // Kullanıcı oluştur
    const user = new User({
      name,
      email,
      password,
      role,
      phone,
      points,
      signupMethod: 'admin',
      isActive: true
    });

    await user.save();

    res.status(201).json({
      message: 'Kullanıcı başarıyla oluşturuldu.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
        phone: user.phone,
        isActive: user.isActive,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Kullanıcı oluşturulurken hata oluştu.', error: error.message });
  }
};

// Admin için kullanıcı güncelleme
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, phone, points, isActive, password } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    // E-posta değişikliği kontrolü
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanılıyor.' });
      }
    }

    // Güncellenecek alanları ayarla
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (phone !== undefined) user.phone = phone;
    if (points !== undefined) user.points = points;
    if (isActive !== undefined) user.isActive = isActive;
    
    // Şifre güncellemesi
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Şifre en az 6 karakter olmalıdır.' });
      }
      user.password = password;
    }

    user.updatedAt = new Date();
    await user.save();

    res.status(200).json({
      message: 'Kullanıcı başarıyla güncellendi.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
        phone: user.phone,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Kullanıcı güncellenirken hata oluştu.', error: error.message });
  }
};

// Admin için kullanıcı silme
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Kendi hesabını silemesin
    if (id === req.user.id) {
      return res.status(400).json({ message: 'Kendi hesabınızı silemezsiniz.' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({ message: 'Kullanıcı başarıyla silindi.' });
  } catch (error) {
    res.status(500).json({ message: 'Kullanıcı silinirken hata oluştu.', error: error.message });
  }
};

// Admin için kullanıcı aktif/pasif durumu değiştirme
exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Kendi hesabının durumunu değiştiremesin
    if (id === req.user.id) {
      return res.status(400).json({ message: 'Kendi hesabınızın durumunu değiştiremezsiniz.' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    user.isActive = !user.isActive;
    user.updatedAt = new Date();
    await user.save();

    res.status(200).json({
      message: `Kullanıcı ${user.isActive ? 'aktif' : 'pasif'} duruma getirildi.`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Kullanıcı durumu değiştirilirken hata oluştu.', error: error.message });
  }
};

// Şifremi unuttum
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'E-posta adresi zorunludur.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı.' });
    }

    // Reset token oluştur
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Reset URL oluştur - Frontend URL'ini kullan
    const resetUrl = `http://localhost:3000/auth/reset-password/${resetToken}`;

    // Email HTML template
    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #8B4513; font-size: 24px;">AI Cafe</h1>
        </div>
        
        <div style="background-color: #f8f8f8; padding: 20px; border-radius: 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Şifre Sıfırlama Talebi</h2>
          
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            Merhaba ${user.name},
          </p>
          
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            Hesabınız için şifre sıfırlama talebinde bulundunuz. Aşağıdaki butona tıklayarak yeni şifrenizi belirleyebilirsiniz.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #8B4513; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block; font-weight: bold; cursor: pointer;" target="_blank">
              Şifremi Sıfırla
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.5;">
            Bu link 10 dakika süreyle geçerlidir. Eğer bu talebi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.
          </p>
          
          <p style="color: #999; font-size: 12px; margin-top: 20px;">
            Eğer butona tıklayamıyorsanız, aşağıdaki linki kopyalayıp tarayıcınızın adres çubuğuna yapıştırabilirsiniz:<br>
            ${resetUrl}
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          AI Cafe - Premium Kahve Deneyimi
        </div>
      </div>
    `;

    try {
      console.log('=== EMAIL GÖNDERME BAŞLIYOR ===');
      console.log('Alıcı email:', user.email);
      console.log('SMTP User:', process.env.SMTP_USER);
      console.log('SMTP Host:', process.env.SMTP_HOST);
      console.log('SMTP Port:', process.env.SMTP_PORT);
      
      await sendEmail({
        email: user.email,
        subject: 'AI Cafe - Şifre Sıfırlama',
        message,
      });

      console.log('Email başarıyla gönderildi!');
      res.status(200).json({ message: 'Şifre sıfırlama linki e-posta adresinize gönderildi.' });
    } catch (err) {
      console.error('Email gönderme hatası:');
      console.error('Error name:', err.name);
      console.error('Error message:', err.message);
      console.error('Error code:', err.code);
      console.error('Full error:', err);
      
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ message: 'E-posta gönderilemedi. Lütfen daha sonra tekrar deneyin.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Şifre sıfırlama işlemi sırasında hata oluştu.', error: error.message });
  }
};

// Şifre sıfırlama
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Yeni şifre zorunludur.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Şifre en az 6 karakter olmalıdır.' });
    }

    // Token'ı hashle
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Token ve expiry kontrolü
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Geçersiz veya süresi dolmuş token.' });
    }

    // Yeni şifreyi kaydet
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Şifreniz başarıyla güncellendi. Giriş yapabilirsiniz.' });
  } catch (error) {
    res.status(500).json({ message: 'Şifre sıfırlama işlemi sırasında hata oluştu.', error: error.message });
  }
}; 