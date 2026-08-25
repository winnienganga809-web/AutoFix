import { Pressable, StyleSheet, Text, View, ScrollView, Platform } from 'react-native';
import { router, usePathname } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import { COLORS } from '@/components/ui/common';

export interface NavItem {
  label: string;
  icon: string;
  href: string;
}

export function DashboardNav({ items, role }: { items: NavItem[]; role: string }) {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

  const isActive = (href: string) => {
    const currentBase = pathname.split('/').slice(0, 3).join('/');
    const itemBase = href.split('/').slice(0, 3).join('/');
    return currentBase === itemBase;
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  if (Platform.OS === 'web') {
    return (
      <View style={webStyles.sidebar}>
        <View style={webStyles.brand}>
          <Text style={webStyles.logo}>AutoFix</Text>
          <Text style={webStyles.roleBadge}>{role}</Text>
        </View>
        <ScrollView style={webStyles.navScroll} showsVerticalScrollIndicator={false}>
          {items.map((item) => (
            <Pressable
              key={item.href}
              style={[webStyles.navItem, isActive(item.href) && webStyles.navItemActive]}
              onPress={() => router.push(item.href as any)}
            >
              <Text style={webStyles.navIcon}>{item.icon}</Text>
              <Text style={[webStyles.navLabel, isActive(item.href) && webStyles.navLabelActive]}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        <View style={webStyles.footer}>
          <View style={webStyles.userInfo}>
            <View style={webStyles.avatar}>
              <Text style={webStyles.avatarText}>{profile?.full_name?.charAt(0)?.toUpperCase() || '?'}</Text>
            </View>
            <View style={webStyles.userDetails}>
              <Text style={webStyles.userName} numberOfLines={1}>{profile?.full_name || 'User'}</Text>
              <Text style={webStyles.userEmail} numberOfLines={1}>{profile?.email}</Text>
            </View>
          </View>
          <Pressable style={webStyles.signOutBtn} onPress={handleSignOut}>
            <Text style={webStyles.signOutText}>Sign Out</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Mobile bottom nav
  return (
    <View style={mobileStyles.bottomNav}>
      {items.slice(0, 5).map((item) => (
        <Pressable
          key={item.href}
          style={[mobileStyles.navItem, isActive(item.href) && mobileStyles.navItemActive]}
          onPress={() => router.push(item.href as any)}
        >
          <Text style={[mobileStyles.navIcon, isActive(item.href) && mobileStyles.navIconActive]}>{item.icon}</Text>
          <Text style={[mobileStyles.navLabel, isActive(item.href) && mobileStyles.navLabelActive]}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const webStyles = StyleSheet.create({
  sidebar: { width: 240, backgroundColor: '#111827', height: '100%', flexShrink: 0 },
  brand: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#374151', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logo: { fontSize: 22, fontWeight: '900', color: COLORS.primary },
  roleBadge: { fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', backgroundColor: '#374151', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  navScroll: { flex: 1, padding: 12 },
  navItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10, marginBottom: 4 },
  navItemActive: { backgroundColor: 'rgba(245, 158, 11, 0.15)' },
  navIcon: { fontSize: 18, marginRight: 12 },
  navLabel: { fontSize: 14, fontWeight: '600', color: '#94A3B8' },
  navLabelActive: { color: COLORS.primary, fontWeight: '700' },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#374151' },
  userInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  avatarText: { fontSize: 16, fontWeight: '800', color: '#111827' },
  userDetails: { flex: 1 },
  userName: { fontSize: 13, fontWeight: '700', color: '#F1F5F9' },
  userEmail: { fontSize: 11, color: '#64748B', marginTop: 1 },
  signOutBtn: { backgroundColor: '#374151', borderRadius: 8, padding: 10, alignItems: 'center' },
  signOutText: { fontSize: 13, fontWeight: '700', color: '#CBD5E1' },
});

const mobileStyles = StyleSheet.create({
  bottomNav: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingBottom: 8, paddingTop: 6 },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  navItemActive: {},
  navIcon: { fontSize: 20, color: '#94A3B8' },
  navIconActive: { color: COLORS.primary },
  navLabel: { fontSize: 10, color: '#94A3B8', marginTop: 2, fontWeight: '600' },
  navLabelActive: { color: COLORS.primary, fontWeight: '700' },
});

export function DashboardShell({ children, items, role }: { children: React.ReactNode; items: NavItem[]; role: string }) {
  if (Platform.OS === 'web') {
    return (
      <View style={shellStyles.webContainer}>
        <DashboardNav items={items} role={role} />
        <ScrollView style={shellStyles.webContent} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      </View>
    );
  }
  return (
    <View style={shellStyles.mobileContainer}>
      <ScrollView style={shellStyles.mobileContent} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 70 }}>
        {children}
      </ScrollView>
      <DashboardNav items={items} role={role} />
    </View>
  );
}

const shellStyles = StyleSheet.create({
  webContainer: { flex: 1, flexDirection: 'row', backgroundColor: '#F7F8FA' },
  webContent: { flex: 1 },
  mobileContainer: { flex: 1, backgroundColor: '#F7F8FA' },
  mobileContent: { flex: 1 },
});
