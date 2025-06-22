import { useAuth } from '../contexts/AuthContext';

export const useRole = () => {
  const { user } = useAuth();

  const isCustomer = () => user?.role === 'customer';
  const isEmployee = () => user?.role === 'employee';
  const isAdmin = () => user?.role === 'admin';
  
  const hasRole = (role: 'customer' | 'employee' | 'admin') => user?.role === role;
  
  const hasAnyRole = (roles: ('customer' | 'employee' | 'admin')[]) => 
    user?.role ? roles.includes(user.role) : false;

  const canAccessCustomer = () => hasAnyRole(['customer', 'employee', 'admin']);
  const canAccessEmployee = () => hasAnyRole(['employee', 'admin']);
  const canAccessAdmin = () => hasRole('admin');

  return {
    user,
    isCustomer,
    isEmployee,
    isAdmin,
    hasRole,
    hasAnyRole,
    canAccessCustomer,
    canAccessEmployee,
    canAccessAdmin,
    userRole: user?.role
  };
}; 