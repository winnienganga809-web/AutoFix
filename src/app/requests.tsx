import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function RequestsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>My Requests</Text>
      <Text style={styles.subtitle}>
        Track your mechanic requests
      </Text>

      <View style={styles.card}>
        <View style={styles.icon}>
          <Text style={styles.iconText}>🔧</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.service}>Vehicle Diagnostics</Text>
          <Text style={styles.details}>Toyota • Today</Text>
          <Text style={styles.status}>● Mechanic requested</Text>
        </View>
      </View>

      <View style={styles.emptyCard}>
        <Text style={styles.emptyIcon}>📋</Text>
        <Text style={styles.emptyTitle}>Need another service?</Text>
        <Text style={styles.emptyText}>
          Request a mechanic whenever you need help.
        </Text>
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
    paddingBottom: 100,
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  iconText: {
    fontSize: 27,
  },
  info: {
    flex: 1,
  },
  service: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  details: {
    color: '#6B7280',
    marginTop: 5,
  },
  status: {
    color: '#F59E0B',
    marginTop: 6,
    fontSize: 12,
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  emptyText: {
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 7,
  },
});