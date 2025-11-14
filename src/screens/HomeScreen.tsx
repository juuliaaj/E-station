// src/screens/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MapPin, Calendar, DollarSign } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { RootStackParamList } from '../navigation/AppNavigator';

const carRecommendations = [
  { id: '1', name: 'BYD Dolphin Mini', image: require('../assets/images/byd.png') },
  { id: '2', name: 'Hyundai Kona Electric', image: require('../assets/images/hyundai.png') },
  { id: '3', name: 'BYD Seal', image: require('../assets/images/byd2.png') },
];

const HomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem('user_data');
      if (userData) {
        const user = JSON.parse(userData);
        setUserName(user.name.split(' ')[0]);
      }
    };
    fetchUser();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <MaskedView
          maskElement={<Text style={[styles.greeting, { backgroundColor: 'transparent' }]}>Olá, {userName}!</Text>}
        >
          <LinearGradient colors={['#00FF88', '#00DDFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={[styles.greeting, { opacity: 0 }]}>Olá, {userName}!</Text>
          </LinearGradient>
        </MaskedView>
      </View>

      <Text style={styles.subtitle}>Pronto para carregar?</Text>

      <Text style={styles.sectionTitle}>Ações Rápidas</Text>
      <View style={styles.actionsGrid}>
        <TouchableOpacity style={styles.smallActionCard} onPress={() => navigation.navigate('Mapa')}>
          <MapPin color="#00FF88" size={28} />
          <Text style={styles.actionText}>Encontrar estações próximas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.smallActionCard} onPress={() => navigation.navigate('Reservas')}>
          <Calendar color="#00FF88" size={28} />
          <Text style={styles.actionText}>Minhas Reservas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.largeActionCard} onPress={() => navigation.navigate('Creditos')}>
          <DollarSign color="#00FF88" size={28} />
          <Text style={styles.actionText}>Créditos disponíveis</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Recomendações de carros elétricos</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendationsContainer}>
        {carRecommendations.map(car => (
          <TouchableOpacity key={car.id} style={styles.recommendationCard}>
            <Image source={car.image} style={styles.recommendationImage} />
            <Text style={styles.recommendationText}>{car.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', paddingTop: 60 },
  header: { paddingHorizontal: 20 },
  greeting: { fontSize: 32, fontFamily: 'Poppins_600SemiBold' },
  subtitle: { fontSize: 18, color: '#8E8E93', fontFamily: 'Poppins_400Regular', marginBottom: 30, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 20, color: 'white', fontFamily: 'Poppins_500Medium', marginBottom: 15, paddingHorizontal: 20 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 30 },
  smallActionCard: { width: '48%', height: 140, backgroundColor: '#1C1C1E', borderRadius: 16, padding: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  largeActionCard: { width: '100%', height: 100, backgroundColor: '#1C1C1E', borderRadius: 16, padding: 15, justifyContent: 'center', alignItems: 'center' },
  actionText: { color: 'white', marginTop: 10, fontFamily: 'Poppins_400Regular', textAlign: 'center', fontSize: 14 },
  recommendationsContainer: { paddingLeft: 20 },
  recommendationCard: { width: 280, marginRight: 15, backgroundColor: '#1C1C1E', borderRadius: 16, overflow: 'hidden' },
  recommendationImage: { width: '100%', height: 150, resizeMode: 'cover' },
  recommendationText: { color: 'white', fontFamily: 'Poppins_500Medium', fontSize: 16, padding: 15 },
});

export default HomeScreen;
