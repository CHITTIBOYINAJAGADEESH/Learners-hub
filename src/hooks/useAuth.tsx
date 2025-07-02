
import { useState, useContext, createContext, useEffect } from 'react';
import { User, AuthState } from '@/types/fileAnalyzer';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, profilePicture?: File) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });
  const { toast } = useToast();

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('fileAnalyzer_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
      } catch {
        localStorage.removeItem('fileAnalyzer_user');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate login - in real app, this would be an API call
      const users = JSON.parse(localStorage.getItem('fileAnalyzer_users') || '[]');
      const user = users.find((u: User & { password: string }) => 
        u.email === email && u.password === password
      );

      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        setAuthState({
          user: userWithoutPassword,
          isAuthenticated: true,
          isLoading: false
        });
        localStorage.setItem('fileAnalyzer_user', JSON.stringify(userWithoutPassword));
        toast({
          title: "Login Successful",
          description: `Welcome back, ${user.name}!`
        });
        return true;
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: "An error occurred during login",
        variant: "destructive"
      });
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, profilePicture?: File): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('fileAnalyzer_users') || '[]');
      
      // Check if user already exists
      if (users.find((u: User) => u.email === email)) {
        toast({
          title: "Registration Failed",
          description: "User with this email already exists",
          variant: "destructive"
        });
        return false;
      }

      let profilePictureUrl = '';
      if (profilePicture) {
        // In a real app, you'd upload to cloud storage
        profilePictureUrl = URL.createObjectURL(profilePicture);
      }

      const newUser = {
        id: `user_${Date.now()}`,
        name,
        email,
        password, // In real app, this would be hashed
        profilePicture: profilePictureUrl,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('fileAnalyzer_users', JSON.stringify(users));

      const { password: _, ...userWithoutPassword } = newUser;
      setAuthState({
        user: userWithoutPassword,
        isAuthenticated: true,
        isLoading: false
      });
      localStorage.setItem('fileAnalyzer_user', JSON.stringify(userWithoutPassword));

      toast({
        title: "Registration Successful",
        description: `Welcome to File Analyzer, ${name}!`
      });
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Error",
        description: "An error occurred during registration",
        variant: "destructive"
      });
      return false;
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
    localStorage.removeItem('fileAnalyzer_user');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out"
    });
  };

  const updateProfile = (updates: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...updates };
      setAuthState(prev => ({
        ...prev,
        user: updatedUser
      }));
      localStorage.setItem('fileAnalyzer_user', JSON.stringify(updatedUser));
      
      // Update in users array
      const users = JSON.parse(localStorage.getItem('fileAnalyzer_users') || '[]');
      const userIndex = users.findIndex((u: User) => u.id === updatedUser.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem('fileAnalyzer_users', JSON.stringify(users));
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      register,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
