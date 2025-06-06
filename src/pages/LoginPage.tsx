
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, Eye, EyeOff, User, GraduationCap, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<'student' | 'instructor' | 'admin'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Admin login check
      if (userType === 'admin') {
        if (email === 'admin@learnershub.com' && password === 'admin123') {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userRole', 'admin');
          localStorage.setItem('userEmail', email);
          
          // Track admin login
          const loginHistory = JSON.parse(localStorage.getItem('loginHistory') || '[]');
          loginHistory.unshift({
            id: Date.now(),
            email: email,
            role: 'admin',
            loginTime: new Date().toISOString(),
            name: 'System Administrator'
          });
          localStorage.setItem('loginHistory', JSON.stringify(loginHistory.slice(0, 50))); // Keep last 50 logins
          
          toast({
            title: "Admin Login Successful",
            description: "Welcome to the admin panel.",
          });

          setTimeout(() => {
            navigate('/admin');
          }, 1000);
          
          setIsLoading(false);
          return;
        } else {
          toast({
            title: "Admin Login Failed",
            description: "Invalid admin credentials.",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
      }

      // Get registered users
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      
      // Find user by email and role
      const user = registeredUsers.find((u: any) => 
        u.email === email && u.role === userType
      );

      if (!user) {
        toast({
          title: "Login Failed",
          description: `No ${userType} account found with this email.`,
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // For demo purposes, accept any password
      // In a real app, you'd verify the password hash
      
      // Set login state
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', userType);
      localStorage.setItem('userEmail', email);
      
      // Track login history
      const loginHistory = JSON.parse(localStorage.getItem('loginHistory') || '[]');
      loginHistory.unshift({
        id: Date.now(),
        email: email,
        role: userType,
        loginTime: new Date().toISOString(),
        name: user.name
      });
      localStorage.setItem('loginHistory', JSON.stringify(loginHistory.slice(0, 50))); // Keep last 50 logins
      
      toast({
        title: "Login Successful",
        description: `Welcome back! Redirecting to your ${userType} dashboard.`,
      });

      // Navigate based on user type
      setTimeout(() => {
        if (userType === 'student') {
          navigate('/student');
        } else if (userType === 'instructor') {
          navigate('/instructor');
        }
      }, 1000);

    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "An error occurred during login. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-lms-dark flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BookOpen className="h-10 w-10 text-lms-purple" />
            <span className="text-3xl font-poppins font-bold text-white">Learners Hub</span>
          </div>
          <h2 className="text-xl text-gray-300">Sign in to your account</h2>
        </div>

        {/* User Type Selection */}
        <div className="mb-6">
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setUserType('student')}
              className={`flex items-center justify-center space-x-1 py-3 px-2 rounded-lg border-2 transition-all text-sm ${
                userType === 'student'
                  ? 'border-lms-blue bg-lms-blue/10 text-lms-blue'
                  : 'border-gray-600 text-gray-400 hover:border-gray-500'
              }`}
            >
              <User className="h-4 w-4" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => setUserType('instructor')}
              className={`flex items-center justify-center space-x-1 py-3 px-2 rounded-lg border-2 transition-all text-sm ${
                userType === 'instructor'
                  ? 'border-lms-green bg-lms-green/10 text-lms-green'
                  : 'border-gray-600 text-gray-400 hover:border-gray-500'
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              <span>Instructor</span>
            </button>
            <button
              type="button"
              onClick={() => setUserType('admin')}
              className={`flex items-center justify-center space-x-1 py-3 px-2 rounded-lg border-2 transition-all text-sm ${
                userType === 'admin'
                  ? 'border-lms-purple bg-lms-purple/10 text-lms-purple'
                  : 'border-gray-600 text-gray-400 hover:border-gray-500'
              }`}
            >
              <Shield className="h-4 w-4" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="lms-input"
              placeholder={userType === 'admin' ? 'admin@learnershub.com' : 'Enter your email'}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="lms-input pr-10"
                placeholder={userType === 'admin' ? 'admin123' : 'Enter your password'}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {userType === 'admin' && (
            <div className="bg-lms-purple/10 border border-lms-purple/30 rounded-lg p-3">
              <p className="text-sm text-lms-purple">
                <strong>Admin Credentials:</strong><br />
                Email: admin@learnershub.com<br />
                Password: admin123
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full lms-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-lms-purple hover:text-purple-400 transition-colors">
              Sign up here
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link 
            to="/" 
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
