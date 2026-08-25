import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Profile, UserRole } from '@/types/database';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string, phone: string, role: UserRole) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (uid: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }

    if (data) {
      setProfile(data as Profile);
    } else {
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userData.user.id,
            email: userData.user.email || '',
            full_name: userData.user.user_metadata?.full_name || '',
            phone: userData.user.user_metadata?.phone || '',
            role: (userData.user.user_metadata?.role as UserRole) || 'customer',
          });
        if (!insertError) {
          const { data: newProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', uid)
            .maybeSingle();
          if (newProfile) setProfile(newProfile as Profile);
        }
      }
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id).finally(() => { if (mounted) setLoading(false); });
      } else {
        setLoading(false);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        (async () => { await fetchProfile(session.user.id); })();
      } else {
        setProfile(null);
      }
    });

    return () => { mounted = false; authListener.subscription.unsubscribe(); };
  }, [fetchProfile]);

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id);
  }, [user, fetchProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  }, []);

  const signUp = useCallback(async (
    email: string, password: string, fullName: string, phone: string, role: UserRole
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName, phone, role } },
    });
    if (error) return { error: error.message };
    if (!data.user) return { error: 'Failed to create account.' };

    if (role === 'mechanic') {
      const { error: mpErr } = await supabase.from('mechanic_profiles').insert({ mechanic_id: data.user.id });
      if (mpErr && !mpErr.message.includes('duplicate')) { /* ok */ }
      const { error: mvErr } = await supabase.from('mechanic_verification').insert({ mechanic_id: data.user.id });
      if (mvErr && !mvErr.message.includes('duplicate')) { /* ok */ }
      const { error: mlErr } = await supabase.from('mechanic_locations').insert({ mechanic_id: data.user.id, is_online: false });
      if (mlErr && !mlErr.message.includes('duplicate')) { /* ok */ }
    }
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null); setSession(null); setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, signIn, signUp, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
