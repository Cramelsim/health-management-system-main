import { supabase, User } from './supabase';
import { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  isAdmin: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        
        if (!session.session) {
          if (mounted) {
            setUser(null);
            setIsLoading(false);
          }
          return;
        }

        const { data: userProfile, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.session.user.id)
          .single();
          
        if (!error && userProfile && mounted) {
          setUser({
            ...userProfile,
            id: session.session.user.id,
            email: session.session.user.email || '',
          } as User);
        } else {
          console.error('Error fetching user profile:', error);
          await supabase.auth.signOut();
          if (mounted) {
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error in initializeAuth:', error);
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        if (mounted) {
          setIsLoading(true);
        }
        try {
          const { data: userProfile, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (!error && userProfile && mounted) {
            setUser({
              ...userProfile,
              id: session.user.id,
              email: session.user.email || '',
            } as User);
            navigate('/');
          } else {
            console.error('Error fetching user profile:', error);
            await supabase.auth.signOut();
            if (mounted) {
              setUser(null);
            }
            toast.error('Failed to load user profile');
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
          toast.error('An unexpected error occurred');
          if (mounted) {
            setUser(null);
          }
        } finally {
          if (mounted) {
            setIsLoading(false);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        if (mounted) {
          setUser(null);
          setIsLoading(false);
          navigate('/login');
        }
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      const normalizedEmail = email.toLowerCase().trim();
      const trimmedPassword = password.trim();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: trimmedPassword,
      });

      if (error) {
        console.error('Sign in error:', error);
        return { 
          error: error.message === 'Invalid login credentials' 
            ? 'Invalid email or password. Please check your credentials and try again.'
            : 'An error occurred during sign in. Please try again.' 
        };
      }

      if (!data.user) {
        return { error: 'No user data returned from authentication service.' };
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected error during sign in:', error);
      return { error: 'An unexpected error occurred. Please try again later.' };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const value = {
    user,
    isLoading,
    signIn,
    signOut,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);