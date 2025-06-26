import React, { useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, StyleSheet, Image, Linking } from 'react-native';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
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
import AboutScreen from '../screens/AboutScreen';
import LoyaltyProgramScreen from '../screens/LoyaltyProgramScreen';
import HomeScreen from '../screens/HomeScreen';
import ContactScreen from '../screens/ContactScreen';
import UserManagementScreen from '../screens/UserManagementScreen';
import MenuManagementScreen from '../screens/MenuManagementScreen';
import OrderManagementScreen from '../screens/OrderManagementScreen';
import ReportsScreen from '../screens/ReportsScreen';
import StockManagementScreen from '../screens/StockManagementScreen';

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
  Home: undefined;
  Menu: undefined;
  Favorites: undefined;
  Dashboard: undefined;
  LoyaltyProgram: undefined;
  More: undefined;
  AdminDashboard?: undefined;
  EmployeeDashboard?: undefined;
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
const MoreScreen = ({ navigation }: any) => {
  const { logout, isAuthenticated, isLoading, user } = useAuth();
  const { isAdmin, isEmployee } = useRole();
  return (
    <ScrollView style={moreStyles.container} contentContainerStyle={moreStyles.content}>
      <Text style={moreStyles.header}>Daha Fazla</Text>
      <View style={moreStyles.section}>
        <Text style={moreStyles.sectionTitle}>Sayfalar</Text>
        {!isAuthenticated && !isLoading && (
          <>
            <TouchableOpacity style={moreStyles.card} onPress={() => navigation.navigate('Login')}>
              <Text style={moreStyles.cardIcon}>🔑</Text>
              <View style={{ flex: 1 }}>
                <Text style={moreStyles.cardText}>Giriş Yap</Text>
                <Text style={moreStyles.cardDesc}>Hesabınıza giriş yapın</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={moreStyles.card} onPress={() => navigation.navigate('Register')}>
              <Text style={moreStyles.cardIcon}>📝</Text>
              <View style={{ flex: 1 }}>
                <Text style={moreStyles.cardText}>Kayıt Ol</Text>
                <Text style={moreStyles.cardDesc}>Yeni hesap oluşturun</Text>
              </View>
            </TouchableOpacity>
          </>
        )}
        {isAuthenticated && !isLoading && (
          <>
            <TouchableOpacity style={moreStyles.card} onPress={() => navigation.navigate('Profile')}>
              <Text style={moreStyles.cardIcon}>👤</Text>
              <View style={{ flex: 1 }}>
                <Text style={moreStyles.cardText}>Profilim</Text>
                <Text style={moreStyles.cardDesc}>Hesap bilgilerinizi görüntüleyin</Text>
              </View>
            </TouchableOpacity>
            {isEmployee() && (
              <TouchableOpacity style={moreStyles.card} onPress={() => navigation.navigate('EmployeeDashboard')}>
                <Text style={moreStyles.cardIcon}>👩‍💻</Text>
                <View style={{ flex: 1 }}>
                  <Text style={moreStyles.cardText}>Çalışan Paneli</Text>
                  <Text style={moreStyles.cardDesc}>Sipariş ve stok yönetimi</Text>
                </View>
              </TouchableOpacity>
            )}
            {isAdmin() && (
              <TouchableOpacity style={moreStyles.card} onPress={() => navigation.navigate('AdminDashboard')}>
                <Text style={moreStyles.cardIcon}>👨‍💼</Text>
                <View style={{ flex: 1 }}>
                  <Text style={moreStyles.cardText}>Admin Paneli</Text>
                  <Text style={moreStyles.cardDesc}>Yönetici işlemleri</Text>
                </View>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={moreStyles.card} onPress={async () => { await logout(); navigation.replace('MainTabs'); }}>
              <Text style={moreStyles.cardIcon}>🚪</Text>
              <View style={{ flex: 1 }}>
                <Text style={moreStyles.cardText}>Çıkış Yap</Text>
                <Text style={moreStyles.cardDesc}>Hesabınızdan çıkış yapın</Text>
              </View>
            </TouchableOpacity>
          </>
        )}
      </View>
      <Text style={moreStyles.footer}>© 2024 AI Cafe. Tüm hakları saklıdır.</Text>
    </ScrollView>
  );
};

const moreStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFAF0', // Webdeki gibi açık krem
  },
  content: {
    padding: 0,
    paddingBottom: 32,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ea580c',
    fontFamily: 'serif',
    marginTop: 32,
    marginBottom: 12,
    textAlign: 'center',
  },
  section: {
    marginBottom: 28,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#42301D',
    marginBottom: 12,
    fontFamily: 'serif',
  },
  cardList: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  cardIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  cardText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1e293b',
  },
  cardDesc: {
    color: '#64748b',
    fontSize: 13,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  contactIcon: {
    fontSize: 18,
    marginRight: 8,
    color: '#997049',
  },
  contactText: {
    color: '#42301D',
    fontSize: 15,
  },
  socialRow: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 4,
  },
  socialIcon: {
    marginRight: 16,
  },
  footer: {
    textAlign: 'center',
    color: '#bfae9c',
    fontSize: 13,
    marginTop: 16,
    marginBottom: 12,
  },
  logoutButton: {
    backgroundColor: '#f97316',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginHorizontal: 32,
    marginTop: 16,
    marginBottom: 8,
    elevation: 2,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
});

// Tab Navigator Component
const MainTabs = () => {
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
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Ana Sayfa',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>🏠</Text>,
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
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>💖</Text>,
        }}
      />
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>📊</Text>,
        }}
      />
      <Tab.Screen 
        name="LoyaltyProgram" 
        component={LoyaltyProgramScreen}
        options={{
          tabBarLabel: 'Sadakat',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>💎</Text>,
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

const linking: LinkingOptions<any> = {
  prefixes: ['cafepoweredbyai://', 'https://cafepoweredbyai.com'],
  config: {
    screens: {
      Login: 'login',
      Register: 'register',
      ForgotPassword: 'forgot-password',
      Dashboard: 'dashboard',
      Menu: 'menu',
      Favorites: 'favorites',
      Profile: 'profile',
      MenuDetail: 'menu/:itemId',
      OrderDetail: 'order/:orderId',
      RewardsDetail: 'rewards/:rewardId',
      Settings: 'settings',
      Notifications: 'notifications',
      Reports: 'reports',
      StockManagement: 'stock',
      // Diğer route'lar da eklenebilir
    },
  },
};

const AppNavigator = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    // Loading screen could be added here
    return null;
  }

  return (
    <NavigationContainer linking={linking}>
      <AndroidBackHandler />
      <Stack.Navigator 
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
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
        <Stack.Screen name="UserManagement" component={UserManagementScreen} />
        <Stack.Screen name="MenuManagement" component={MenuManagementScreen} />
        <Stack.Screen name="OrderManagement" component={OrderManagementScreen} />
        <Stack.Screen name="Reports" component={ReportsScreen} />
        <Stack.Screen name="StockManagement" component={StockManagementScreen} />
        <Stack.Screen name="OrderProcessing" component={PlaceholderScreen} />
        <Stack.Screen name="PaymentProcessing" component={PlaceholderScreen} />
        <Stack.Screen name="CustomerService" component={PlaceholderScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="LoyaltyProgram" component={LoyaltyProgramScreen} />
        <Stack.Screen name="Contact" component={ContactScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 