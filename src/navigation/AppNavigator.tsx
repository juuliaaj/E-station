// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer, NavigatorScreenParams } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, MapPin, Calendar, User } from 'lucide-react-native';

// Importação das telas
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import EstacoesScreen from '../screens/EstacoesScreen';
import ReservasScreen from '../screens/ReservasScreen';
import PerfilScreen from '../screens/PerfilScreen';
import CreateReservationScreen from '../screens/CreateReservationScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import HistoryScreen from '../screens/HistoryScreen';
import CreditosScreen from '../screens/CreditosScreen';

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

// Tipos das rotas
export type TabParamList = {
  Início: undefined;
  Mapa: undefined;
  Reservas: undefined;
  Perfil: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  Main: NavigatorScreenParams<TabParamList>;
  CreateReservation: { station: Station };
  EditProfile: undefined;
  History: undefined;
  Mapa: undefined;
  Reservas: undefined;
  Creditos: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const RootStack = createStackNavigator<RootStackParamList>();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarShowLabel: true,
      tabBarStyle: { backgroundColor: '#1C1C1E', borderTopColor: '#2C2C2E' },
      tabBarActiveTintColor: '#00FF88',
      tabBarInactiveTintColor: '#8E8E93',
      tabBarIcon: ({ color, size }) => {
        if (route.name === 'Início') return <Home color={color} size={size} />;
        if (route.name === 'Mapa') return <MapPin color={color} size={size} />;
        if (route.name === 'Reservas') return <Calendar color={color} size={size} />;
        if (route.name === 'Perfil') return <User color={color} size={size} />;
        return null;
      },
    })}
  >
    <Tab.Screen name="Início" component={HomeScreen} />
    <Tab.Screen name="Mapa" component={EstacoesScreen} />
    <Tab.Screen name="Reservas" component={ReservasScreen} />
    <Tab.Screen name="Perfil" component={PerfilScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Splash" component={SplashScreen} />
        <RootStack.Screen name="Login" component={LoginScreen} />
        <RootStack.Screen name="Register" component={RegisterScreen} />
        <RootStack.Screen name="Main" component={MainTabs} />
        <RootStack.Screen name="CreateReservation" component={CreateReservationScreen} />
        <RootStack.Screen name="EditProfile" component={EditProfileScreen} />
        <RootStack.Screen name="History" component={HistoryScreen} />
        <RootStack.Screen name="Creditos" component={CreditosScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
