import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';
import { COLORS, LoadingState, EmptyState } from '@/components/ui/common';
import { formatKSh, KENYAN_LOCATIONS } from '@/lib/utils';
import { Service, Vehicle } from '@/types/database';
import { DashboardShell } from '@/components/ui/dashboard-nav';
import { customerNav } from '@/lib/nav-config';

type DropdownKey = 'vehicle' | 'location' | null;

export default function RequestScreen() {
  const { profile } = useAuth();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [problemDescription, setProblemDescription] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  const fetchData = useCallback(async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const [vehiclesRes, servicesRes] = await Promise.all([
        supabase
          .from('vehicles')
          .select('*')
          .eq('customer_id', profile.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('services')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true }),
      ]);

      if (vehiclesRes.error) throw vehiclesRes.error;
      if (servicesRes.error) throw servicesRes.error;

      const vehicleData = (vehiclesRes.data as Vehicle[]) ?? [];
      const serviceData = (servicesRes.data as Service[]) ?? [];
      setVehicles(vehicleData);
      setServices(serviceData);

      // Preselect the customer's saved location if it matches a known area.
      if (profile.location && KENYAN_LOCATIONS.includes(profile.location)) {
        setSelectedLocation(profile.location);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load data.';
      Alert.alert('Something went wrong', message);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const selectedVehicle = useMemo(
    () => vehicles.find((v) => v.id === selectedVehicleId) ?? null,
    [vehicles, selectedVehicleId],
  );

  const selectedService = useMemo(
    () => services.find((s) => s.id === selectedServiceId) ?? null,
    [services, selectedServiceId],
  );

  const estimatedPrice = selectedService?.base_price ?? 0;

  const canSubmit =
    !!selectedVehicle &&
    !!selectedService &&
    problemDescription.trim().length > 0 &&
    selectedLocation.length > 0 &&
    !submitting;

  const toggleDropdown = (key: Exclude<DropdownKey, null>) => {
    setOpenDropdown((curr) => (curr === key ? null : key));
  };

  const handleVehicleSelect = (id: string) => {
    setSelectedVehicleId(id);
    setOpenDropdown(null);
  };

  const handleLocationSelect = (loc: string) => {
    setSelectedLocation(loc);
    setOpenDropdown(null);
  };

  const handleSubmit = async () => {
    if (!profile || !selectedVehicle || !selectedService) return;

    if (problemDescription.trim().length === 0) {
      Alert.alert('Describe the problem', 'Please tell the mechanic what is happening with your vehicle.');
      return;
    }
    if (!selectedLocation) {
      Alert.alert('Select location', 'Please choose where the mechanic should meet you.');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('jobs').insert({
        customer_id: profile.id,
        vehicle_id: selectedVehicle.id,
        service_id: selectedService.id,
        service_name: selectedService.name,
        problem_description: problemDescription.trim(),
        customer_location_text: selectedLocation,
        estimated_price: selectedService.base_price,
        status: 'request_submitted',
      });

      if (error) throw error;

      router.replace('/(customer)/bookings');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not submit your request. Please try again.';
      Alert.alert('Submission failed', message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell items={customerNav} role="customer">
        <LoadingState message="Loading your vehicles and services…" />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell items={customerNav} role="customer">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Request a Mechanic</Text>
            <Text style={styles.subtitle}>
              Tell us what you need and we&apos;ll match you with a nearby mechanic.
            </Text>
          </View>

          {/* No vehicles */}
          {vehicles.length === 0 && (
            <View style={styles.sectionCard}>
              <EmptyState
                icon="🚗"
                title="No vehicles saved"
                message="Add a vehicle to your profile before requesting a mechanic."
                actionLabel="Go to Vehicles"
                onAction={() => router.push('/(customer)/vehicles' as any)}
              />
            </View>
          )}

          {/* No services */}
          {vehicles.length > 0 && services.length === 0 && (
            <View style={styles.sectionCard}>
              <EmptyState
                icon="🛠️"
                title="No services available"
                message="There are no active services right now. Please check back shortly."
              />
            </View>
          )}

          {vehicles.length > 0 && services.length > 0 && (
            <>
              {/* 1. Vehicle selection */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>
                  <Text style={styles.stepBadge}>1</Text> Select Vehicle
                </Text>
                <Text style={styles.sectionHint}>Which vehicle needs attention?</Text>

                <Pressable
                  style={styles.dropdownHeader}
                  onPress={() => toggleDropdown('vehicle')}
                  accessibilityRole="button"
                  accessibilityLabel="Select vehicle"
                >
                  <Text
                    style={selectedVehicle ? styles.dropdownValue : styles.dropdownPlaceholder}
                    numberOfLines={1}
                  >
                    {selectedVehicle
                      ? `${selectedVehicle.make} ${selectedVehicle.model} · ${selectedVehicle.registration_number}`
                      : 'Choose a vehicle…'}
                  </Text>
                  <Text style={[styles.chevron, openDropdown === 'vehicle' && styles.chevronOpen]}>
                    ⌄
                  </Text>
                </Pressable>

                {openDropdown === 'vehicle' && (
                  <View style={styles.dropdownPanel}>
                    <ScrollView nestedScrollEnabled style={styles.dropdownScroll}>
                      {vehicles.map((v) => {
                        const active = v.id === selectedVehicleId;
                        return (
                          <Pressable
                            key={v.id}
                            style={[styles.dropdownItem, active && styles.dropdownItemActive]}
                            onPress={() => handleVehicleSelect(v.id)}
                          >
                            <Text style={styles.dropdownItemTitle}>
                              {v.make} {v.model}
                              {v.year ? ` (${v.year})` : ''}
                            </Text>
                            <Text style={styles.dropdownItemSub}>{v.registration_number}</Text>
                            {active && <Text style={styles.dropdownItemCheck}>✓</Text>}
                          </Pressable>
                        );
                      })}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* 2. Service category */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>
                  <Text style={styles.stepBadge}>2</Text> Service Category
                </Text>
                <Text style={styles.sectionHint}>Pick the type of service you need.</Text>

                <View style={styles.serviceGrid}>
                  {services.map((service) => {
                    const active = service.id === selectedServiceId;
                    return (
                      <Pressable
                        key={service.id}
                        style={[styles.serviceCard, active && styles.serviceCardActive]}
                        onPress={() => setSelectedServiceId(service.id)}
                      >
                        <Text style={[styles.serviceIcon, active && styles.serviceIconActive]}>
                          {service.icon || '🛠️'}
                        </Text>
                        <Text
                          style={[styles.serviceName, active && styles.serviceNameActive]}
                          numberOfLines={2}
                        >
                          {service.name}
                        </Text>
                        <Text style={[styles.servicePrice, active && styles.servicePriceActive]}>
                          {formatKSh(service.base_price)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* 3. Problem description */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>
                  <Text style={styles.stepBadge}>3</Text> Describe the Problem
                </Text>
                <Text style={styles.sectionHint}>Share any symptoms, sounds, or details that help the mechanic.</Text>

                <TextInput
                  style={styles.textArea}
                  value={problemDescription}
                  onChangeText={setProblemDescription}
                  placeholder="e.g. The engine overheats after 15 minutes and coolant is leaking…"
                  placeholderTextColor={COLORS.textMuted}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  maxLength={1000}
                />
                <Text style={styles.charCount}>{problemDescription.length}/1000</Text>
              </View>

              {/* 4. Location */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>
                  <Text style={styles.stepBadge}>4</Text> Your Location
                </Text>
                <Text style={styles.sectionHint}>Where should the mechanic meet you?</Text>

                <Pressable
                  style={styles.dropdownHeader}
                  onPress={() => toggleDropdown('location')}
                  accessibilityRole="button"
                  accessibilityLabel="Select location"
                >
                  <Text
                    style={selectedLocation ? styles.dropdownValue : styles.dropdownPlaceholder}
                    numberOfLines={1}
                  >
                    {selectedLocation || 'Choose an area…'}
                  </Text>
                  <Text style={[styles.chevron, openDropdown === 'location' && styles.chevronOpen]}>
                    ⌄
                  </Text>
                </Pressable>

                {openDropdown === 'location' && (
                  <View style={styles.dropdownPanel}>
                    <ScrollView nestedScrollEnabled style={styles.dropdownScroll}>
                      {KENYAN_LOCATIONS.map((loc) => {
                        const active = loc === selectedLocation;
                        return (
                          <Pressable
                            key={loc}
                            style={[styles.dropdownItem, active && styles.dropdownItemActive]}
                            onPress={() => handleLocationSelect(loc)}
                          >
                            <Text style={styles.dropdownItemTitle}>{loc}</Text>
                            {active && <Text style={styles.dropdownItemCheck}>✓</Text>}
                          </Pressable>
                        );
                      })}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* 5. Estimated price */}
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Estimated price</Text>
                  <Text style={styles.summaryValue}>
                    {selectedService ? formatKSh(estimatedPrice) : '—'}
                  </Text>
                </View>
                <Text style={styles.summaryNote}>
                  Final price may vary after the mechanic inspects the vehicle.
                </Text>
              </View>

              {/* Submit */}
              <Pressable
                style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={!canSubmit}
              >
                <Text style={styles.submitButtonText}>
                  {submitting ? 'Submitting…' : 'Submit Request'}
                </Text>
              </Pressable>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </DashboardShell>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40, maxWidth: 720, width: '100%', alignSelf: 'center' },

  header: { marginBottom: 20 },
  title: { fontSize: 26, fontWeight: '900', color: COLORS.textPrimary },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 6, lineHeight: 20 },

  sectionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 4 },
  stepBadge: {
    color: COLORS.primary,
    fontWeight: '900',
    marginRight: 6,
  },
  sectionHint: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 14 },

  // Dropdown
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  dropdownValue: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary, flex: 1 },
  dropdownPlaceholder: { fontSize: 15, color: COLORS.textMuted, flex: 1 },
  chevron: { fontSize: 20, color: COLORS.textMuted, marginLeft: 8 },
  chevronOpen: { color: COLORS.primary, transform: [{ rotate: '180deg' }] },

  dropdownPanel: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  dropdownScroll: { maxHeight: 240 },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownItemActive: { backgroundColor: `${COLORS.primary}12` },
  dropdownItemTitle: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary, flex: 1 },
  dropdownItemSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  dropdownItemCheck: { fontSize: 16, fontWeight: '900', color: COLORS.primary, marginLeft: 8 },

  // Service grid
  serviceGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 },
  serviceCard: {
    backgroundColor: COLORS.darkCard,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 6,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    width: '46%',
  },
  serviceCardActive: {
    backgroundColor: COLORS.darkCard,
    borderColor: COLORS.primary,
  },
  serviceIcon: { fontSize: 30, marginBottom: 10, color: '#F1F5F9' },
  serviceIconActive: { color: COLORS.primary },
  serviceName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E2E8F0',
    textAlign: 'center',
    minHeight: 36,
    marginBottom: 6,
  },
  serviceNameActive: { color: '#FFFFFF' },
  servicePrice: { fontSize: 13, fontWeight: '800', color: COLORS.primary },
  servicePriceActive: { color: '#FFFFFF' },

  // Text area
  textArea: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: COLORS.textPrimary,
    backgroundColor: '#FFFFFF',
    minHeight: 110,
    textAlignVertical: 'top',
  },
  charCount: { fontSize: 12, color: COLORS.textMuted, textAlign: 'right', marginTop: 6 },

  // Summary
  summaryCard: {
    backgroundColor: COLORS.darkCard,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 14, color: '#CBD5E1', fontWeight: '600' },
  summaryValue: { fontSize: 22, fontWeight: '900', color: COLORS.primary },
  summaryNote: { fontSize: 12, color: '#94A3B8', marginTop: 8, lineHeight: 17 },

  // Submit
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: { backgroundColor: `${COLORS.primary}66` },
  submitButtonText: { fontSize: 16, fontWeight: '800', color: '#111827' },
});
