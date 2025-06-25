import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MenuScreen from '../screens/MenuScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import MenuDetailScreen from '../screens/MenuDetailScreen';
import CartScreen from '../screens/CartScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import RewardsDetailScreen from '../screens/RewardsDetailScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import TransactionDetailScreen from '../screens/TransactionDetailScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import EmployeeDashboardScreen from '../screens/EmployeeDashboardScreen';
import AuthGuard from './AuthGuard';
import { useAuth } from '../contexts/AuthContext';
import { useRole } from '../hooks/useRole';
import { AndroidBackHandler } from '../components/PlatformSpecific';

// Navigation stack tiplerini tanımla - Web ile uyumlu
export type RootStackParamList = {
  // Auth pages
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  
  // Main structure
  MainTabs: undefined;
  Dashboard: undefined;
  Menu: undefined;
  Favorites: undefined;
  More: undefined;
  
  // Role specific dashboards
  AdminDashboard: undefined;
  EmployeeDashboard: undefined;
  
  // Menu related
  MenuDetail: { itemId: string };
  
  // Order related
  Cart: undefined;
  OrderHistory: undefined;
  OrderDetail: { orderId: string };
  
  // Profile related - Web ile uyumlu
  Profile: undefined;
  Settings: undefined;
  Orders: undefined; // Web: hesabim/siparisler
  Rewards: undefined; // Web: hesabim/oduller
  Points: undefined; // Web: hesabim/profil gibi sayfalara uyumlu
  
  // Details
  RewardsDetail: { rewardId: string };
  TransactionDetail: { transactionId: string };
  
  // Notifications
  Notifications: undefined;
  
  // Admin/Employee features
  UserManagement: undefined;
  MenuManagement: undefined;
  OrderManagement: undefined;
  Reports: undefined;
  StockManagement: undefined;
  OrderProcessing: undefined;
  PaymentProcessing: undefined;
  CustomerService: undefined;
  
  // About sections - Web ile uyumlu
  About: undefined; // Web: hakkimizda
  Contact: undefined; // Web: iletisim
  LoyaltyProgram: undefined; // Web: sadakat-programi
};

export type TabParamList = {
  Dashboard: undefined;
  Menu: undefined;
  Favorites: undefined;
  More: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Smart Dashboard Component - Role'e göre doğru dashboard'u gösterir
const SmartDashboard = () => {
  const { isAdmin, isEmployee } = useRole();
  
  if (isAdmin()) {
    return <AdminDashboardScreen />;
  } else if (isEmployee()) {
    return <EmployeeDashboardScreen />;
  } else {
    return <DashboardScreen navigation={{} as any} route={{} as any} />;
  }
};

// Placeholder component for future screens
const PlaceholderScreen = () => <NotificationsScreen navigation={{} as any} route={{} as any} />;

// More Screen Component
const MoreScreen = () => {
  return <ProfileScreen navigation={{} as any} route={{} as any} />;
};

// Tab Navigator Component
const MainTabs = () => {
  const { isAdmin, isEmployee } = useRole();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#f97316',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={SmartDashboard}
        options={{
          tabBarLabel: isAdmin() ? 'Admin Panel' : isEmployee() ? 'Çalışan Panel' : 'Ana Sayfa',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>
            {isAdmin() ? '👨‍💼' : isEmployee() ? '👩‍💻' : '🏠'}
          </Text>,
        }}
      />
      <Tab.Screen 
        name="Menu" 
        component={MenuScreen}
        options={{
          tabBarLabel: 'Menü',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>🍽️</Text>,
        }}
      />
      <Tab.Screen 
        name="Favorites" 
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favoriler',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>❤️</Text>,
        }}
      />
      <Tab.Screen 
        name="More" 
        component={MoreScreen}
        options={{
          tabBarLabel: 'Daha Fazla',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>⚙️</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Loading screen could be added here
    return null;
  }

  return (
    <NavigationContainer>
      <AndroidBackHandler />
      <Stack.Navigator 
        screenOptions={{ headerShown: false }}
      >
        {!isAuthenticated ? (
          // Auth Screens - Giriş yapmamış kullanıcılar
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        ) : (
          // Protected Screens - Giriş yapmış kullanıcılar
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="Menu" component={MenuScreen} />
            <Stack.Screen name="Favorites" component={FavoritesScreen} />
            <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
            <Stack.Screen name="EmployeeDashboard" component={EmployeeDashboardScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="MenuDetail" component={MenuDetailScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
            <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="RewardsDetail" component={RewardsDetailScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
            
            {/* Placeholder screens for future implementation */}
            <Stack.Screen name="UserManagement" component={PlaceholderScreen} />
            <Stack.Screen name="MenuManagement" component={PlaceholderScreen} />
            <Stack.Screen name="OrderManagement" component={PlaceholderScreen} />
            <Stack.Screen name="Reports" component={PlaceholderScreen} />
            <Stack.Screen name="StockManagement" component={PlaceholderScreen} />
            <Stack.Screen name="OrderProcessing" component={PlaceholderScreen} />
            <Stack.Screen name="PaymentProcessing" component={PlaceholderScreen} />
            <Stack.Screen name="CustomerService" component={PlaceholderScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 