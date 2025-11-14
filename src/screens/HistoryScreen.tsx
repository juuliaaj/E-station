// src/screens/HistoryScreen.tsx
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';

interface Reservation {
  id: number;
  stationName: string;
  status: string;
  date: string; // ISO string format
  connector?: string;
  duration: string;
}

const HistoryScreen = () => {
  const navigation = useNavigation();
  const [pastReservations, setPastReservations] = useState<Reservation[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchReservations = async () => {
        const storedReservations = await AsyncStorage.getItem('reservations');
        if (storedReservations) {
          const allReservations: Reservation[] = JSON.parse(storedReservations);
          const now = new Date();
          // Filtra para pegar apenas reservas cuja data já passou
          const past = allReservations.filter(res => new Date(res.date) < now);
          setPastReservations(past.reverse());
        }
      };
      fetchReservations();
    }, [])
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <ChevronLeft color="#FFF" size={28} />
      </TouchableOpacity>
      <Text style={styles.title}>Histórico de Reservas</Text>

      <FlatList
        data={pastReservations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.stationName}>{item.stationName}</Text>
            </View>
            <Text style={styles.cardInfo}>Data: {new Date(item.date).toLocaleDateString('pt-BR')} - {new Date(item.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text>
            <Text style={styles.cardInfo}>Conector: {item.connector}</Text>
            <Text style={styles.cardInfo}>Duração: {item.duration}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma reserva passada encontrada.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', paddingTop: 60, paddingHorizontal: 20 },
  backButton: { position: 'absolute', top: 60, left: 20, zIndex: 1 },
  title: { fontSize: 20, color: 'white', fontFamily: 'Poppins_600SemiBold', marginBottom: 20, textAlign: 'center' },
  card: { backgroundColor: '#1C1C1E', borderRadius: 16, padding: 20, marginBottom: 15 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  stationName: { fontSize: 18, color: 'white', fontFamily: 'Poppins_500Medium' },
  statusPast: { color: '#8E8E93', fontFamily: 'Poppins_600SemiBold' },
  cardInfo: { fontSize: 14, color: '#EAEAEA', fontFamily: 'Poppins_400Regular', lineHeight: 22 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#8E8E93', fontSize: 16, fontFamily: 'Poppins_400Regular' },
});

export default HistoryScreen;