import { useAuth } from '../contexts/AuthContext';

export type UserRole = 'customer' | 'employee' | 'admin';

export interface RolePermissions {
  canViewAdminPanel: boolean;
  canViewEmployeePanel: boolean;
  canManageUsers: boolean;
  canManageMenu: boolean;
  canManageOrders: boolean;
  canViewReports: boolean;
  canManageStock: boolean;
  canManageRewards: boolean;
  canProcessPayments: boolean;
  canModifyPrices: boolean;
}

export const useRole = () => {
  const { user } = useAuth();

  const getUserRole = (): UserRole => {
    if (!user) return 'customer';
    return (user.role as UserRole) || 'customer';
  };

  const getPermissions = (role?: UserRole): RolePermissions => {
    const userRole = role || getUserRole();

    switch (userRole) {
      case 'admin':
        return {
          canViewAdminPanel: true,
          canViewEmployeePanel: true,
          canManageUsers: true,
          canManageMenu: true,
          canManageOrders: true,
          canViewReports: true,
          canManageStock: true,
          canManageRewards: true,
          canProcessPayments: true,
          canModifyPrices: true,
        };

      case 'employee':
        return {
          canViewAdminPanel: false,
          canViewEmployeePanel: true,
          canManageUsers: false,
          canManageMenu: false,
          canManageOrders: true,
          canViewReports: false,
          canManageStock: true,
          canManageRewards: false,
          canProcessPayments: true,
          canModifyPrices: false,
        };

      case 'customer':
      default:
        return {
          canViewAdminPanel: false,
          canViewEmployeePanel: false,
          canManageUsers: false,
          canManageMenu: false,
          canManageOrders: false,
          canViewReports: false,
          canManageStock: false,
          canManageRewards: false,
          canProcessPayments: false,
          canModifyPrices: false,
        };
    }
  };

  const hasPermission = (permission: keyof RolePermissions): boolean => {
    const permissions = getPermissions();
    return permissions[permission];
  };

  const hasRole = (requiredRole: UserRole | UserRole[]): boolean => {
    const userRole = getUserRole();
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(userRole);
    }
    
    return userRole === requiredRole;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    const userRole = getUserRole();
    return roles.includes(userRole);
  };

  const isAdmin = (): boolean => {
    return getUserRole() === 'admin';
  };

  const isEmployee = (): boolean => {
    return getUserRole() === 'employee';
  };

  const isCustomer = (): boolean => {
    return getUserRole() === 'customer';
  };

  const canAccessAdminPanel = (): boolean => {
    return hasPermission('canViewAdminPanel');
  };

  const canAccessEmployeePanel = (): boolean => {
    return hasPermission('canViewEmployeePanel');
  };

  const canManageUsers = (): boolean => {
    return hasPermission('canManageUsers');
  };

  const canManageMenu = (): boolean => {
    return hasPermission('canManageMenu');
  };

  const canManageOrders = (): boolean => {
    return hasPermission('canManageOrders');
  };

  const canViewReports = (): boolean => {
    return hasPermission('canViewReports');
  };

  const canManageStock = (): boolean => {
    return hasPermission('canManageStock');
  };

  const canManageRewards = (): boolean => {
    return hasPermission('canManageRewards');
  };

  const getRoleDisplayName = (role?: UserRole): string => {
    const userRole = role || getUserRole();
    
    switch (userRole) {
      case 'admin':
        return 'Yönetici';
      case 'employee':
        return 'Çalışan';
      case 'customer':
      default:
        return 'Müşteri';
    }
  };

  const getRoleColor = (role?: UserRole): string => {
    const userRole = role || getUserRole();
    
    switch (userRole) {
      case 'admin':
        return '#dc2626'; // red-600
      case 'employee':
        return '#2563eb'; // blue-600
      case 'customer':
      default:
        return '#16a34a'; // green-600
    }
  };

  return {
    // Core role functions
    getUserRole,
    getPermissions,
    hasPermission,
    hasRole,
    hasAnyRole,
    
    // Role checkers
    isAdmin,
    isEmployee,
    isCustomer,
    
    // Permission checkers
    canAccessAdminPanel,
    canAccessEmployeePanel,
    canManageUsers,
    canManageMenu,
    canManageOrders,
    canViewReports,
    canManageStock,
    canManageRewards,
    
    // Display helpers
    getRoleDisplayName,
    getRoleColor,
  };
}; 