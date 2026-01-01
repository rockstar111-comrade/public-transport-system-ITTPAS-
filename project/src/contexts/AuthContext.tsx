//src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import type { Database } from "../lib/database.types";

// type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"] & {
  mobile?: string | null;
  aadhaar_no?: string | null;
  aadhaar_image?: string | null;
  is_aadhaar_verified?: boolean;
  aadhaar_verified_at?: string | null;
};


interface SignUpData {
  fullName: string;
  role: "passenger" | "conductor" | "meeseva";
  phone?: string;
  gender?: "male" | "female" | "other";
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, data: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Load profile safely
  const loadProfile = async (currentUser: User) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", currentUser.id)
      .maybeSingle();

    if (error) {
      console.error("Profile fetch failed:", error);
      setLoading(false);
      return;
    }

    if (!data) {
      const meta = currentUser.user_metadata || {};
      await supabase.from("profiles").insert({
        id: currentUser.id,
        full_name: meta.full_name ?? "",
        role: meta.role ?? "passenger",
        phone: meta.phone ?? null,
        gender: meta.gender ?? null,
        is_verified_woman: false,
      });

      const { data: newProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      setProfile(newProfile as Profile);
    } else {
      setProfile(data as Profile);
    }

    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;

    // ✅ HANDLE REFRESH PROPERLY
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;

      const sessionUser = data.session?.user ?? null;
      setUser(sessionUser);

      if (!sessionUser) {
        setLoading(false);
      } else {
        loadProfile(sessionUser);
      }
    });

    // ✅ HANDLE LOGIN / LOGOUT
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const authUser = session?.user ?? null;
        setUser(authUser);

        if (!authUser) {
          setProfile(null);
          setLoading(false);
        } else {
          loadProfile(authUser);
        }
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (
    email: string,
    password: string,
    data: SignUpData
  ) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: data.fullName,
          role: data.role,
          phone: data.phone,
          gender: data.gender,
        },
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
