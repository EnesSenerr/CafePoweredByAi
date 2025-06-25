import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MenuManagementScreen from '../MenuManagementScreen';
import { AuthContext } from '../../contexts/AuthContext';

const mockContext = {
  user: { id: '1', name: 'Test Admin', role: 'admin' },
  token: 'test-token',
};

describe('MenuManagementScreen', () => {
  it('ekranı başarıyla render eder', () => {
    const { getByText } = render(
      <AuthContext.Provider value={mockContext as any}>
        <MenuManagementScreen />
      </AuthContext.Provider>
    );
    expect(getByText('Menü Yönetimi')).toBeTruthy();
  });

  it('yeni ürün ekleme modalını açar', async () => {
    const { getByText, getByLabelText } = render(
      <AuthContext.Provider value={mockContext as any}>
        <MenuManagementScreen />
      </AuthContext.Provider>
    );
    fireEvent.press(getByText('Yeni Ürün Ekle'));
    await waitFor(() => {
      expect(getByText('Yeni Ürün Ekle')).toBeTruthy();
      expect(getByLabelText('İsim')).toBeTruthy();
    });
  });
}); 