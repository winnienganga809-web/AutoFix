import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>AutoFix</Text>
        <Text style={styles.subtitle}>Your car. Our expertise.</Text>
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Need help with your car?</Text>
        <Text style={styles.heroText}>
          Get a trusted mechanic when and where you need one.
        </Text>

        <Pressable
          style={styles.primaryButton}
          onPress={() => router.push('/requests')}
        >
          <Text style={styles.primaryText}>Request a Mechanic</Text>
        </Pressable>

        <Pressable
          style={styles.emergencyButton}
          onPress={() => router.push('/requests')}
        >
          <Text style={styles.emergencyText}>🚨 Emergency Roadside Help</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Popular Services</Text>

      <View style={styles.grid}>
        <ServiceCard icon="🔧" title="Car Repair" />
        <ServiceCard icon="🛢️" title="Oil Change" />
        <ServiceCard icon="🔋" title="Battery Help" />
        <ServiceCard icon="🛞" title="Tyre Service" />
      </View>

      <Text style={styles.sectionTitle}>Why AutoFix?</Text>

      <View style={styles.feature}>
        <Text style={styles.featureIcon}>✓</Text>
        <View>
          <Text style={styles.featureTitle}>Trusted Mechanics</Text>
          <Text style={styles.featureText}>Get help from skilled technicians.</Text>
        </View>
      </View>

      <View style={styles.feature}>
        <Text style={styles.featureIcon}>⚡</Text>
        <View>
          <Text style={styles.featureTitle}>Fast Response</Text>
          <Text style={styles.featureText}>Request help whenever you need it.</Text>
        </View>
      </View>

      <View style={styles.feature}>
        <Text style={styles.featureIcon}>📍</Text>
        <View>
          <Text style={styles.featureTitle}>We Come To You</Text>
          <Text style={styles.featureText}>No need to tow your car to a garage.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function ServiceCard({ icon, title }: { icon: string; title: string }) {
  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push('/services')}
    >
      <Text style={styles.cardIcon}>{icon}</Text>
      <Text style={styles.cardTitle}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  header: {
    padding: 24,
    paddingTop: 35,
  },

  logo: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
  },

  subtitle: {
    marginTop: 4,
    color: '#64748B',
    fontSize: 15,
  },

  hero: {
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 24,
    backgroundColor: '#111827',
  },

  heroTitle: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '800',
  },

  heroText: {
    color: '#CBD5E1',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 22,
  },

  primaryButton: {
    backgroundColor: '#F59E0B',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },

  primaryText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '800',
  },

  emergencyButton: {
    marginTop: 12,
    padding: 15,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#475569',
    alignItems: 'center',
  },

  emergencyText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#111827',
    marginHorizontal: 20,
    marginTop: 28,
    marginBottom: 14,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 20,
  },

  card: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  cardIcon: {
    fontSize: 30,
  },

  cardTitle: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },

  feature: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 17,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  featureIcon: {
    fontSize: 22,
    marginRight: 14,
  },

  featureTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },

  featureText: {
    color: '#64748B',
    marginTop: 3,
  },
})