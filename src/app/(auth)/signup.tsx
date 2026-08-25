import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router, Redirect } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import { COLORS } from '@/components/ui/common';
import { UserRole } from '@/types/database';

export default function SignupScreen() {
  const { signUp, user, profile, loading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <View style={styles.container}><Text style={styles.loadingText}>Loading...</Text></View>;
  if (user && profile) {
    if (profile.role === 'customer') return <Redirect href="/(customer)/home" />;
    if (profile.role === 'mechanic') return <Redirect href="/(mechanic)/home" />;
    if (profile.role === 'admin') return <Redirect href="/(admin)/home" />;
  }

  const handleSignup = async () => {
    if (!fullName || !email || !phone || !password) { setError('Please fill in all fields.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setSubmitting(true); setError(null);
    const { error } = await signUp(email.trim(), password, fullName.trim(), phone.trim(), role);
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
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>Join AutoFix today</Text>
          {error && <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>}
          <Text style={styles.sectionLabel}>I want to:</Text>
          <View style={styles.roleContainer}>
            <Pressable style={[styles.roleCard, role === 'customer' && styles.roleCardActive]} onPress={() => setRole('customer')}>
              <Text style={styles.roleIcon}>🚗</Text>
              <Text style={[styles.roleTitle, role === 'customer' && styles.roleTitleActive]}>Get Help</Text>
              <Text style={[styles.roleDesc, role === 'customer' && styles.roleDescActive]}>Find mechanics for my vehicle</Text>
            </Pressable>
            <Pressable style={[styles.roleCard, role === 'mechanic' && styles.roleCardActive]} onPress={() => setRole('mechanic')}>
              <Text style={styles.roleIcon}>🔧</Text>
              <Text style={[styles.roleTitle, role === 'mechanic' && styles.roleTitleActive]}>Offer Services</Text>
              <Text style={[styles.roleDesc, role === 'mechanic' && styles.roleDescActive]}>Accept jobs and earn money</Text>
            </Pressable>
          </View>
          <View style={styles.inputGroup}><Text style={styles.label}>Full Name</Text><TextInput style={styles.input} placeholder="John Mwangi" placeholderTextColor="#94A3B8" value={fullName} onChangeText={setFullName} /></View>
          <View style={styles.inputGroup}><Text style={styles.label}>Email</Text><TextInput style={styles.input} placeholder="you@example.com" placeholderTextColor="#94A3B8" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" /></View>
          <View style={styles.inputGroup}><Text style={styles.label}>Phone (M-Pesa)</Text><TextInput style={styles.input} placeholder="0712345678" placeholderTextColor="#94A3B8" value={phone} onChangeText={setPhone} keyboardType="phone-pad" /></View>
          <View style={styles.inputGroup}><Text style={styles.label}>Password</Text><TextInput style={styles.input} placeholder="At least 6 characters" placeholderTextColor="#94A3B8" value={password} onChangeText={setPassword} secureTextEntry /></View>
          <Pressable style={[styles.button, submitting && styles.buttonDisabled]} onPress={handleSignup} disabled={submitting}>
            <Text style={styles.buttonText}>{submitting ? 'Creating account...' : 'Create Account'}</Text>
          </Pressable>
          <Pressable style={styles.linkButton} onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.linkText}>Already have an account? <Text style={styles.linkHighlight}>Sign in</Text></Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  scrollContent: { flexGrow: 1, padding: 24, paddingBottom: 60 },
  loadingText: { textAlign: 'center', marginTop: 100, fontSize: 16, color: '#64748B' },
  header: { alignItems: 'center', paddingTop: 50, paddingBottom: 24 },
  logo: { fontSize: 36, fontWeight: '900', color: COLORS.primary },
  tagline: { fontSize: 14, color: '#64748B', marginTop: 4 },
  form: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827' },
  subtitle: { fontSize: 14, color: '#64748B', marginTop: 4, marginBottom: 20 },
  errorBox: { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', borderRadius: 12, padding: 14, marginBottom: 16 },
  errorText: { color: '#991B1B', fontSize: 13 },
  sectionLabel: { fontSize: 14, fontWeight: '700', color: '#374151', marginBottom: 10 },
  roleContainer: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  roleCard: { flex: 1, borderWidth: 2, borderColor: '#E2E8F0', borderRadius: 14, padding: 16, alignItems: 'center' },
  roleCardActive: { borderColor: COLORS.primary, backgroundColor: `${COLORS.primary}10` },
  roleIcon: { fontSize: 28, marginBottom: 8 },
  roleTitle: { fontSize: 14, fontWeight: '700', color: '#374151' },
  roleTitleActive: { color: COLORS.primary },
  roleDesc: { fontSize: 11, color: '#94A3B8', textAlign: 'center', marginTop: 4 },
  roleDescActive: { color: COLORS.primaryDark },
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 14, fontSize: 15, color: '#111827', backgroundColor: '#F8FAFC' },
  button: { backgroundColor: COLORS.primary, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#111827', fontSize: 16, fontWeight: '800' },
  linkButton: { alignItems: 'center', marginTop: 20 },
  linkText: { fontSize: 14, color: '#64748B' },
  linkHighlight: { color: COLORS.primary, fontWeight: '700' },
});
