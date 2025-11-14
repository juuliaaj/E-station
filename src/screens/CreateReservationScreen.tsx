import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChevronLeft, Calendar, Clock } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RootStackParamList } from '../navigation/AppNavigator';

type CreateReservationRouteProp = RouteProp<RootStackParamList, 'CreateReservation'>;

const connectors = [
  { id: 'ccs2', name: 'CCS2', power: '150kW', price: 0.85 },
  { id: 'type2', name: 'Type 2', power: '22kW', price: 0.65 },
];

const durations = [60, 45, 30, 15];

const CreateReservationScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<CreateReservationRouteProp>();
  const { station } = route.params;

  const [date, setDate] = useState(new Date());
  const [selectedConnector, setSelectedConnector] = useState('ccs2');
  const [selectedDuration, setSelectedDuration] = useState(60);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleConfirmReservation = async () => {
    const newReservation = {
      id: Date.now(),
      stationName: station.name,
      status: 'ATIVA',
      date: date.toISOString(),
      coords: station.coords,
      connector: connectors.find(c => c.id === selectedConnector)?.name,
      duration: `${selectedDuration} min`,
    };

    try {
      const existingReservations = await AsyncStorage.getItem('reservations');
      const reservations = existingReservations ? JSON.parse(existingReservations) : [];
      reservations.push(newReservation);
      await AsyncStorage.setItem('reservations', JSON.stringify(reservations));

      Alert.alert('Sucesso!', 'Sua reserva foi confirmada.', [
        {
          text: 'OK',
          onPress: () => navigation.reset({
            index: 0,
            routes: [{ name: 'Main', params: { screen: 'Reservas' } }],
          })
        },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar sua reserva.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <ChevronLeft color="#FFF" size={28} />
      </TouchableOpacity>

      <Text style={styles.title}>Reservas</Text>

      <View style={styles.stationCard}>
        <Text style={styles.stationName}>{station.name}</Text>
        <Text style={styles.stationAddress}>{station.address}</Text>
        <Text style={styles.stationDistance}>{station.distance?.toFixed(2)} km de distância</Text>
      </View>

      <Text style={styles.sectionTitle}>Selecionar Conector</Text>
      {connectors.map(conn => (
        <TouchableOpacity
          key={conn.id}
          style={[styles.optionCard, selectedConnector === conn.id && styles.selectedOption]}
          onPress={() => setSelectedConnector(conn.id)}
        >
          <View>
            <Text style={styles.optionTitle}>{conn.name}</Text>
            <Text style={styles.optionSubtitle}>{conn.power}</Text>
          </View>
          <Text style={styles.optionPrice}>R$ {conn.price.toFixed(2)}/kWh</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionTitle}>Agendamento</Text>
      <View style={styles.dateTimeContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Data</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)} activeOpacity={0.7}>
            <Text style={styles.inputText}>{date.toLocaleDateString('pt-BR')}</Text>
            <Calendar color="#00FF88" size={18} />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Horário</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)} activeOpacity={0.7}>
            <Text style={styles.inputText}>
              {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </Text>
            <Clock color="#00FF88" size={18} />
          </TouchableOpacity>
        </View>
      </View>

      {/* MODAL DE DATA */}
      <Modal visible={showDatePicker} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={Platform.OS === 'ios' ? styles.modalContent : null}>
            <DateTimePicker
              value={date}
              mode="date"
              display="spinner"
              themeVariant="light"
              textColor="#000"
              onChange={(event, selectedDate) => {
                if (selectedDate) setDate(selectedDate);
                if (Platform.OS !== 'ios') setShowDatePicker(false);
              }}
            />
            {Platform.OS === 'ios' && (
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={() => setShowDatePicker(false)} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowDatePicker(false)} style={styles.modalButton}>
                  <Text style={[styles.modalButtonText, { color: '#00FF88' }]}>OK</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* MODAL DE HORÁRIO */}
      <Modal visible={showTimePicker} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={Platform.OS === 'ios' ? styles.modalContent : null}>
            <DateTimePicker
              value={date}
              mode="time"
              is24Hour={true}
              display="spinner"
              themeVariant="light"
              textColor="#000"
              onChange={(event, selectedTime) => {
                if (selectedTime) setDate(selectedTime);
                if (Platform.OS !== 'ios') setShowTimePicker(false);
              }}
            />
            {Platform.OS === 'ios' && (
              <View style={styles.modalButtons}>
                  <TouchableOpacity onPress={() => setShowTimePicker(false)} style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowTimePicker(false)} style={styles.modalButton}>
                  <Text style={[styles.modalButtonText, { color: '#00FF88' }]}>OK</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <Text style={styles.sectionTitle}>Duração Estimada</Text>
      <View style={styles.durationGrid}>
        {durations.map(duration => (
          <TouchableOpacity
            key={duration}
            style={[styles.durationButton, selectedDuration === duration && styles.selectedDuration]}
            onPress={() => setSelectedDuration(duration)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.durationText,
                selectedDuration === duration && { color: '#121212' },
              ]}
            >
              {duration} min
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmReservation} activeOpacity={0.7}>
        <Text style={styles.confirmButtonText}>Confirmar Reserva</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', paddingTop: 60, paddingHorizontal: 20 },
  backButton: { position: 'absolute', top: 0, left: 0, zIndex: 1 },
  title: { fontSize: 20, color: 'white', fontFamily: 'Poppins_600SemiBold', marginBottom: 20, textAlign: 'center' },
  stationCard: { backgroundColor: '#1C1C1E', borderRadius: 16, padding: 15, marginBottom: 25 },
  stationName: { fontSize: 16, color: 'white', fontFamily: 'Poppins_500Medium' },
  stationAddress: { fontSize: 14, color: '#8E8E93', fontFamily: 'Poppins_400Regular', marginVertical: 4 },
  stationDistance: { fontSize: 14, color: '#8E8E93', fontFamily: 'Poppins_400Regular' },
  sectionTitle: { fontSize: 20, color: 'white', fontFamily: 'Poppins_500Medium', marginBottom: 15 },
  optionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: { borderColor: '#00FF88' },
  optionTitle: { fontSize: 18, color: 'white', fontFamily: 'Poppins_500Medium' },
  optionSubtitle: { fontSize: 14, color: '#8E8E93', fontFamily: 'Poppins_400Regular' },
  optionPrice: { fontSize: 18, color: '#00FF88', fontFamily: 'Poppins_600SemiBold' },
  dateTimeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  inputContainer: { width: '48%' },
  inputLabel: { color: '#8E8E93', fontFamily: 'Poppins_400Regular', marginBottom: 5 },
  input: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  inputText: { color: 'white', fontSize: 16, fontFamily: 'Poppins_500Medium' },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 10,
    width: '85%',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  modalButton: { padding: 10 },
  modalButtonText: { fontSize: 16, color: '#121212', fontFamily: 'Poppins_500Medium' },
  durationGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  durationButton: {
    width: '48%',
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedDuration: { backgroundColor: '#00FF88', borderColor: '#00FF88' },
  durationText: { color: 'white', fontSize: 16, fontFamily: 'Poppins_500Medium' },
  confirmButton: {
    backgroundColor: '#00FF88',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 80,
  },
  confirmButtonText: { color: '#121212', fontSize: 18, fontFamily: 'Poppins_600SemiBold' },
});

export default CreateReservationScreen;
