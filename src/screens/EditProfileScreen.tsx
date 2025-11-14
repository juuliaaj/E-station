// src/screens/EditProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChevronLeft } from 'lucide-react-native';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [originalUser, setOriginalUser] = useState(null as unknown as object);

  useEffect(() => {
    const loadUserData = async () => {
      const userDataString = await AsyncStorage.getItem('user_data');
      if (userDataString) {
        const user = JSON.parse(userDataString);
        setOriginalUser(user);
        setName(user.name);
        setEmail(user.email);
      }
    };
    loadUserData();
  }, []);

  const handleSaveChanges = async () => {
    if (!name || !email) {
      Alert.alert('Erro', 'Nome e e-mail não podem estar vazios.');
      return;
    }

    const updatedUser = { ...originalUser, name, email };
    try {
      await AsyncStorage.setItem('user_data', JSON.stringify(updatedUser));
      Alert.alert('Sucesso', 'Seu perfil foi atualizado.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <ChevronLeft color="#FFF" size={28} />
      </TouchableOpacity>
      <Text style={styles.title}>Editar Perfil</Text>

      <Text style={styles.label}>Nome Completo</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Seu nome completo"
        placeholderTextColor="#8E8E93"
      />

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Seu e-mail"
        placeholderTextColor="#8E8E93"
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
        <Text style={styles.saveButtonText}>Salvar Alterações</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', paddingTop: 60, paddingHorizontal: 20 },
  backButton: { position: 'absolute', top: 60, left: 20, zIndex: 1 },
  title: { fontSize: 20, color: 'white', fontFamily: 'Poppins_600SemiBold', marginBottom: 30, textAlign: 'center' },
  label: { fontSize: 16, color: '#8E8E93', fontFamily: 'Poppins_400Regular', marginBottom: 10 },
  input: { width: '100%', height: 50, backgroundColor: '#1C1C1E', borderRadius: 16, paddingHorizontal: 15, color: 'white', fontSize: 16, marginBottom: 20 },
  saveButton: { backgroundColor: '#00FF88', borderRadius: 16, padding: 18, alignItems: 'center', marginTop: 20 },
  saveButtonText: { color: '#121212', fontSize: 18, fontFamily: 'Poppins_600SemiBold' },
});

export default EditProfileScreen;