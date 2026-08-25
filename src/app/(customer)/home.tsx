import { useEffect, useState, useCallback } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Platform, Image } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';
import { DashboardShell } from '@/components/ui/dashboard-nav';
import { customerNav } from '@/lib/nav-config';
import {
  COLORS,
  StatCard,
  StatusBadge,
  LoadingState,
  EmptyState,
  SectionHeader,
} from '@/components/ui/common';
import { formatKSh, JOB_STATUS_LABELS, JOB_STATUS_COLORS, timeAgo } from '@/lib/utils';
import { Job, Vehicle } from '@/types/database';

// Statuses that represent an in-progress service request.
const ACTIVE_STATUSES = [
  'request_submitted',
  'mechanic_searching',
  'mechanic_accepted',
  'mechanic_travelling',
  'mechanic_arrived',
  'work_started',
  'work_completed',
  'payment',
];

interface ActiveJob extends Job {
  mechanic_name?: string | null;
}

interface DashboardData {
  activeJobs: ActiveJob[];
  completedJobs: Job[];
  vehicles: Vehicle[];
  totalSpent: number;
}

export default function CustomerHomeScreen() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData>({
    activeJobs: [],
    completedJobs: [],
    vehicles: [],
    totalSpent: 0,
  });

  const loadData = useCallback(async () => {
    if (!profile?.id) return;
    setLoading(true);

    try {
      const [activeRes, completedRes, vehiclesRes] = await Promise.all([
        supabase
          .from('jobs')
          .select('*, mechanic:profiles!jobs_mechanic_id_fkey(full_name)')
          .eq('customer_id', profile.id)
          .in('status', ACTIVE_STATUSES)
          .order('created_at', { ascending: false }),
        supabase
          .from('jobs')
          .select('*')
          .eq('customer_id', profile.id)
          .eq('status', 'completed_reviewed')
          .order('created_at', { ascending: false })
          .limit(3),
        supabase
          .from('vehicles')
          .select('*')
          .eq('customer_id', profile.id)
          .order('created_at', { ascending: false }),
      ]);

      const activeJobs: ActiveJob[] = (activeRes.data ?? []).map((row: any) => ({
        ...(row as Job),
        mechanic_name: row?.mechanic?.full_name ?? null,
      }));

      const completedJobs: Job[] = (completedRes.data ?? []) as Job[];
      const vehicles: Vehicle[] = (vehiclesRes.data ?? []) as Vehicle[];

      const totalSpent = completedJobs.reduce(
        (sum, j) => sum + (j.final_price ?? j.estimated_price ?? 0),
        0,
      );

      setData({ activeJobs, completedJobs, vehicles, totalSpent });
    } catch (err) {
      console.error('Failed to load customer dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [profile?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const firstName = (profile?.full_name || 'there').split(' ')[0];
  const initials = (profile?.full_name || '?')
    .split(' ')
    .map((p) => p.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const activeJob = data.activeJobs[0] ?? null;

  return (
    <DashboardShell items={customerNav} role="Customer">
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.name}>{firstName} 👋</Text>
          </View>
          {profile?.avatar_url ? (
            <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarFallbackText}>{initials}</Text>
            </View>
          )}
        </View>

        {/* Request mechanic CTA */}
        <Pressable
          style={styles.ctaButton}
          onPress={() => router.push('/(customer)/request' as any)}
        >
          <View style={styles.ctaContent}>
            <Text style={styles.ctaIcon}>🔧</Text>
            <View style={styles.ctaTextWrap}>
              <Text style={styles.ctaTitle}>Request a Mechanic</Text>
              <Text style={styles.ctaSubtitle}>Get help on-demand, anywhere in Nairobi</Text>
            </View>
          </View>
          <Text style={styles.ctaArrow}>→</Text>
        </Pressable>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatCard
            label="Total Spent"
            value={formatKSh(data.totalSpent)}
            icon="💰"
            color={COLORS.success}
          />
          <StatCard
            label="Active Jobs"
            value={String(data.activeJobs.length)}
            icon="🔧"
            color={COLORS.primary}
          />
          <StatCard
            label="Vehicles"
            value={String(data.vehicles.length)}
            icon="🚗"
            color={COLORS.info}
          />
        </View>

        {loading ? (
          <LoadingState message="Loading your dashboard..." />
        ) : (
          <>
            {/* Active service request */}
            <View style={styles.section}>
              <SectionHeader
                title="Active Service Request"
                actionLabel={data.activeJobs.length > 1 ? 'View all' : undefined}
                onAction={
                  data.activeJobs.length > 1
                    ? () => router.push('/(customer)/bookings' as any)
                    : undefined
                }
              />
              {activeJob ? (
                <Pressable
                  style={styles.activeCard}
                  onPress={() => router.push('/(customer)/bookings' as any)}
                >
                  <View style={styles.activeCardTop}>
                    <View style={styles.activeCardLeft}>
                      <Text style={styles.activeService}>{activeJob.service_name}</Text>
                      <Text style={styles.activeTime}>
                        {timeAgo(activeJob.created_at)}
                      </Text>
                    </View>
                    <StatusBadge status={activeJob.status} />
                  </View>
                  {activeJob.problem_description ? (
                    <Text style={styles.activeProblem} numberOfLines={2}>
                      {activeJob.problem_description}
                    </Text>
                  ) : null}
                  <View style={styles.activeCardFooter}>
                    <Text style={styles.activeMechanic}>
                      {activeJob.mechanic_name
                        ? `🧑‍🔧 ${activeJob.mechanic_name}`
                        : activeJob.status === 'request_submitted' ||
                          activeJob.status === 'mechanic_searching'
                        ? '🔎 Searching for a mechanic...'
                        : '⏳ Mechanic being assigned'}
                    </Text>
                    {activeJob.estimated_price ? (
                      <Text style={styles.activePrice}>
                        {formatKSh(activeJob.estimated_price)}
                      </Text>
                    ) : null}
                  </View>
                </Pressable>
              ) : (
                <View style={styles.emptyCard}>
                  <EmptyState
                    icon="🛠️"
                    title="No active service request"
                    message="Need a mechanic? Request one now and we'll match you with a verified pro."
                    actionLabel="Request Mechanic"
                    onAction={() => router.push('/(customer)/request' as any)}
                  />
                </View>
              )}
            </View>

            {/* Recent completed services */}
            <View style={styles.section}>
              <SectionHeader
                title="Recent Services"
                actionLabel="View all"
                onAction={() => router.push('/(customer)/bookings' as any)}
              />
              {data.completedJobs.length > 0 ? (
                <View style={styles.listCard}>
                  {data.completedJobs.map((job, idx) => (
                    <Pressable
                      key={job.id}
                      style={[styles.listItem, idx > 0 && styles.listItemBorder]}
                      onPress={() => router.push('/(customer)/bookings' as any)}
                    >
                      <View style={styles.listItemLeft}>
                        <View style={styles.listIconBox}>
                          <Text style={styles.listIcon}>✅</Text>
                        </View>
                        <View style={styles.listItemText}>
                          <Text style={styles.listService} numberOfLines={1}>
                            {job.service_name}
                          </Text>
                          <Text style={styles.listTime}>
                            {timeAgo(job.created_at)} ·{' '}
                            {job.final_price
                              ? formatKSh(job.final_price)
                              : job.estimated_price
                              ? formatKSh(job.estimated_price)
                              : '—'}
                          </Text>
                        </View>
                      </View>
                      <StatusBadge status={job.status} />
                    </Pressable>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyCard}>
                  <EmptyState
                    icon="📋"
                    title="No completed services yet"
                    message="Your finished jobs will show up here once they're done."
                  />
                </View>
              )}
            </View>

            {/* Saved vehicles */}
            <View style={styles.section}>
              <SectionHeader
                title="Your Vehicles"
                actionLabel="Manage"
                onAction={() => router.push('/(customer)/vehicles' as any)}
              />
              {data.vehicles.length > 0 ? (
                <View style={styles.vehiclesGrid}>
                  {data.vehicles.slice(0, 4).map((v) => (
                    <Pressable
                      key={v.id}
                      style={styles.vehicleCard}
                      onPress={() => router.push('/(customer)/vehicles' as any)}
                    >
                      <Text style={styles.vehicleEmoji}>🚗</Text>
                      <Text style={styles.vehicleName} numberOfLines={1}>
                        {v.make} {v.model}
                      </Text>
                      <Text style={styles.vehicleReg} numberOfLines={1}>
                        {v.registration_number}
                      </Text>
                      {v.year ? <Text style={styles.vehicleYear}>{v.year}</Text> : null}
                    </Pressable>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyCard}>
                  <EmptyState
                    icon="🚗"
                    title="No vehicles saved"
                    message="Add your vehicle to get faster, more accurate service requests."
                    actionLabel="Add Vehicle"
                    onAction={() => router.push('/(customer)/vehicles' as any)}
                  />
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </DashboardShell>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: {
    padding: 16,
    maxWidth: 900,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: 32,
  },
  // Welcome header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: Platform.OS === 'web' ? 8 : 16,
  },
  headerText: { flex: 1 },
  greeting: { fontSize: 15, color: COLORS.textSecondary, fontWeight: '600' },
  name: { fontSize: 26, fontWeight: '900', color: COLORS.textPrimary, marginTop: 2 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.border },
  avatarFallback: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFallbackText: { fontSize: 18, fontWeight: '800', color: '#111827' },
  // CTA button
  ctaButton: {
    backgroundColor: COLORS.dark,
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  ctaContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  ctaIcon: { fontSize: 28, marginRight: 14 },
  ctaTextWrap: { flex: 1 },
  ctaTitle: { fontSize: 17, fontWeight: '800', color: '#F8FAFC' },
  ctaSubtitle: { fontSize: 13, color: '#94A3B8', marginTop: 2 },
  ctaArrow: { fontSize: 22, color: COLORS.primary, fontWeight: '700', marginLeft: 12 },
  // Stats row
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  // Sections
  section: { marginBottom: 24 },
  // Active service card
  activeCard: {
    backgroundColor: COLORS.dark,
    borderRadius: 18,
    padding: 18,
  },
  activeCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  activeCardLeft: { flex: 1, marginRight: 12 },
  activeService: { fontSize: 17, fontWeight: '800', color: '#F8FAFC' },
  activeTime: { fontSize: 12, color: '#94A3B8', marginTop: 4 },
  activeProblem: {
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 19,
    marginBottom: 14,
  },
  activeCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  activeMechanic: { fontSize: 13, color: '#CBD5E1', fontWeight: '600', flex: 1 },
  activePrice: { fontSize: 15, fontWeight: '800', color: COLORS.primary, marginLeft: 12 },
  // Recent services list
  listCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 4,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 1 },
      web: { boxShadow: '0px 1px 3px rgba(0,0,0,0.04)' },
    }),
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  listItemBorder: { borderTopWidth: 1, borderTopColor: COLORS.border },
  listItemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 12 },
  listIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: `${COLORS.success}18`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  listIcon: { fontSize: 18 },
  listItemText: { flex: 1 },
  listService: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  listTime: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  // Vehicles grid
  vehiclesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  vehicleCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    minWidth: 150,
    flex: 1,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 1 },
      web: { boxShadow: '0px 1px 3px rgba(0,0,0,0.04)' },
    }),
  },
  vehicleEmoji: { fontSize: 26, marginBottom: 8 },
  vehicleName: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary },
  vehicleReg: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '700',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  vehicleYear: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  // Empty states
  emptyCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    minHeight: 180,
  },
});
