import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import { COLORS } from '@/components/ui/common';

export default function SuspendedScreen() {
  const { signOut } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🚫</Text>
      <Text style={styles.title}>Account Suspended</Text>
      <Text style={styles.message}>Your AutoFix account has been suspended. Please contact support for assistance.</Text>
      <Pressable style={styles.button} onPress={async () => { await signOut(); router.replace('/(auth)/login'); }}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#F7F8FA' },
  icon: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 8 },
  message: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  button: { backgroundColor: COLORS.primary, borderRadius: 12, padding: 16, paddingHorizontal: 32 },
  buttonText: { color: '#111827', fontSize: 16, fontWeight: '800' },
});
