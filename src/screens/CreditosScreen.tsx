import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChevronLeft, PlusCircle, DollarSign } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const CreditosScreen = () => {
  const navigation = useNavigation();
  const [credits, setCredits] = useState(0);
  const [transactions, setTransactions] = useState<{ id: number; amount: number; date: string }[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedCredits = await AsyncStorage.getItem('credits');
        const savedTransactions = await AsyncStorage.getItem('transactions');

        if (savedCredits) setCredits(parseFloat(savedCredits));
        if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
      } catch (error) {
        console.log(error);
      }
    };
    loadData();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const addCredits = async (amount: number) => {
    try {
      const newBalance = credits + amount;
      const newTransaction = {
        id: Date.now(),
        amount,
        date: new Date().toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }),
      };

      const updatedTransactions = [newTransaction, ...transactions];
      setCredits(newBalance);
      setTransactions(updatedTransactions);

      await AsyncStorage.setItem('credits', newBalance.toString());
      await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));

      Alert.alert('Sucesso!', `R$${amount.toFixed(2)} adicionados ao seu saldo.`);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar créditos.');
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.balanceCard, { opacity: fadeAnim }]}>
        <View style={styles.balanceHeader}>
          <Text style={styles.balanceLabel}>Saldo Atual</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ChevronLeft color="#FFF" size={28} />
          </TouchableOpacity>
        </View>
        <Text style={styles.balanceValue}>R$ {credits.toFixed(2)}</Text>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.min((credits / 100) * 100, 100)}%` },
            ]}
          />
        </View>
      </Animated.View>

      <Text style={styles.sectionTitle}>Adicionar Créditos</Text>
      <View style={styles.buttonsRow}>
        {[10, 25, 50, 100].map((value) => (
          <TouchableOpacity
            key={value}
            style={styles.creditButton}
            onPress={() => addCredits(value)}
            activeOpacity={0.8}
          >
            <PlusCircle color="#00FF88" size={18} />
            <Text style={styles.creditButtonText}>R$ {value}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Histórico</Text>
      {transactions.length === 0 ? (
        <Text style={styles.noTransactions}>Nenhuma transação ainda.</Text>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.transactionItem}>
              <Text style={styles.transactionText}>+ R$ {item.amount.toFixed(2)}</Text>
              <Text style={styles.transactionDate}>{item.date}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  backButton: {
    zIndex: 1,
  },
  balanceCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    color: '#8E8E93',
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  balanceValue: {
    color: '#00FF88',
    fontSize: 36,
    fontFamily: 'Poppins_700Bold',
    marginTop: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#2C2C2E',
    borderRadius: 3,
    marginTop: 10,
  },
  progressFill: {
    height: 6,
    backgroundColor: '#00FF88',
    borderRadius: 3,
  },
  sectionTitle: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'Poppins_500Medium',
    marginBottom: 12,
  },
  buttonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  creditButton: {
    width: '48%',
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    gap: 6,
    borderWidth: 1.5,
    borderColor: '#00FF88',
  },
  creditButtonText: {
    color: '#00FF88',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  transactionItem: {
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  transactionText: {
    color: '#00FF88',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  transactionDate: {
    color: '#8E8E93',
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
  },
  noTransactions: {
    textAlign: 'center',
    color: '#8E8E93',
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    marginTop: 10,
  },
});

export default CreditosScreen;
