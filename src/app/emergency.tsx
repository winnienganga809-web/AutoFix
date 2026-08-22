import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

export default function EmergencyScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🚨 Emergency Help</Text>
        <Text style={styles.subtitle}>
          Get a mechanic to you as quickly as possible.
        </Text>
      </View>

      <View style={styles.alert}>
        <Text style={styles.alertIcon}>🚨</Text>
        <View style={styles.alertInfo}>
          <Text style={styles.alertTitle}>Emergency assistance</Text>
          <Text style={styles.alertText}>
            Tell us where you are and what happened.
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📍 Your location</Text>
        <Text style={styles.cardText}>
          Location will be detected when you request emergency help.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🚗 Vehicle</Text>
        <Text style={styles.cardText}>
          Add your vehicle details to help the mechanic prepare.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔧 What's wrong?</Text>
        <Text style={styles.cardText}>
          Flat tyre, breakdown, battery problem, overheating or another
          emergency.
        </Text>
      </View>

      <Pressable style={styles.emergencyButton}>
        <Text style={styles.buttonText}>🚨 Find Emergency Mechanic</Text>
      </Pressable>

      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>← Back</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },

  header: {
    padding: 24,
    paddingTop: 35,
  },

  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#111827',
  },

  subtitle: {
    color: '#6B7280',
    marginTop: 7,
    fontSize: 15,
  },

  alert: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#FEF2F2',
    flexDirection: 'row',
    alignItems: 'center',
  },

  alertIcon: {
    fontSize: 35,
    marginRight: 15,
  },

  alertInfo: {
    flex: 1,
  },

  alertTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#991B1B',
  },

  alertText: {
    marginTop: 5,
    color: '#7F1D1D',
  },

  card: {
    marginHorizontal: 20,
    marginTop: 15,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },

  cardText: {
    marginTop: 7,
    color: '#6B7280',
    lineHeight: 21,
  },

  emergencyButton: {
    margin: 20,
    padding: 18,
    borderRadius: 16,
    backgroundColor: '#DC2626',
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },

  backButton: {
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 15,
    alignItems: 'center',
  },

  backText: {
    color: '#475569',
    fontSize: 16,
    fontWeight: '700',
  },
});