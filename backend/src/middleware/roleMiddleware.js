const User = require('../models/User');

// Specific role check middleware
const requireRole = (role) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
      }

      if (user.role !== role) {
        return res.status(403).json({ 
          message: 'Bu işlem için yetkiniz bulunmuyor.',
          required: role,
          current: user.role
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({ message: 'Rol doğrulama hatası.' });
    }
  };
};

// Multiple role check middleware
const requireAnyRole = (roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({ 
          message: 'Bu işlem için yetkiniz bulunmuyor.',
          required: roles,
          current: user.role
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({ message: 'Rol doğrulama hatası.' });
    }
  };
};

// Hierarchical role check (admin > employee > customer)
const requireMinRole = (minRole) => {
  const roleHierarchy = {
    'customer': 1,
    'employee': 2,
    'admin': 3
  };

  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
      }

      const userRoleLevel = roleHierarchy[user.role] || 0;
      const requiredRoleLevel = roleHierarchy[minRole] || 0;

      if (userRoleLevel < requiredRoleLevel) {
        return res.status(403).json({ 
          message: 'Bu işlem için yetkiniz bulunmuyor.',
          required: minRole,
          current: user.role
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({ message: 'Rol doğrulama hatası.' });
    }
  };
};

module.exports = {
  requireRole,
  requireAnyRole,
  requireMinRole
}; 