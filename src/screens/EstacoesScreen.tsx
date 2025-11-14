// src/screens/EstacoesScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getDistance } from '../utils/geolocation';
import stationsData from '../utils/stations.json';

// ... (interface Station continua a mesma)
interface Station {
  id: number;
  name: string;
  address: string;
  coords: { latitude: number; longitude: number };
  power: string;
  vacancies: string;
  price: number;
  status: string;
  distance?: number;
}

type RootStackParamList = {
  CreateReservation: { station: Station };
};

const EstacoesScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);

  // ... (useEffect para buscar localização e estações continua o mesmo)
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos da sua localização para encontrar estações próximas.');
        setLoading(false);
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      
      const stationsWithDistance = stationsData.map(station => {
        const distance = getDistance(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude,
          station.coords.latitude,
          station.coords.longitude
        );
        return { ...station, distance };
      });

      stationsWithDistance.sort((a, b) => a.distance - b.distance);
      setStations(stationsWithDistance);
      setLoading(false);
    })();
  }, []);

  const handleReserve = (station: Station) => {
    navigation.navigate('CreateReservation', { station });
  };

  // ... (getStatusStyle e loading view continuam os mesmos)
  const getStatusStyle = (status: string) => {
    if (status === 'Disponível') return { color: '#00FF88', borderColor: '#00FF88' };
    if (status === 'Ocupado') return { color: '#FFCC00', borderColor: '#FFCC00' };
    return { color: '#FF3B30', borderColor: '#FF3B30' };
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#00FF88" />
        <Text style={styles.loadingText}>Buscando estações...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estações Próximas</Text>
      <FlatList
        data={stations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.stationCard}>
            {/* ... (Card Header e Info continuam os mesmos) */}
            <View style={styles.cardHeader}>
              <Text style={styles.stationName}>{item.name}</Text>
              <View style={[styles.statusBadge, { borderColor: getStatusStyle(item.status).borderColor }]}>
                <Text style={[styles.statusText, { color: getStatusStyle(item.status).color }]}>{item.status}</Text>
              </View>
            </View>
            <Text style={styles.stationInfo}>{item.distance?.toFixed(2)} km de distância</Text>
            <Text style={styles.stationInfo}>{item.address}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.stationDetails}>{item.vacancies} Vagas | {item.power}</Text>
              <Text style={styles.stationPrice}>R$ {item.price.toFixed(2)} / kWh</Text>
            </View>
            
            {/* BOTÃO CONDICIONAL */}
            {item.status === 'Disponível' && (
              <TouchableOpacity style={styles.reserveButton} onPress={() => handleReserve(item)}>
                <Text style={styles.reserveButtonText}>Reservar</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
};

// ... (Estilos continuam os mesmos)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', paddingTop: 60, paddingHorizontal: 20 },
  center: { justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, color: 'white', fontFamily: 'Poppins_600SemiBold', marginBottom: 20 },
  loadingText: { color: 'white', marginTop: 10, fontFamily: 'Poppins_400Regular' },
  stationCard: { backgroundColor: '#1C1C1E', borderRadius: 16, padding: 20, marginBottom: 15 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  stationName: { fontSize: 18, color: 'white', fontFamily: 'Poppins_500Medium', flex: 1 },
  statusBadge: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4, marginLeft: 10 },
  statusText: { fontSize: 12, fontFamily: 'Poppins_500Medium' },
  stationInfo: { fontSize: 14, color: '#8E8E93', fontFamily: 'Poppins_400Regular', marginBottom: 4 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, borderTopWidth: 1, borderTopColor: '#2C2C2E', paddingTop: 12 },
  stationDetails: { fontSize: 14, color: 'white', fontFamily: 'Poppins_400Regular' },
  stationPrice: { fontSize: 16, color: '#00FF88', fontFamily: 'Poppins_600SemiBold' },
  reserveButton: { backgroundColor: '#00FF88', borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginTop: 16 },
  reserveButtonText: { color: '#121212', fontSize: 16, fontFamily: 'Poppins_600SemiBold' },
});

export default EstacoesScreen;