'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Profile, UserRole } from '@/lib/types';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  role: UserRole;
  loading: boolean;
  signIn: (params: { email?: string; rollNo?: string; password: string }) => Promise<{ error: string | null }>;
  signUp: (params: {
    email: string;
    password: string;
    name: string;
    rollNo: string;
    contactNumber: string;
    branch: string;
    semester: number;
  }) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    setProfile(data as Profile | null);
  }, [supabase]);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
      setLoading(false);
    };
    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase, fetchProfile]);

  const signIn = useCallback(async ({
    email,
    rollNo,
    password,
  }: {
    email?: string;
    rollNo?: string;
    password: string;
  }) => {
    let loginEmail = email;

    // If logging in with roll_no, look up the email first
    if (rollNo && !email) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('email')
        .eq('roll_no', rollNo)
        .single();

      if (!profileData) {
        return { error: 'No account found with this Roll Number.' };
      }
      loginEmail = profileData.email;
    }

    if (!loginEmail) {
      return { error: 'Please provide an email or roll number.' };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password,
    });

    return { error: error?.message || null };
  }, [supabase]);

  const signUp = useCallback(async ({
    email,
    password,
    name,
    rollNo,
    contactNumber,
    branch,
    semester,
  }: {
    email: string;
    password: string;
    name: string;
    rollNo: string;
    contactNumber: string;
    branch: string;
    semester: number;
  }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          roll_no: rollNo,
          contact_number: contactNumber,
          branch,
          semester,
        },
      },
    });

    return { error: error?.message || null };
  }, [supabase]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, [supabase]);

  const role: UserRole = profile?.role || 'MEMBER';

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      role,
      loading,
      signIn,
      signUp,
      signOut,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
