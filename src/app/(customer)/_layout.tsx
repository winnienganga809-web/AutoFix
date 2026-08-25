import { Stack, Redirect } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '@/components/ui/common';

export default function CustomerLayout() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <View style={styles.container}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }
  if (!user || !profile) return <Redirect href="/(auth)/login" />;
  if (profile.role !== 'customer') {
    if (profile.role === 'mechanic') return <Redirect href="/(mechanic)/home" />;
    if (profile.role === 'admin') return <Redirect href="/(admin)/home" />;
  }
  if (profile.is_suspended) return <Redirect href="/(auth)/suspended" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7F8FA' } });
