import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { useRole, UserRole } from '../../hooks/useRole';
import { ErrorState } from '../ui';

interface RoleGuardProps {
  children: ReactNode;
  requiredRole?: UserRole | UserRole[];
  requiredPermission?: string;
  fallback?: ReactNode;
  redirect?: boolean;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  requiredRole,
  requiredPermission,
  fallback,
  redirect = false,
}) => {
  const { 
    hasRole, 
    hasPermission, 
    getUserRole, 
    getRoleDisplayName 
  } = useRole();

  // Check role requirement
  const hasRequiredRole = requiredRole ? hasRole(requiredRole) : true;

  // Check permission requirement  
  const hasRequiredPermission = requiredPermission ? 
    hasPermission(requiredPermission as any) : true;

  // If user has required access, render children
  if (hasRequiredRole && hasRequiredPermission) {
    return <>{children}</>;
  }

  // If fallback component provided, render it
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default access denied component
  const currentRole = getUserRole();
  const currentRoleDisplay = getRoleDisplayName();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <ErrorState
        title="Erişim Reddedildi"
        message={`Bu sayfaya erişim için yeterli yetkiniz bulunmuyor.\n\nMevcut rolünüz: ${currentRoleDisplay}`}
        retryText="Geri Dön"
        onRetry={() => {
          // Navigation back logic could be added here
          console.log('Access denied - going back');
        }}
      />
    </View>
  );
};

// HOC (Higher Order Component) version
export const withRoleGuard = <P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: UserRole | UserRole[],
  requiredPermission?: string
) => {
  return (props: P) => (
    <RoleGuard 
      requiredRole={requiredRole} 
      requiredPermission={requiredPermission}
    >
      <Component {...props} />
    </RoleGuard>
  );
};

// Admin Only Guard
export const AdminGuard: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <RoleGuard requiredRole="admin" fallback={fallback}>
    {children}
  </RoleGuard>
);

// Employee or Admin Guard  
export const EmployeeGuard: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <RoleGuard requiredRole={['employee', 'admin']} fallback={fallback}>
    {children}
  </RoleGuard>
);

// Permission-based guards
export const CanManageUsersGuard: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <RoleGuard requiredPermission="canManageUsers" fallback={fallback}>
    {children}
  </RoleGuard>
);

export const CanManageMenuGuard: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <RoleGuard requiredPermission="canManageMenu" fallback={fallback}>
    {children}
  </RoleGuard>
);

export const CanManageOrdersGuard: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <RoleGuard requiredPermission="canManageOrders" fallback={fallback}>
    {children}
  </RoleGuard>
);

export const CanViewReportsGuard: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <RoleGuard requiredPermission="canViewReports" fallback={fallback}>
    {children}
  </RoleGuard>
);

export const CanManageStockGuard: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <RoleGuard requiredPermission="canManageStock" fallback={fallback}>
    {children}
  </RoleGuard>
); 