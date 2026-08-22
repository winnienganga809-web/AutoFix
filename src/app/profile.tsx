import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProfileScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>Manage your AutoFix account</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.name}>AutoFix Customer</Text>
          <Text style={styles.email}>Welcome to AutoFix</Text>
          <Text style={styles.verified}>✓ Account ready</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Account</Text>

      <ProfileOption
        icon="🚗"
        title="My Vehicles"
        description="Manage your vehicles"
      />

      <ProfileOption
        icon="📍"
        title="Saved Locations"
        description="Manage your service locations"
      />

      <ProfileOption
        icon="🔔"
        title="Notifications"
        description="Manage your alerts"
      />

      <ProfileOption
        icon="🔒"
        title="Privacy & Security"
        description="Protect your account"
      />

      <ProfileOption
        icon="⚙️"
        title="Settings"
        description="App preferences"
      />

      <TouchableOpacity style={styles.helpButton}>
        <Text style={styles.helpIcon}>❓</Text>
        <View>
          <Text style={styles.helpTitle}>Need Help?</Text>
          <Text style={styles.helpText}>
            Contact AutoFix support
          </Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.version}>AutoFix • Version 1.0.0</Text>
    </ScrollView>
  );
}

function ProfileOption({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <TouchableOpacity style={styles.option}>
      <View style={styles.optionIcon}>
        <Text style={styles.optionIconText}>{icon}</Text>
      </View>

      <View style={styles.optionInfo}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionDescription}>{description}</Text>
      </View>

      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
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

  profileCard: {
    backgroundColor: '#111827',
    borderRadius: 22,
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },

  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },

  avatarText: {
    fontSize: 32,
  },

  userInfo: {
    flex: 1,
  },

  name: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
  },

  email: {
    color: '#D1D5DB',
    marginTop: 5,
  },

  verified: {
    color: '#FBBF24',
    marginTop: 6,
    fontSize: 12,
    fontWeight: '700',
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 14,
  },

  option: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  optionIconText: {
    fontSize: 23,
  },

  optionInfo: {
    flex: 1,
  },

  optionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },

  optionDescription: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 3,
  },

  arrow: {
    color: '#9CA3AF',
    fontSize: 28,
  },

  helpButton: {
    backgroundColor: '#FFF7ED',
    borderRadius: 18,
    padding: 18,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },

  helpIcon: {
    fontSize: 25,
    marginRight: 14,
  },

  helpTitle: {
    fontWeight: '800',
    color: '#111827',
  },

  helpText: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 3,
  },

  version: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 25,
  },
});