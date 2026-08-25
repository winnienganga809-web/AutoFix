import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router, Redirect } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import { COLORS } from '@/components/ui/common';

export default function LoginScreen() {
  const { signIn, user, profile, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <View style={styles.container}><Text style={styles.loadingText}>Loading...</Text></View>;
  if (user && profile) {
    if (profile.role === 'customer') return <Redirect href="/(customer)/home" />;
    if (profile.role === 'mechanic') return <Redirect href="/(mechanic)/home" />;
    if (profile.role === 'admin') return <Redirect href="/(admin)/home" />;
  }

  const handleLogin = async () => {
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setSubmitting(true); setError(null);
    const { error } = await signIn(email.trim(), password);
    if (error) { setError(error); setSubmitting(false); }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.logo}>AutoFix</Text>
          <Text style={styles.tagline}>Your car. Our expertise.</Text>
        </View>
        <View style={styles.form}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to your AutoFix account</Text>
          {error && <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} placeholder="you@example.com" placeholderTextColor="#94A3B8" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput style={styles.input} placeholder="Enter your password" placeholderTextColor="#94A3B8" value={password} onChangeText={setPassword} secureTextEntry />
          </View>
          <Pressable style={[styles.button, submitting && styles.buttonDisabled]} onPress={handleLogin} disabled={submitting}>
            <Text style={styles.buttonText}>{submitting ? 'Signing in...' : 'Sign In'}</Text>
          </Pressable>
          <Pressable style={styles.linkButton} onPress={() => router.push('/(auth)/signup')}>
            <Text style={styles.linkText}>Don't have an account? <Text style={styles.linkHighlight}>Sign up</Text></Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  scrollContent: { flexGrow: 1, padding: 24 },
  loadingText: { textAlign: 'center', marginTop: 100, fontSize: 16, color: '#64748B' },
  header: { alignItems: 'center', paddingTop: 60, paddingBottom: 30 },
  logo: { fontSize: 36, fontWeight: '900', color: COLORS.primary },
  tagline: { fontSize: 14, color: '#64748B', marginTop: 4 },
  form: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827' },
  subtitle: { fontSize: 14, color: '#64748B', marginTop: 4, marginBottom: 24 },
  errorBox: { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', borderRadius: 12, padding: 14, marginBottom: 16 },
  errorText: { color: '#991B1B', fontSize: 13 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 14, fontSize: 15, color: '#111827', backgroundColor: '#F8FAFC' },
  button: { backgroundColor: COLORS.primary, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#111827', fontSize: 16, fontWeight: '800' },
  linkButton: { alignItems: 'center', marginTop: 20 },
  linkText: { fontSize: 14, color: '#64748B' },
  linkHighlight: { color: COLORS.primary, fontWeight: '700' },
});
