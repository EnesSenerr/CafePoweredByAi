import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AdminGuard } from '../components/navigation/RoleGuard';
import { CustomCard, CustomButton, LoadingState, EmptyState } from '../components/ui';
import { useRole } from '../hooks/useRole';
import { lightHaptic } from '../utils/haptics';
import { getAllUsers, toggleUserStatus as apiToggleUserStatus, deleteUser as apiDeleteUser } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'employee' | 'admin';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
}

const UserManagementScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { getRoleDisplayName, getRoleColor } = useRole();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | 'customer' | 'employee' | 'admin'>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!token) throw new Error('Yetkilendirme hatası: Token bulunamadı');
      const response = await getAllUsers(token);
      // API'den dönen veri ile users state'ini güncelle
      setUsers(response.data || []);
    } catch (err: any) {
      setError(err.message || 'Kullanıcılar yüklenemedi');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadUsers();
  };

  const handleUserAction = async (user: User, action: 'edit' | 'toggle' | 'delete') => {
    await lightHaptic();
    switch (action) {
      case 'edit':
        // TODO: Navigate to user edit screen
        Alert.alert('Düzenle', `${user.name} kullanıcısını düzenle`);
        break;
      case 'toggle':
        await handleToggleUserStatus(user);
        break;
      case 'delete':
        confirmDeleteUser(user);
        break;
    }
  };

  const handleToggleUserStatus = async (user: User) => {
    Alert.alert(
      'Kullanıcı Durumu',
      `${user.name} kullanıcısını ${user.isActive ? 'devre dışı bırak' : 'aktif et'}?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: user.isActive ? 'Devre Dışı Bırak' : 'Aktif Et',
          style: user.isActive ? 'destructive' : 'default',
          onPress: async () => {
            try {
              if (!token) throw new Error('Yetkilendirme hatası: Token bulunamadı');
              await apiToggleUserStatus(token, user.id);
              loadUsers();
            } catch (err: any) {
              Alert.alert('Hata', err.message || 'Kullanıcı durumu güncellenemedi');
            }
          }
        }
      ]
    );
  };

  const confirmDeleteUser = (user: User) => {
    Alert.alert(
      'Kullanıcıyı Sil',
      `${user.name} kullanıcısını kalıcı olarak silmek istediğinize emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              if (!token) throw new Error('Yetkilendirme hatası: Token bulunamadı');
              await apiDeleteUser(token, user.id);
              loadUsers();
            } catch (err: any) {
              Alert.alert('Hata', err.message || 'Kullanıcı silinemedi');
            }
          }
        }
      ]
    );
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const formatCurrency = (amount: number): string => {
    return `₺${amount.toLocaleString('tr-TR')}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const UserCard: React.FC<{ user: User }> = ({ user }) => (
    <CustomCard style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          {user.phone && <Text style={styles.userPhone}>{user.phone}</Text>}
        </View>
        <View style={styles.userStatus}>
          <View style={[
            styles.roleTag,
            { backgroundColor: getRoleColor(user.role) + '20' }
          ]}>
            <Text style={[styles.roleText, { color: getRoleColor(user.role) }]}>
              {getRoleDisplayName(user.role)}
            </Text>
          </View>
          <View style={[
            styles.statusDot,
            { backgroundColor: user.isActive ? '#22c55e' : '#ef4444' }
          ]} />
        </View>
      </View>

      {user.role === 'customer' && (
        <View style={styles.customerStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.totalOrders}</Text>
            <Text style={styles.statLabel}>Sipariş</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatCurrency(user.totalSpent)}</Text>
            <Text style={styles.statLabel}>Harcama</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.loyaltyPoints}</Text>
            <Text style={styles.statLabel}>Puan</Text>
          </View>
        </View>
      )}

      <View style={styles.userMeta}>
        <Text style={styles.metaText}>
          Üyelik: {formatDate(user.createdAt)}
        </Text>
        {user.lastLogin && (
          <Text style={styles.metaText}>
            Son giriş: {formatDate(user.lastLogin)}
          </Text>
        )}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleUserAction(user, 'edit')}
        >
          <Text style={styles.editButtonText}>Düzenle</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, user.isActive ? styles.deactivateButton : styles.activateButton]}
          onPress={() => handleUserAction(user, 'toggle')}
        >
          <Text style={[styles.actionButtonText, { color: user.isActive ? '#ef4444' : '#22c55e' }]}>
            {user.isActive ? 'Devre Dışı' : 'Aktif Et'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleUserAction(user, 'delete')}
        >
          <Text style={styles.deleteButtonText}>Sil</Text>
        </TouchableOpacity>
      </View>
    </CustomCard>
  );

  if (loading) {
    return <LoadingState message="Kullanıcılar yükleniyor..." />;
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <Text style={{ color: '#dc2626', fontSize: 16, marginBottom: 12 }}>{error}</Text>
        <TouchableOpacity onPress={loadUsers} style={{ backgroundColor: '#f97316', padding: 12, borderRadius: 8 }}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <AdminGuard>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Geri</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Kullanıcı Yönetimi</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Search and Filters */}
        <View style={styles.filtersContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Kullanıcı ara..."
            value={searchText}
            onChangeText={setSearchText}
          />
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roleFilters}>
            {['all', 'customer', 'employee', 'admin'].map((role) => (
              <TouchableOpacity
                key={role}
                style={[
                  styles.roleFilter,
                  selectedRole === role && styles.activeRoleFilter
                ]}
                onPress={() => setSelectedRole(role as any)}
              >
                <Text style={[
                  styles.roleFilterText,
                  selectedRole === role && styles.activeRoleFilterText
                ]}>
                  {role === 'all' ? 'Tümü' : getRoleDisplayName(role as any)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Users List */}
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {filteredUsers.length === 0 ? (
            <EmptyState
              title="Kullanıcı bulunamadı"
              message="Arama kriterlerinize uygun kullanıcı bulunmuyor."
            />
          ) : (
            <View style={styles.usersList}>
              {filteredUsers.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </View>
          )}
        </ScrollView>

        {/* Add User Button */}
        <View style={styles.floatingButton}>
          <CustomButton
            title="+ Yeni Kullanıcı"
            onPress={() => Alert.alert('Yeni Kullanıcı', 'Yeni kullanıcı ekleme özelliği yakında!')}
            variant="primary"
          />
        </View>
      </SafeAreaView>
    </AdminGuard>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    fontSize: 16,
    color: '#f97316',
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerRight: {
    width: 50,
  },
  filtersContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInput: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  roleFilters: {
    flexDirection: 'row',
  },
  roleFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
  },
  activeRoleFilter: {
    backgroundColor: '#f97316',
  },
  roleFilterText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
  activeRoleFilterText: {
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  usersList: {
    padding: 20,
    gap: 16,
  },
  userCard: {
    padding: 16,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    color: '#6b7280',
  },
  userStatus: {
    alignItems: 'flex-end',
    gap: 8,
  },
  roleTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  customerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f3f4f6',
    marginVertical: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  userMeta: {
    marginBottom: 12,
  },
  metaText: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#dbeafe',
  },
  editButtonText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '600',
  },
  activateButton: {
    backgroundColor: '#dcfce7',
  },
  deactivateButton: {
    backgroundColor: '#fee2e2',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#fef2f2',
  },
  deleteButtonText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '600',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
});

export default UserManagementScreen; 