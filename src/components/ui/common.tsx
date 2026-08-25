import { ActivityIndicator, StyleSheet, Text, View, Pressable } from 'react-native';
import { JOB_STATUS_COLORS, JOB_STATUS_LABELS } from '@/lib/utils';

export const COLORS = {
  primary: '#F59E0B',
  primaryDark: '#D97706',
  dark: '#111827',
  darkCard: '#1F2937',
  light: '#F8FAFC',
  card: '#FFFFFF',
  border: '#E2E8F0',
  textPrimary: '#111827',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  accent: '#F59E0B',
  background: '#F7F8FA',
  surface: '#FFFFFF',
};

export function StatusBadge({ status, label, color }: { status: string; label?: string; color?: string }) {
  const badgeColor = color || JOB_STATUS_COLORS[status] || '#64748B';
  const text = label || JOB_STATUS_LABELS[status] || status;
  return (
    <View style={[badgeStyles.container, { backgroundColor: `${badgeColor}15`, borderColor: `${badgeColor}40` }]}>
      <View style={[badgeStyles.dot, { backgroundColor: badgeColor }]} />
      <Text style={[badgeStyles.text, { color: badgeColor }]}>{text}</Text>
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, alignSelf: 'flex-start' },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  text: { fontSize: 12, fontWeight: '700' },
});

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <View style={loadingStyles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={loadingStyles.text}>{message}</Text>
    </View>
  );
}

const loadingStyles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  text: { marginTop: 12, fontSize: 14, color: COLORS.textSecondary },
});

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View style={errorStyles.container}>
      <Text style={errorStyles.icon}>⚠️</Text>
      <Text style={errorStyles.title}>Something went wrong</Text>
      <Text style={errorStyles.message}>{message}</Text>
      {onRetry && <Pressable onPress={onRetry}><Text style={errorStyles.retry}>Try again</Text></Pressable>}
    </View>
  );
}

const errorStyles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  icon: { fontSize: 48, marginBottom: 12 },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 6 },
  message: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 16 },
  retry: { fontSize: 14, color: COLORS.primary, fontWeight: '700' },
});

export function EmptyState({ icon, title, message, actionLabel, onAction }: {
  icon: string; title: string; message: string; actionLabel?: string; onAction?: () => void;
}) {
  return (
    <View style={emptyStyles.container}>
      <Text style={emptyStyles.icon}>{icon}</Text>
      <Text style={emptyStyles.title}>{title}</Text>
      <Text style={emptyStyles.message}>{message}</Text>
      {actionLabel && onAction && <Pressable onPress={onAction}><Text style={emptyStyles.action}>{actionLabel}</Text></Pressable>}
    </View>
  );
}

const emptyStyles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  icon: { fontSize: 56, marginBottom: 16 },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 8 },
  message: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 },
  action: { marginTop: 16, fontSize: 15, fontWeight: '700', color: COLORS.primary },
});

export function StatCard({ label, value, icon, color }: {
  label: string; value: string; icon: string; color?: string;
}) {
  return (
    <View style={statStyles.container}>
      <View style={[statStyles.iconBox, { backgroundColor: `${color || COLORS.primary}20` }]}>
        <Text style={statStyles.icon}>{icon}</Text>
      </View>
      <Text style={statStyles.value}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  container: { backgroundColor: COLORS.card, borderRadius: 16, padding: 16, flex: 1, minWidth: 140 },
  iconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  icon: { fontSize: 22 },
  value: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary },
  label: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
});

export function SectionHeader({ title, actionLabel, onAction }: {
  title: string; actionLabel?: string; onAction?: () => void;
}) {
  return (
    <View style={sectionStyles.container}>
      <Text style={sectionStyles.title}>{title}</Text>
      {actionLabel && onAction && (
        <Pressable onPress={onAction}><Text style={sectionStyles.action}>{actionLabel}</Text></Pressable>
      )}
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  action: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
});
