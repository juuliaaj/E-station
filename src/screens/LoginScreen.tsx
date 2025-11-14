// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthStackParamList = {
  Register: undefined;
  Main: undefined;
};

const LoginScreen = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    // Simulação de login
    try {
      const userData = await AsyncStorage.getItem('user_data');
      if (userData) {
        const user = JSON.parse(userData);
        if (user.email === email && user.password === password) {
          await AsyncStorage.setItem('user_token', 'fake-token');
          navigation.replace('Main');
        } else {
          Alert.alert('Erro', 'E-mail ou senha inválidos.');
        }
      } else {
        Alert.alert('Erro', 'Nenhum usuário cadastrado. Por favor, registre-se.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao tentar fazer login.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Bem-vindo de volta</Text>
      <Text style={styles.subtitle}>Entre na sua conta para continuar</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Seu E-mail"
        placeholderTextColor="#8E8E93"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Sua Senha"
        placeholderTextColor="#8E8E93"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>
          Não tem uma conta? <Text style={styles.linkHighlight}>Cadastre-se aqui</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center', padding: 20 },
  logo: { width: 100, height: 100, resizeMode: 'contain', marginBottom: 20 },
  title: { fontSize: 28, color: '#00FF88', fontFamily: 'Poppins_600SemiBold', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#EAEAEA', fontFamily: 'Poppins_400Regular', marginBottom: 40 },
  input: { width: '100%', height: 50, backgroundColor: '#1C1C1E', borderRadius: 16, paddingHorizontal: 15, color: 'white', fontSize: 16, marginBottom: 15 },
  button: { width: '100%', height: 50, backgroundColor: '#00FF88', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#121212', fontSize: 18, fontFamily: 'Poppins_600SemiBold' },
  linkText: { color: '#EAEAEA', marginTop: 30, fontSize: 14 },
  linkHighlight: { color: '#00FF88', fontFamily: 'Poppins_600SemiBold' },
});

export default LoginScreen;