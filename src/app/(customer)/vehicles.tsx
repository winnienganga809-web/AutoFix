import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { DashboardShell } from '@/components/ui/dashboard-nav';
import { customerNav } from '@/lib/nav-config';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';
import { COLORS, LoadingState, EmptyState, SectionHeader } from '@/components/ui/common';
import { VEHICLE_MAKES } from '@/lib/utils';
import { Vehicle, FuelType } from '@/types/database';

const FUEL_TYPES: { value: FuelType; label: string; icon: string }[] = [
  { value: 'petrol', label: 'Petrol', icon: '⛽' },
  { value: 'diesel', label: 'Diesel', icon: '🛢️' },
  { value: 'hybrid', label: 'Hybrid', icon: '🌿' },
  { value: 'electric', label: 'Electric', icon: '⚡' },
  { value: 'unknown', label: 'Unknown', icon: '❓' },
];

interface VehicleForm {
  registration_number: string;
  make: string;
  model: string;
  year: string;
  fuel_type: FuelType;
}

const EMPTY_FORM: VehicleForm = {
  registration_number: '',
  make: '',
  model: '',
  year: '',
  fuel_type: 'petrol',
};

export default function VehiclesScreen() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Inline form state — rendered at the top of the screen when visible
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<VehicleForm>(EMPTY_FORM);

  const fetchVehicles = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      Alert.alert('Error', 'Could not load your vehicles. Please try again.');
    } else {
      setVehicles((data as Vehicle[]) || []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const updateForm = (key: keyof VehicleForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const openAddForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormVisible(true);
  };

  const openEditForm = (vehicle: Vehicle) => {
    setForm({
      registration_number: vehicle.registration_number,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year ? String(vehicle.year) : '',
      fuel_type: vehicle.fuel_type,
    });
    setEditingId(vehicle.id);
    setFormVisible(true);
  };

  const closeForm = () => {
    setFormVisible(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSave = async () => {
    if (!user) return;

    // --- Validation ---
    if (!form.registration_number.trim()) {
      Alert.alert('Missing info', 'Please enter the registration number.');
      return;
    }
    if (!form.make) {
      Alert.alert('Missing info', 'Please select a vehicle make.');
      return;
    }
    if (!form.model.trim()) {
      Alert.alert('Missing info', 'Please enter the vehicle model.');
      return;
    }

    const yearNum = form.year.trim() ? parseInt(form.year.trim(), 10) : null;
    const currentYear = new Date().getFullYear();
    if (yearNum !== null && (isNaN(yearNum) || yearNum < 1900 || yearNum > currentYear + 1)) {
      Alert.alert('Invalid year', `Please enter a year between 1900 and ${currentYear + 1}.`);
      return;
    }

    setSaving(true);

    const payload = {
      customer_id: user.id,
      registration_number: form.registration_number.trim().toUpperCase(),
      make: form.make,
      model: form.model.trim(),
      year: yearNum,
      fuel_type: form.fuel_type,
    };

    if (editingId) {
      const { error } = await supabase.from('vehicles').update(payload).eq('id', editingId);
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        closeForm();
        await fetchVehicles();
      }
    } else {
      const { error } = await supabase.from('vehicles').insert(payload);
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        closeForm();
        await fetchVehicles();
      }
    }

    setSaving(false);
  };

  const handleDelete = (vehicle: Vehicle) => {
    Alert.alert(
      'Delete Vehicle',
      `Remove ${vehicle.make} ${vehicle.model} (${vehicle.registration_number})?\n\nThis cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase.from('vehicles').delete().eq('id', vehicle.id);
            if (error) {
              Alert.alert('Error', error.message);
            } else {
              await fetchVehicles();
            }
          },
        },
      ],
    );
  };

  // ---------- Inline form (rendered at top of screen) ----------
  const renderForm = () => (
    <View style={styles.formCard}>
      <View style={styles.formHeader}>
        <Text style={styles.formTitle}>{editingId ? '✏️ Edit Vehicle' : '➕ Add Vehicle'}</Text>
      </View>

      {/* Registration Number */}
      <Text style={styles.label}>Registration Number</Text>
      <TextInput
        style={styles.input}
        value={form.registration_number}
        onChangeText={(v) => updateForm('registration_number', v)}
        placeholder="e.g. KDA 123A"
        placeholderTextColor={COLORS.textMuted}
        autoCapitalize="characters"
        autoCorrect={false}
      />

      {/* Make — picker from VEHICLE_MAKES */}
      <Text style={styles.label}>Make</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.makeScroll}>
        {VEHICLE_MAKES.map((make) => {
          const selected = form.make === make;
          return (
            <Pressable
              key={make}
              style={[styles.chip, selected && styles.chipSelected]}
              onPress={() => updateForm('make', make)}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{make}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Model */}
      <Text style={styles.label}>Model</Text>
      <TextInput
        style={styles.input}
        value={form.model}
        onChangeText={(v) => updateForm('model', v)}
        placeholder="e.g. Corolla, Vitz, CX-5"
        placeholderTextColor={COLORS.textMuted}
        autoCorrect={false}
      />

      {/* Year */}
      <Text style={styles.label}>Year</Text>
      <TextInput
        style={styles.input}
        value={form.year}
        onChangeText={(v) => updateForm('year', v.replace(/[^0-9]/g, ''))}
        placeholder="e.g. 2020"
        placeholderTextColor={COLORS.textMuted}
        keyboardType="numeric"
        maxLength={4}
      />

      {/* Fuel Type — picker */}
      <Text style={styles.label}>Fuel Type</Text>
      <View style={styles.fuelRow}>
        {FUEL_TYPES.map((ft) => {
          const selected = form.fuel_type === ft.value;
          return (
            <Pressable
              key={ft.value}
              style={[styles.fuelChip, selected && styles.fuelChipSelected]}
              onPress={() => updateForm('fuel_type', ft.value)}
            >
              <Text style={styles.fuelIcon}>{ft.icon}</Text>
              <Text style={[styles.fuelChipText, selected && styles.fuelChipTextSelected]}>
                {ft.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Save / Cancel */}
      <View style={styles.formActions}>
        <Pressable style={[styles.btn, styles.cancelBtn]} onPress={closeForm} disabled={saving}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </Pressable>
        <Pressable
          style={[styles.btn, styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveBtnText}>{saving ? 'Saving…' : 'Save Vehicle'}</Text>
        </Pressable>
      </View>
    </View>
  );

  // ---------- Vehicle card ----------
  const renderVehicleCard = (vehicle: Vehicle) => {
    const fuel = FUEL_TYPES.find((f) => f.value === vehicle.fuel_type);
    return (
      <View key={vehicle.id} style={styles.vehicleCard}>
        <View style={styles.vehicleHeader}>
          <View style={styles.vehicleIconBox}>
            <Text style={styles.vehicleIcon}>🚗</Text>
          </View>
          <View style={styles.vehicleMain}>
            <Text style={styles.vehicleReg}>{vehicle.registration_number}</Text>
            <Text style={styles.vehicleName}>
              {vehicle.make} {vehicle.model}
            </Text>
          </View>
        </View>

        <View style={styles.vehicleDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Year</Text>
            <Text style={styles.detailValue}>{vehicle.year ? String(vehicle.year) : '—'}</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Fuel</Text>
            <Text style={styles.detailValue}>
              {fuel ? `${fuel.icon} ${fuel.label}` : vehicle.fuel_type}
            </Text>
          </View>
        </View>

        <View style={styles.cardActions}>
          <Pressable style={styles.editBtn} onPress={() => openEditForm(vehicle)}>
            <Text style={styles.editBtnText}>✏️ Edit</Text>
          </Pressable>
          <Pressable style={styles.deleteBtn} onPress={() => handleDelete(vehicle)}>
            <Text style={styles.deleteBtnText}>🗑️ Delete</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  // ---------- Screen ----------
  return (
    <DashboardShell items={customerNav} role="Customer">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Vehicles</Text>
          <Text style={styles.subtitle}>Manage your saved vehicles for faster service requests</Text>
        </View>

        {formVisible && renderForm()}

        {!formVisible && (
          <View style={styles.addAction}>
            <Pressable style={styles.addBtn} onPress={openAddForm}>
              <Text style={styles.addBtnText}>+ Add Vehicle</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.listSection}>
          <SectionHeader
            title={`Your Vehicles${vehicles.length ? ` (${vehicles.length})` : ''}`}
          />

          {loading ? (
            <LoadingState message="Loading your vehicles…" />
          ) : vehicles.length === 0 ? (
            <EmptyState
              icon="🚗"
              title="No vehicles yet"
              message="Add your first vehicle to start requesting mechanic services tailored to your car."
              actionLabel="Add Vehicle"
              onAction={openAddForm}
            />
          ) : (
            <View style={styles.list}>
              {vehicles.map(renderVehicleCard)}
            </View>
          )}
        </View>
      </View>
    </DashboardShell>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 900,
    width: '100%',
    alignSelf: 'center',
    padding: 24,
    paddingBottom: 100,
  },

  // ---- Header ----
  header: {
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 15,
    marginTop: 6,
  },

  // ---- Add button ----
  addAction: {
    marginBottom: 24,
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addBtnText: {
    color: COLORS.dark,
    fontSize: 16,
    fontWeight: '800',
  },

  // ---- List section ----
  listSection: {
    flex: 1,
  },
  list: {
    gap: 14,
  },

  // ---- Vehicle card ----
  vehicleCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  vehicleIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: `${COLORS.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  vehicleIcon: {
    fontSize: 26,
  },
  vehicleMain: {
    flex: 1,
  },
  vehicleReg: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  vehicleName: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  vehicleDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 3,
  },
  detailDivider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.border,
    marginHorizontal: 12,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
  },
  editBtn: {
    flex: 1,
    backgroundColor: `${COLORS.info}15`,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${COLORS.info}30`,
  },
  editBtnText: {
    color: COLORS.info,
    fontSize: 14,
    fontWeight: '700',
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: `${COLORS.error}15`,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${COLORS.error}30`,
  },
  deleteBtnText: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: '700',
  },

  // ---- Inline form ----
  formCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 24,
  },
  formHeader: {
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 8,
    marginTop: 14,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: COLORS.textPrimary,
  },

  // ---- Make chips ----
  makeScroll: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
  chip: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginHorizontal: 4,
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  chipTextSelected: {
    color: COLORS.dark,
    fontWeight: '800',
  },

  // ---- Fuel chips ----
  fuelRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  fuelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  fuelChipSelected: {
    backgroundColor: `${COLORS.primary}20`,
    borderColor: COLORS.primary,
  },
  fuelIcon: {
    fontSize: 15,
    marginRight: 6,
  },
  fuelChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  fuelChipTextSelected: {
    color: COLORS.primaryDark,
    fontWeight: '800',
  },

  // ---- Form actions ----
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 22,
  },
  btn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelBtnText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontWeight: '700',
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: COLORS.dark,
    fontSize: 15,
    fontWeight: '800',
  },
});
