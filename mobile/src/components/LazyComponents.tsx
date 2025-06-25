import React, { Suspense, ComponentType } from 'react';
import { LoadingState } from './ui';

// Generic lazy wrapper with loading state
export const withLazyLoading = <P extends object>(
  Component: React.LazyExoticComponent<ComponentType<P>>,
  fallback?: React.ReactNode
) => {
  return (props: P) => (
    <Suspense fallback={fallback || <LoadingState />}>
      <Component {...props} />
    </Suspense>
  );
};

// Lazy loaded screens for bundle optimization
export const LazyAdminDashboard = React.lazy(() => import('../screens/AdminDashboardScreen'));
export const LazyEmployeeDashboard = React.lazy(() => import('../screens/EmployeeDashboardScreen'));
export const LazyUserManagement = React.lazy(() => import('../screens/UserManagementScreen'));
export const LazyOrderProcessing = React.lazy(() => import('../screens/OrderProcessingScreen'));
export const LazyMenuDetail = React.lazy(() => import('../screens/MenuDetailScreen'));
export const LazyOrderDetail = React.lazy(() => import('../screens/OrderDetailScreen'));
export const LazyRewardsDetail = React.lazy(() => import('../screens/RewardsDetailScreen'));
export const LazyTransactionDetail = React.lazy(() => import('../screens/TransactionDetailScreen'));
export const LazyNotifications = React.lazy(() => import('../screens/NotificationsScreen'));
export const LazySettings = React.lazy(() => import('../screens/SettingsScreen'));

// Wrapped components with loading fallback
export const AdminDashboardLazy = withLazyLoading(
  LazyAdminDashboard,
  <LoadingState message="Admin paneli yükleniyor..." />
);

export const EmployeeDashboardLazy = withLazyLoading(
  LazyEmployeeDashboard,
  <LoadingState message="Çalışan paneli yükleniyor..." />
);

export const UserManagementLazy = withLazyLoading(
  LazyUserManagement,
  <LoadingState message="Kullanıcı yönetimi yükleniyor..." />
);

export const OrderProcessingLazy = withLazyLoading(
  LazyOrderProcessing,
  <LoadingState message="Sipariş işleme yükleniyor..." />
);

export const MenuDetailLazy = withLazyLoading(
  LazyMenuDetail,
  <LoadingState message="Menü detayı yükleniyor..." />
);

export const OrderDetailLazy = withLazyLoading(
  LazyOrderDetail,
  <LoadingState message="Sipariş detayı yükleniyor..." />
);

export const RewardsDetailLazy = withLazyLoading(
  LazyRewardsDetail,
  <LoadingState message="Ödül detayı yükleniyor..." />
);

export const TransactionDetailLazy = withLazyLoading(
  LazyTransactionDetail,
  <LoadingState message="İşlem detayı yükleniyor..." />
);

export const NotificationsLazy = withLazyLoading(
  LazyNotifications,
  <LoadingState message="Bildirimler yükleniyor..." />
);

export const SettingsLazy = withLazyLoading(
  LazySettings,
  <LoadingState message="Ayarlar yükleniyor..." />
);

// Export all lazy components
export default {
  AdminDashboardLazy,
  EmployeeDashboardLazy,
  UserManagementLazy,
  OrderProcessingLazy,
  MenuDetailLazy,
  OrderDetailLazy,
  RewardsDetailLazy,
  TransactionDetailLazy,
  NotificationsLazy,
  SettingsLazy,
}; 