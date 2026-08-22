import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const services = [
  ['🔍', 'Diagnostics', 'Find the problem'],
  ['🛢️', 'Oil Change', 'Oil & filter service'],
  ['🛞', 'Tyre Service', 'Tyres & balancing'],
  ['🔋', 'Battery', 'Battery testing & replacement'],
  ['🛑', 'Brake Service', 'Brake inspection & repair'],
  ['⚙️', 'Engine Repair', 'Engine inspection & repair'],
  ['❄️', 'AC Service', 'Air conditioning service'],
  ['🚗', 'General Service', 'Complete vehicle service'],
];

export default function ServicesScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Services</Text>
      <Text style={styles.subtitle}>
        Professional care for your vehicle
      </Text>

      <TouchableOpacity style={styles.emergency}>
        <Text style={styles.emergencyIcon}>🚨</Text>
        <View style={styles.emergencyInfo}>
          <Text style={styles.emergencyTitle}>Emergency Assistance</Text>
          <Text style={styles.emergencyText}>
            Get urgent roadside help
          </Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>What does your car need?</Text>

      <View style={styles.grid}>
        {services.map(([icon, title, description]) => (
          <TouchableOpacity key={title} style={styles.card}>
            <View style={styles.iconBox}>
              <Text style={styles.icon}>{icon}</Text>
            </View>

            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardDescription}>{description}</Text>

            <Text style={styles.book}>Request →</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },

  content: {
    padding: 24,
    paddingBottom: 120,
    maxWidth: 900,
    width: '100%',
    alignSelf: 'center',
  },

  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#111827',
    marginTop: 20,
  },

  subtitle: {
    color: '#6B7280',
    marginTop: 6,
    marginBottom: 25,
  },

  emergency: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },

  emergencyIcon: {
    fontSize: 30,
    marginRight: 14,
  },

  emergencyInfo: {
    flex: 1,
  },

  emergencyTitle: {
    color: '#B91C1C',
    fontSize: 17,
    fontWeight: '800',
  },

  emergencyText: {
    color: '#7F1D1D',
    marginTop: 4,
    fontSize: 13,
  },

  arrow: {
    color: '#B91C1C',
    fontSize: 30,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 15,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    width: '47%',
    minWidth: 250,
    flexGrow: 1,
    elevation: 2,
  },

  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  icon: {
    fontSize: 27,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },

  cardDescription: {
    color: '#6B7280',
    fontSize: 13,
    marginTop: 5,
  },

  book: {
    color: '#F59E0B',
    fontWeight: '800',
    marginTop: 14,
  },
});