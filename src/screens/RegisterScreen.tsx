// src/screens/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthStackParamList = {
  Login: undefined;
};

const RegisterScreen = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }
    
    const userData = { name, email, password };
    try {
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
      Alert.alert('Sucesso', 'Conta criada com sucesso! Faça o login para continuar.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar a conta.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Junte-se a nós</Text>
      <Text style={styles.subtitle}>Crie sua conta e conecte-se com a E-station</Text>
      
      <TextInput style={styles.input} placeholder="Seu nome completo" placeholderTextColor="#8E8E93" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Seu E-mail" placeholderTextColor="#8E8E93" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Sua Senha" placeholderTextColor="#8E8E93" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Confirme sua Senha" placeholderTextColor="#8E8E93" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Criar Conta</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>
          Já tem uma conta? <Text style={styles.linkHighlight}>Faça o Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center', padding: 20 },
  logo: { width: 100, height: 100, resizeMode: 'contain', marginBottom: 20 },
  title: { fontSize: 28, color: '#00FF88', fontFamily: 'Poppins_600SemiBold', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#EAEAEA', fontFamily: 'Poppins_400Regular', marginBottom: 40, textAlign: 'center' },
  input: { width: '100%', height: 50, backgroundColor: '#1C1C1E', borderRadius: 16, paddingHorizontal: 15, color: 'white', fontSize: 16, marginBottom: 15 },
  button: { width: '100%', height: 50, backgroundColor: '#00FF88', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#121212', fontSize: 18, fontFamily: 'Poppins_600SemiBold' },
  linkText: { color: '#EAEAEA', marginTop: 30, fontSize: 14 },
  linkHighlight: { color: '#00FF88', fontFamily: 'Poppins_600SemiBold' },
});

export default RegisterScreen;