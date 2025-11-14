// src/screens/PerfilScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Edit, History, LogOut } from 'lucide-react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const PerfilScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [user, setUser] = useState({ name: '', email: '' });

  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        const userData = await AsyncStorage.getItem('user_data');
        if (userData) setUser(JSON.parse(userData));
      };
      fetchUser();
    }, [])
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user_token');
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      {/* ... (Profile Header e Stats continuam os mesmos) */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
        </View>
        <Text style={styles.profileName}>{user.name}</Text>
        <Text style={styles.profileEmail}>{user.email}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Carregamentos</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>0 kWh</Text>
          <Text style={styles.statLabel}>Carregados</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('EditProfile')}>
          <Edit color="#8E8E93" size={22} />
          <Text style={styles.menuText}>Editar Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('History')}>
          <History color="#8E8E93" size={24} />
          <Text style={styles.menuText}>Histórico de Reservas</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut color="#FF3B30" size={24} />
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', paddingTop: 60, paddingHorizontal: 20 },
  profileHeader: { alignItems: 'center', marginBottom: 30 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#00FF88', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  avatarText: { fontSize: 48, color: '#121212', fontFamily: 'Poppins_600SemiBold' },
  profileName: { fontSize: 24, color: 'white', fontFamily: 'Poppins_600SemiBold' },
  profileEmail: { fontSize: 16, color: '#8E8E93', fontFamily: 'Poppins_400Regular' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  statBox: { alignItems: 'center', backgroundColor: '#1C1C1E', padding: 15, borderRadius: 16, width: '48%' },
  statValue: { fontSize: 20, color: '#00FF88', fontFamily: 'Poppins_600SemiBold' },
  statLabel: { fontSize: 10, color: '#8E8E93', fontFamily: 'Poppins_400Regular', marginTop: 4 },
  menuContainer: { backgroundColor: '#1C1C1E', borderRadius: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: '#2C2C2E' },
  menuText: { color: 'white', fontSize: 16, marginLeft: 15, fontFamily: 'Poppins_400Regular' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 30, padding: 15, backgroundColor: '#1C1C1E', borderRadius: 16 },
  logoutText: { color: '#FF3B30', fontSize: 16, marginLeft: 10, fontFamily: 'Poppins_500Medium' },
});

export default PerfilScreen;