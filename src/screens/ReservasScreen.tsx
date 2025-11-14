import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { PlusCircle, Map } from 'lucide-react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

interface Reservation {
  id: number;
  stationName: string;
  status: string;
  date: string; // ISO string format
  coords: { latitude: number; longitude: number };
  connector?: string;
  duration: string;
}

const ReservasScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [activeReservations, setActiveReservations] = useState<Reservation[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchReservations = async () => {
        const storedReservations = await AsyncStorage.getItem('reservations');
        if (storedReservations) {
          const allReservations: Reservation[] = JSON.parse(storedReservations);
          const now = new Date();
          const active = allReservations.filter(res => new Date(res.date) >= now);
          setActiveReservations(active.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        }
      };
      fetchReservations();
    }, [])
  );

  const openMapRoute = (reservation: Reservation) => {
    const { latitude, longitude } = reservation.coords;
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${latitude},${longitude}`;
    const label = reservation.stationName;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });
    Linking.openURL(url!);
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const formattedDate = date.toLocaleDateString('pt-BR');
    const formattedTime = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return `${formattedDate} - ${formattedTime}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Reservas</Text>
      
      <FlatList
        data={activeReservations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              {/* Coluna Esquerda: Informações da Reserva */}
              <View style={styles.infoContainer}>
                <Text style={styles.stationName}>{item.stationName}</Text>
                <Text style={styles.cardInfo}>Data: {formatDate(item.date)}</Text>
                <Text style={styles.cardInfo}>Conector: {item.connector}</Text>
                <Text style={styles.cardInfo}>Duração: {item.duration}</Text>
              </View>

              {/* Coluna Direita: Status e Botão de Mapa */}
              <View style={styles.statusAndButtonContainer}>
                <Text style={styles.statusActive}>{item.status}</Text>
                <TouchableOpacity style={styles.mapButton} onPress={() => openMapRoute(item)}>
                  <Map color="#121212" size={24} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma reserva ativa encontrada.</Text>
            <TouchableOpacity style={styles.newReservationButton} onPress={() => navigation.navigate('Mapa')}>
              <PlusCircle color="#00FF88" size={20} />
              <Text style={styles.newReservationText}>Criar nova reserva</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', paddingTop: 60, paddingHorizontal: 20 },
  title: { fontSize: 28, color: 'white', fontFamily: 'Poppins_600SemiBold', marginBottom: 20 },
  card: { backgroundColor: '#1C1C1E', borderRadius: 16, padding: 20, marginBottom: 15 },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', 
  },
  infoContainer: {
    flex: 1,
    marginRight: 15, 
  },
  stationName: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'Poppins_500Medium',
    marginBottom: 10,
  },
  cardInfo: {
    fontSize: 14,
    color: '#EAEAEA',
    fontFamily: 'Poppins_400Regular',
    lineHeight: 22,
  },
  statusAndButtonContainer: {
    alignItems: 'flex-end', 
  },
  statusActive: {
    color: '#00FF88',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    marginBottom: 8, 
  },
  mapButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#00FF88',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#8E8E93', fontSize: 16, fontFamily: 'Poppins_400Regular', marginBottom: 20 },
  newReservationButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1C1E', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 16 },
  newReservationText: { color: '#00FF88', marginLeft: 10, fontFamily: 'Poppins_500Medium' },
});

export default ReservasScreen;