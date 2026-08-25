import { Redirect } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '@/context/auth-context';
import { COLORS } from '@/components/ui/common';

export default function Index() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!user || !profile) return <Redirect href="/(auth)/login" />;
  if (profile.is_suspended) return <Redirect href="/(auth)/suspended" />;
  if (profile.role === 'customer') return <Redirect href="/(customer)/home" />;
  if (profile.role === 'mechanic') return <Redirect href="/(mechanic)/home" />;
  if (profile.role === 'admin') return <Redirect href="/(admin)/home" />;
  return <Redirect href="/(auth)/login" />;
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7F8FA' },
});
