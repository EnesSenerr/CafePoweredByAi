import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, ScrollView, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getSalesReport, getInventoryReport, downloadReport } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import CustomButton from '../components/ui/CustomButton';
import * as FileSystem from 'expo-file-system';

interface ReportRow {
  [key: string]: string | number;
}

const ReportsScreen = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<'sales' | 'inventory'>('sales');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportRow[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchReport = async () => {
    if (!token) return;
    setLoading(true);
    try {
      let res;
      const filters = {
        startDate: startDate ? startDate.toISOString().slice(0, 10) : undefined,
        endDate: endDate ? endDate.toISOString().slice(0, 10) : undefined,
      };
      if (activeTab === 'sales') {
        res = await getSalesReport(token, filters);
      } else {
        res = await getInventoryReport(token, filters);
      }
      setReportData(res.data || res || []);
    } catch (e) {
      Alert.alert('Hata', 'Rapor yüklenemedi.');
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!token) return;
    setDownloading(true);
    try {
      const filters = {
        startDate: startDate ? startDate.toISOString().slice(0, 10) : undefined,
        endDate: endDate ? endDate.toISOString().slice(0, 10) : undefined,
      };
      const blob = await downloadReport(token, activeTab, filters);
      // Gerçek dosya indirme
      const fileUri = `${FileSystem.documentDirectory}rapor_${activeTab}_${Date.now()}.xlsx`;
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
        Alert.alert('Başarılı', `Rapor indirildi: ${fileUri}`);
      };
      reader.onerror = () => {
        Alert.alert('Hata', 'Dosya okunamadı.');
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      Alert.alert('Hata', 'Rapor indirilemedi.');
    } finally {
      setDownloading(false);
    }
  };

  const renderTable = () => {
    if (!reportData.length) return <Text style={{ textAlign: 'center', color: '#888', marginTop: 32 }}>Veri yok.</Text>;
    const headers = Object.keys(reportData[0]);
    return (
      <ScrollView horizontal style={{ marginTop: 16 }}>
        <View>
          <View style={styles.tableRowHeader}>
            {headers.map(h => (
              <Text key={h} style={styles.tableHeader}>{h}</Text>
            ))}
          </View>
          {reportData.map((row, idx) => (
            <View key={idx} style={styles.tableRow}>
              {headers.map(h => (
                <Text key={h} style={styles.tableCell}>{row[h]}</Text>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Raporlar</Text>
        <View style={{ flexDirection: 'row' }}>
          <CustomButton title="Satış" onPress={() => setActiveTab('sales')} variant={activeTab === 'sales' ? 'primary' : 'secondary'} style={{ marginRight: 8 }} />
          <CustomButton title="Stok" onPress={() => setActiveTab('inventory')} variant={activeTab === 'inventory' ? 'primary' : 'secondary'} />
        </View>
      </View>
      <View style={styles.filterRow}>
        <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.dateBox}>
          <Text style={styles.dateLabel}>Başlangıç</Text>
          <Text style={styles.dateValue}>{startDate ? startDate.toLocaleDateString('tr-TR') : '-'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.dateBox}>
          <Text style={styles.dateLabel}>Bitiş</Text>
          <Text style={styles.dateValue}>{endDate ? endDate.toLocaleDateString('tr-TR') : '-'}</Text>
        </TouchableOpacity>
        <CustomButton title="Filtrele" onPress={fetchReport} style={{ marginLeft: 8 }} />
      </View>
      {showStartPicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, date) => {
            setShowStartPicker(false);
            if (date) setStartDate(date);
          }}
        />
      )}
      {showEndPicker && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, date) => {
            setShowEndPicker(false);
            if (date) setEndDate(date);
          }}
        />
      )}
      <View style={{ flex: 1 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#b91c1c" style={{ marginTop: 32 }} />
        ) : (
          renderTable()
        )}
      </View>
      <View style={{ padding: 16 }}>
        <CustomButton title={downloading ? 'İndiriliyor...' : 'Raporu İndir'} onPress={handleDownload} disabled={downloading} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#b91c1c',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dateBox: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    alignItems: 'center',
    minWidth: 90,
  },
  dateLabel: {
    color: '#888',
    fontSize: 12,
  },
  dateValue: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 14,
  },
  tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tableHeader: {
    fontWeight: 'bold',
    color: '#b91c1c',
    padding: 8,
    minWidth: 100,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableCell: {
    padding: 8,
    minWidth: 100,
    textAlign: 'center',
    color: '#222',
  },
});

export default ReportsScreen; 